const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/User");

const router = express.Router();

async function getUser(req, res, next) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password) {
      return res.status(400).json({
        username: "Username is required",
        password: "Password is required",
      });
    } else if (!username) {
      return res.status(400).json({ username: "Username is required" });
    } else if (!password) {
      return res.status(400).json({ password: "Password is required" });
    }

    const user = await UserModel.findOne({ username: username });

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ other: "Internal server error" });
  }
}

router.post(
  "/signup",
  getUser,
  async function (req, res) {
    try {
      const user = req.user;
      const username = req.body.username;
      const password = req.body.password;

      if (user) {
        return res.status(409).json({ username: "Username is taken" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.create({
        username: username,
        password: hashedPassword,
      });

      req.session.username = username;

      return res.status(201).send("User created");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ other: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  getUser,
  async function (req, res) {
    try {
      const user = req.user;
      const username = req.body.username;
      const password = req.body.password;

      if (!user) {
        return res.status(404).json({ username: "User does not exist" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ password: "Incorrect password" });
      }

      req.session.username = username;

      return res.status(200).json({ user: { username: req.session.username } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ other: "Internal server error" });
    }
  }
);

router.get("/login", async function (req, res) {
  try {
    if (req.session.username) {
      return res.status(200).json({ user: { username: req.session.username } });
    } else {
      return res.status(401).json({ other: "No valid session" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ other: "Internal server error" });
  }
});

router.delete("/logout", function (req, res) {
  if (!req.session.username) {
    return res.status(401).json({ other: "No valid session" });
  }

  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ other: "Internal server error" });
    }
    return res.status(200).send("Successfully logged out");
  });
});

module.exports = router;