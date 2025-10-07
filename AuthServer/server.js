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

app.listen(PORT, () => {
  console.log(`Server is on PORT:${PORT}`);
});
