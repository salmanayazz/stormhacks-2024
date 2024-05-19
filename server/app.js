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

const createInterviewQuestions = async (position, company, jobPosting, kind) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Please create 5" + kind + "interview questions for the position" + position + "for the company" + company + "with the position description:" + jobPosting }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chat completion");
  }
};

app.post("/interviews", async (req, res) => {
  try {
    const { position, company, jobPosting } = req.body;

    let getTechQuestions = await createInterviewQuestions(position, company, jobPosting, "Technical");
    let getBehavQuestions = await createInterviewQuestions(position, company, jobPosting, "Behavorial");

    const techArray = func(getTechQuestions);
    const behavArray = func(getBehavQuestions);

    let i = 0;
    while (i < techArray.length) {

      await InterviewModel.create({
        username: req.session.username,
        company: company,
        position: position,
        jobPosition: jobPosting,
        info: [{
          kind: "technical",
          question: techArray[i],
          answer: '',
          feedback: ''
        }]
      });

      await InterviewModel.create({
        username: req.session.username,
        company: company,
        position: position,
        jobPosition: jobPosting,
        info: [{
          kind: "Behavorial",
          question: behavArray[i],
          answer: '',
          feedback: ''
        }]
      });

      i++;
    }

    


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
