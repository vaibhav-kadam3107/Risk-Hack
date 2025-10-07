const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const CORS=require('cors');
require('dotenv').config();
const PORT=process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.use(CORS({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

const ITSO = require("./model/ITSO");
const Dev = require("./model/Dev");
const Account = require("./model/Account");
const Quiz=require('./model/Quiz');


mongoose.connect("mongodb://localhost:27017/RISK_HACK").then(()=>{
    console.log(`DB Connected`)
}).catch((err)=>{
    console.log(`Error While Connecting DB : ${err}`)
})

app.post("/register/account", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const existing = await Account.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already registered" });

    const newAccount = new Account({ name, email, role });
    await newAccount.save();

    res.status(201).json({ message: "Account created successfully", account: newAccount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/account/:email", async (req, res) => {
  try {
    const account = await Account.findOne({ email: req.params.email });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json(account);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/register/itso", async (req, res) => {
  try {
    const { name, team, psid, email, assignedEvaluation, experience } = req.body;

    const existing = await ITSO.findOne({ email });
    if (existing) return res.status(400).json({ message: "ITSO already registered" });

    const newItso = new ITSO({ name, team, psid, email, assignedEvaluation, experience });
    await newItso.save();

    res.status(201).json({ message: "ITSO registered successfully", itso: newItso });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/register/dev", async (req, res) => {
  try {
    const { name, psid ,team, pod, badges, highScore, testsTaken, itsoName, designation, email,rank} = req.body;

    const existing = await Dev.findOne({ email });
    if (existing) return res.status(400).json({ message: "Developer already registered" });

    const newDev = new Dev({ name, psid ,team, pod, badges, highScore, testsTaken, itsoName, designation, email ,rank});
    await newDev.save();

    res.status(201).json({ message: "Developer registered successfully", developer: newDev });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.get("/itso/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // find developer by email
    const itso = await ITSO.findOne({ email });

    if (!itso) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.json(itso);
  } catch (error) {
    console.error("Error fetching developer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/dev/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // find developer by email
    const dev = await Dev.findOne({ email });

    if (!dev) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.json(dev);
  } catch (error) {
    console.error("Error fetching developer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/itso/:email/devs", async (req, res) => {
  try {
    const { email } = req.params;

    const itso = await ITSO.findOne({ email });
    if (!itso) {
      return res.status(404).json({ message: "ITSO not found" });
    }

    const devs = await Dev.find({ team: itso.team });

    res.json({
      itso: itso.name,
      team: itso.team,
      developers: devs,
    });

  } catch (err) {
    console.error("Error fetching ITSO developers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/quizzes", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/update-after-quiz", async (req, res) => {
  try {
    const { email, score, quizTitle, questions } = req.body;

    let dev = await Dev.findOne({ email });
    if (!dev) {
      return res.status(404).json({ message: "User not found" });
    }

    if (score > dev.highScore) {
      dev.highScore = score;
    }

    dev.testsTaken.push({
      quizTitle,
      score,
      questions,
    });

    await dev.save();
    res.json({ message: "User updated successfully", dev });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/badges/update", async (req, res) => {
  try {
    const { email, badges } = req.body;

    if (!email || !Array.isArray(badges)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // Find the user by email
    const dev = await Dev.findOne({ email });
    if (!dev) {
      return res.status(404).json({ error: "Dev not found" });
    }

    // Merge new badges with existing ones (prevent duplicates)
    const updatedBadges = Array.from(new Set([...(dev.badges || []), ...badges]));

    // Save to DB
    dev.badges = updatedBadges;
    await dev.save();

    res.json({ success: true, badges: updatedBadges });
  } catch (err) {
    console.error("Error updating badges:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/quizzes/:id/review", async (req, res) => {
  try {
    const { id } = req.params
    const {
      reviewerName,
      reviewerEmail,
      reviewerImage,
      reviewerRole,
      content,
      attachments,
    } = req.body

    // ✅ Validation
    if (!reviewerName || !reviewerEmail || !content) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // ✅ Create review object
    const review = {
      reviewerName,
      reviewerEmail,
      reviewerImage: reviewerImage || "",
      reviewerRole: reviewerRole || "Developer",
      content, // 👈 Make sure content is saved
      attachments: attachments || [],
      createdAt: new Date(),
    }

    // ✅ Push review into quiz document
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { $push: { reviews: review } },
      { new: true }
    )

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }

    res.json({ message: "Review added successfully", quiz: updatedQuiz })
  } catch (err) {
    console.error("Error adding review:", err)
    res.status(500).json({ error: "Server error", details: err.message })
  }
})



app.get("/leaderboard", async (req, res) => {
  try {
   
    const devs = await Dev.find({})
      .sort({ highScore: -1 })
      .limit(50);

    
    const leaderboard = devs.map((u, index) => ({
      rank: index + 1,
      name: u.name,
      team: u.team,
      score: u.highScore,
      quizzes: u.testsTaken?.length || 0,
      trend: "same",
      badge:
        u.highScore >= 35
          ? "Elite"
          : u.highScore >= 30
          ? "High"
          : u.highScore >= 25
          ? "Medium"
          : "Starter",
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is on PORT:${PORT}`);
});
