const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const expenseRouter = require("./App/routes/expenseRoutes");
const userRouter = require("./App/routes/userRoute");

const app = express();


// =======================
// CORS Configuration
// =======================

const corsOptions = {
  origin: "https://expense-tracker-daily.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));


// =======================
// Middleware
// =======================

app.use(express.json());
app.use(cookieParser());


// =======================
// MongoDB Connection
// =======================

mongoose
  .connect(process.env.dbUrl)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });


// =======================
// Routes
// =======================

app.use("/api/expense", expenseRouter);
app.use("/api/user", userRouter);


// =======================
// Health Check Route
// =======================

app.get("/", (req, res) => {
  res.status(200).send("✅ Backend is live");
});


// =======================
// Export for Vercel
// =======================

module.exports = app;


// =======================
// Local Development
// =======================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}