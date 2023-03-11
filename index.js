require("dotenv").config();

// import express
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./router");
const firebaseDecodeToken = require("./firebase/middleware");
// create app object
const app = express();

// define the PORT
const PORT = process.env.PORT || 8000;

// MIDDLEWARE
app.use(cors());
app.use(morgan("tiny")); // middleware for logging
app.use(express.urlencoded({ extended: true })); //middleware for parsing urlencoded data
app.use(express.json()); // middleware for parsing incoming json
app.use(firebaseDecodeToken); //authentication
app.use("/api", router); //init router
/////////////////////////////////////

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
