const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const User = require("./users.model")
require('dotenv').config()
mongoose
  .connect("mongodb://127.0.0.1:27017/nodeLearning", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app
  .route("/api/users")
  .post(async (req, res) => {
    const user = await User.create({username: req.body.username})
    res.json(user)
  })
  .get(async (req,res) => {
    const users = await User.find().select("_id username")
    res.json(users)
  })

app.post("/api/users/:_id/exercises", async(req, res)=>{
  const {description, duration, date} = req.body;
  const user = await User.findById(req.params._id)
  const exerciseDate = date
      ? new Date(date).toDateString()
      : new Date().toDateString();
  // const exercise = {
  //   description: description,
  //   duration: Number(duration),  
  //   date: exerciseDate
  // };
  // user.description = description;
  // user.duration = Number(duration);
  // user.date = exerciseDate
  user.log.push({
    description: description,
    duration: Number(duration),
    date: exerciseDate
  })
  await user.save()
  const responseObject = {
    username: user.username,
    description: description,
    duration: Number(duration),
    date: exerciseDate,
    _id: user._id,
  };
  return res.json(responseObject)
})

app.get("/api/users/:_id/logs", async (req, res) => {
  const user = await User.findById(req.params._id)
  if (Object.keys(req.query).length !== 0) {
    const {from, to , limit} = req.query
    let logs = user.log;

    if (limit) {
      logs = logs.slice(0, Number(limit)); 
    }
    if (from & to) {
      const fromDate = new Date(from).toDateString(); 
      const toDate = new Date(to).toDateString()
      logs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= fromDate && logDate <= toDate;
      });
    }
    return res.json({
      username: user.username,
      count: Number(logs.length), 
      _id: user._id,
      log: logs 
    });
  }

  return res.json({
    username: user.username,
    count: Number(user.log.length),
    _id: user._id,
    log: user.log
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
