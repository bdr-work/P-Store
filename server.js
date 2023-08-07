const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });

const databaseConnection = require("./database/config");
const mountRoutes = require("./Routes");
const ApiError = require("./Utils/apiError");
const globalError = require("./Middleware/errorMiddleware");

//Database Connection
// databaseConnection();
const app = express();
//Middleware
app.use(cors());
app.options("*", cors());
app.use(compression());
app.use(express.json());
//For Static Files Like Images
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode: " + process.env.NODE_ENV);
}

//Mount Routes
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});

//Global Error Middleware
app.use(globalError);
const port = process.env.PORT || 3000;
databaseConnection().then(() => {
  app.listen(port, () => {
    console.log("App run on port 3000");
  });
});
//----------------------------------------------------------------------
//Global error handler for rejection error مثل الاخطاء اللتي تجي من الداتابيس او اي شي خارج الاكسبرس
//بدل الكاتش !!!!!!!
//Event ==> listen ==> callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error ${err.name} |==> ${err.message}`);
  //نطفي السيرفر قبل ما يتقفل البرنامج عشان لو فيه ريكوست ينلغي
  server.close(() => {
    process.exit(1);
  });
});
