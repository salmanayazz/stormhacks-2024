var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
var cors = require("cors");
var dotenv = require("dotenv");
var mongoose = require("mongoose");

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (reg, file, cb) {
    cb(null, "./files")
  },
  filename: function (reg, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})
const upload = multer({ storage: storage })

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

const { InterviewModel } = require("./models/Interview");
const { QuestionsModel } = require("./models/Questions");

let OpenAI = require('openai');
const { UserModel } = require("./models/User");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}
mongoose.connect(process.env.MONGODB_URI);
console.log(process.env.MONGODB_URI);
mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "secret",
    store:
      process.env.NODE_ENV ===
      MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "sessions",
      }),
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.get("/openai", async (req, res) => {
  let content = await main();
  res.send(content);
})

// resume parsing to String
const pdfParse = require("pdf-parse");
const { ResumeModel } = require("./models/Resume");

app.post("/uploadresume", upload.single("file"), async (req, res) => {
  try {
    const result = await pdfParse(req.file.path);
    const existingResume = await ResumeModel.findOne({ username: req.session.username });

    if (existingResume) {
      existingResume.parsedResume = result.text;
      await existingResume.save();
      res.status(200).send("Resume updated successfully");
    } else {
      await ResumeModel.create({
        username: req.session.username,
        parsedResume: result.text
      });
      res.status(200).send("New resume created");
    }
  } catch (erer) {
    console.error("Error processing upload:", err);
    res.status(500).send("Error processing upload");
  }
});

const createInterviewQuestions = async (position, company, jobPosting, kind) => {
  try {
    const response = await openai.chat.completions.create({
      //model: "gpt-3.5-turbo",
      model: "gpt-4o",
      messages: [{ role: "user", content: "Please create 5" + kind + "interview questions for the position" + position + "for the company" + company + "with the position description:" + jobPosting + "Please provide only the questions and number them and don't provide any heading or sub-headings" }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
};

const createInterviewQuestionsWithResume = async (resume, position, company, jobPosting, kind) => {
  try {
    const response = await openai.chat.completions.create({
      //model: "gpt-3.5-turbo",
      model: "gpt-4o",
      messages: [{ role: "user", content: "Here is the resume of the candidate:" + resume + "Please create 5" + kind + "interview questions for the position" + position + "for the company" + company + "with the position description:" + jobPosting + "Please provide only the questions and number them and don't provide any heading or sub-headings" }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
};

// parse the OpenAI response into different questions

const parseInterviewQuestion = (value) => {
  const questions = value.split(/(?=\d\.\s)/);
  const listOfQuestions = questions.map(q => q.replace(/^\d\.\s/, ''))
  return listOfQuestions;
}

// return a list of id's of all technical + behavioral questions

async function createQuestionsInDatabase(questionsArray, kind) {
  const createdQuestions = [];
  for (const question of questionsArray) {
    try {
      const currInstance = await QuestionsModel.create({
        kind: kind,
        question: question,
        answer: '',
        feedback: ''
      });
      createdQuestions.push(currInstance._id);
    } catch (error) {
      console.error(`Error creating question:`, error);
    }
  }
  return createdQuestions;
}

app.use("/interviews", async (req, res, next) => {
  if (req.session && req.session.username) {
    return next();
  }

  return res.status(401).json({ other: "Unauthorized" });
});

app.get("/interviews", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.session.username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const interviewPromises = user.interviewList.map(interviewId =>
      InterviewModel.findById(interviewId).populate('info').exec()
    );

    const interviews = await Promise.all(interviewPromises);

    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});


app.post("/interviews", async (req, res) => {
  try {
    const { position, company, jobPosting } = req.body;

    // TODO: validate the arguments

    const check = await UserModel.findOne({ username: req.session.username });

    let getTechQuestions = ""
    let getBehavQuestions = ""

    if (check) {
      const resume = check.parsedResume;
      getTechQuestions = await createInterviewQuestionsWithResume(resume, position, company, jobPosting, "Technical");
      getBehavQuestions = await createInterviewQuestionsWithResume(resume, position, company, jobPosting, "Behavioral");
    }
    else {
      getTechQuestions = await createInterviewQuestions(position, company, jobPosting, "Technical");
      getBehavQuestions = await createInterviewQuestions(position, company, jobPosting, "Behavioral");
    }

    const techQuestions = parseInterviewQuestion(getTechQuestions);
    const behavQuestions = parseInterviewQuestion(getBehavQuestions);

    const techQuestionIds = await createQuestionsInDatabase(techQuestions, "Technical");
    const behavQuestionIds = await createQuestionsInDatabase(behavQuestions, "Behavioral");

    const interview = await InterviewModel.create({
      //username: req.session.username,
      company: company,
      position: position,
      jobPosting: jobPosting,
      info: techQuestionIds.concat(behavQuestionIds)
    });

    const username = req.session.username;
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("User not found");
      return;
    }
    user.interviewList.push(interview._id);
    await user.save();

    res
      .status(200)
      .json({ _id: interview._id });
  }
  catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to generate prompts and paragraphs" });
  }
});

const answerFeedback = async (position, company, jobPosting, question, answer) => {
  try {
    const feedback = await openai.chat.completions.create({
      //model: "gpt-3.5-turbo",
      model: "gpt-4o",
      messages: [{
        role: "user", content: "Please provide me some feedback (100-200 words) on the interview question that was asked to me:" + question
          + "for the position" + position + "for the company" + company + "with the position description:" + jobPosting + "to which I responded with:" + answer +
          "Please jump straight to feedback and don't provide any introductions, heading or sub-headings"
      }]
    });

    return feedback.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
};

const answerFeedbackWithResume = async (resume, position, company, jobPosting, question, answer) => {
  try {
    const feedback = await openai.chat.completions.create({
      //model: "gpt-3.5-turbo",
      model: "gpt-4o",
      messages: [{
        role: "user", content: "Here is my resume:" + resume + "Please provide me some feedback (100-200 words) on the interview question that was asked to me:" + question
          + "for the position" + position + "for the company" + company + "with the position description:" + jobPosting + "to which I responded with:" + answer + "Please jump straight to feedback and don't provide any introductions, heading or sub-headings"
      }]
    });

    return feedback.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
};

app.post('/interview/:interviewID/question/:questionID', async (req, res) => {
  try {
    const interviewID = req.params.interviewID;
    const questionID = req.params.questionID;

    const { ans } = req.body;

    const interview = await InterviewModel.findById(interviewID).populate('info');
    if (!interview) {
      return res.status(404).send('Interview not found');
    }
    const { company, position, jobPosting, info } = interview;

    const questionModel = await QuestionsModel.findById(questionID);
    if (!questionModel) {
      return res.status(404).send('Question not found');
    }
    const { kind, question, answer, feedback } = questionModel;

    const check = await UserModel.findOne({ username: req.session.username });

    let feed = ""
    if (check) {
      const resume = check.parsedResume;
      feed = await answerFeedbackWithResume(resume, position, company, jobPosting, question, answer);
    }
    else {
      feed = await answerFeedback(position, company, jobPosting, question, answer);
    }

    const updatedQuestion = await QuestionsModel.findByIdAndUpdate(
      questionID,
      { $set: { answer: ans, feedback: feed } },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).send('Question not found');
    }

    res.status(200).json({
      message: 'Interview found',
      interviewDetails: { company, position, jobPosting, info },
      questionDetails: { kind, question, answer, feedback }
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).send('Internal Server Error');
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Please create 5 technical and 5 behavorial interview questions for the position Software Engineer for the company Amazon with the position description Design, develop, and maintain high-performance, scalable software applications" }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
}

module.exports = app;
