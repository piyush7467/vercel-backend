const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");



const expenseRouter = require("./App/routes/expenseRoutes.js");
const userRouter = require("./App/routes/userRoute.js");

const app = express();

// ✅ Middleware
// app.use(cors({
//   origin: "https://expense-tracker-daily.vercel.app", // frontend URL
//   methods: ["GET", "POST", "DELETE"],
//   credentials: true,
// }));

const corsOptions = {
  origin: "https://expense-tracker-daily.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(cookieParser());

app.use(express.json());

// ✅ MongoDB Connection Function (Auto-Reconnect)
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return; // already connected
    }
    await mongoose.connect(process.env.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
  }
};

// ✅ Ensure DB connection before routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ✅ Routes
app.use("/api/expense", expenseRouter);
app.use("/api/user", userRouter);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and connected to MongoDB");
});

// ✅ Export app for Vercel
module.exports = app;

// ✅ Local run (only when NODE_ENV=development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.port || 8000;
  app.listen(PORT, async () => {
    await connectDB(); // connect at startup
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
