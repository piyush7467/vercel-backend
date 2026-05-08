const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");



const expenseRouter = require("./App/routes/expenseRoutes.js");
const userRouter = require("./App/routes/userRoute.js");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "https://expense-tracker-daily.vercel.app", // frontend URL
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json());

// ✅ MongoDB Connection Function (Aconst express = require("express");
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
}uto-Reconnect)
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
