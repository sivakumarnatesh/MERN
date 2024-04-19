const express = require("express");
const app = express();

const mongoose = require("mongoose");
const StudentModel = require("./Schema");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000; // Default port 5000 if PORT is not defined in .env

//use body parser for sending payloads
app.use(bodyParser.json());

//use cors for giving access to our app
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//connect with mongo DB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// login API
app.post("/login", async (request, response) => {
  const { email, password } = request?.body;
  console.log("email", email);
  console.log("password", password);
  const registeredEmail = await StudentModel.findOne({ email });

  if (registeredEmail) {
    if (registeredEmail?.password === password) {
      response.send("success");
    } else {
      response.status(401).send("Invalid password");
    }
  } else {
    response.send("Invalid Credentials");
  }
});

// Sign up API
app.post("/register", async (request, response) => {
  try {
    const { name, age, gender, email, password, city, state, country } =
      request.body;
    const newStudent = await StudentModel.create({
      name,
      age,
      gender,
      email,
      password,
      city,
      state,
      country,
    });
    console.log("New student registered:", newStudent);
    response.json(newStudent);
  } catch (error) {
    console.log("Error:", error);
    response
      .status(500)
      .json({ error: "An error occurred while registering the student." });
  }
});

// get users API
app.get("/getUsers", async (request, response) => {
  try {
    const users = await StudentModel.find({});
    response.json(users);
  } catch (err) {
    console.log("error", err);
    response.status(500).json({ error: "An error occured" });
  }
});

//delete user by id
app.delete(`/delete/:id`, async (request, response) => {
  try {
    console.log("request", request?.params?.id);
    // console.log('id',id);
    const deleteById = await StudentModel.findByIdAndDelete(
      request?.params?.id
    );
    response.json(deleteById);
  } catch (err) {
    console.log("err", err);
    response.status(500).json({ error: "An error occured" });
  }
});

//update user by id
app.put(`/update/:id`, async (request, response) => {
  try {
    const payload = request?.body;
    console.log(request?.body,"request", request?.params?.id);
    // console.log('id',id);
    const updateById = await StudentModel.findByIdAndUpdate(
      request?.params?.id,
      payload
    );
    response.json(updateById);
  } catch (err) {
    console.log("err", err);
    response.status(500).json({ error: "An error occured" });
  }
});
