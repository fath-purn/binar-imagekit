require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/images", express.static("public/images"));
app.use("/videos", express.static("public/videos"));
app.use("/documents", express.static("public/documents"));

const mediaRouter = require("./routes/media.routes.js");
app.use("/api/v1", mediaRouter);

const userRouter = require("./routes/profile.routes.js");
app.use("/api/v1", userRouter);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
    data: null,
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: err.message,
  });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log("listening on port", PORT));
