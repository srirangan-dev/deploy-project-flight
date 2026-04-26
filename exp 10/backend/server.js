const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://deploy-project-flight.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/flights",  require("./routes/flights.routes"));
app.use("/api/bookings", require("./routes/bookings.routes"));
app.use("/api/payments", require("./routes/payments.routes"));

app.get("/", (req, res) => res.json({ message: "SkyBook API running ✈" }));

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);