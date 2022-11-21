require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/error.js");
const userRoute = require("./router/userRoute.js");

const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => console.log("Hey man...I'm ready to store yout Data"))
    .catch((err) => console.log(err));

app.use("/user", userRoute);

app.use(errorHandler)

app.listen(process.nextTick.PORT || 3000, () => {
  console.log(`I'm Express🚚 and I'm serving you on port ${process.env.PORT || 3000}`);
});