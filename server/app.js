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

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

const { InterviewModel } = require("./models/Interview");

let OpenAI = require('openai');

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

const createInterviewQuestions = async (position, company, jobPosting) => {
  try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Please create 5 technical and 5 behavorial interview questions for the position" + position + "for the company" + company + "with the position description:" + jobPosting}]
  });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate chat completion");
    }
};

const parseInterviewQuestion = (value) =>{
  const questions = str.split(/(?=\d\.\s)/);
  const listOfQuestions = questions.map(q => q.replace(/^\d\.\s/, ''))
  return listOfQuestions;
}

app.post("/interviews", async (req, res) => {
  try {
    const { position, company, jobPosting } = req.body;
    let getQuestions = await createInterviewQuestions(position, company, jobPosting);
    const listOfQuestions = parseInterviewQuestion(getQuestions);
    const newInterview = await InterviewModel.create({
      username: req.session.username,
      questions: listOfQuestions,
    });
    res
      .status(200)
      .json("Data Entered");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to generate prompts and paragraphs" });
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

async function main(){
  // const completion = await openai.chat.completions.create({
  //   messages: [{ role: "system", content: "Qualifications include a Degree in Architecture, Urban Land Economics, Urban Planning and Design, or Engineering in addition to a minimum of 10 years of relevant experience in development and construction in a leadership role and/or an equivalent combination of education, training and experience. The role requires thorough knowledge of architectural design, facility planning, engineering and construction principles and practices as well as BC Building Code, the rules, regulations, and policies governing the construction industry; and Project Management Body of Knowledge (PMBOK) guidelines and standards. You will have the ability to direct the initiation and planning of a variety of major civic buildings and facilities; establish and maintain effective working relationships with a wide variety of internal and external contacts and stakeholders. Working independently and within a team environment, you will partake in problem solving; establishing priorities and accomplish objectives in a timely manner; as well as leading and resolving contract disputes. Other skills required would include the use of various software applications such as MS Office, Enterprise Resource Planning (ERP) and Project Management software. A Driver’s Licence for the Province of British Columbia"}],
  //   model: "gpt-3.5-turbo",
  // });

  // return completion.choices[0].message.content;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Please create 5 technical and 5 behavorial interview questions for the position Software Engineer for the company Amazon with the position description Design, develop, and maintain high-performance, scalable software applications"}]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
}





module.exports = app;
