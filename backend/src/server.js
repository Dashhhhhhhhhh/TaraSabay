require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

const authRoutes = require("./modules/auth/auth.routes");
const driverRoutes = require("./modules/driver_profiles/driver.routes");

const rideOfferRoutes = require("./modules/ride_offers/ride_offers.routes");
const offerRequestRoutes = require("./modules/offer_requests/offer_requests.routes");
const rideRequestRoutes = require("./modules/ride_requests/ride_requests.routes");
const responseRequest = require("./modules/response_request/response_request.routes");
const messagesRoutes = require("./modules/messages/messages.routes");
const reportsRoutes = require("./modules/reports/reports.routes");

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);

app.use("/ride-offer", rideOfferRoutes);
app.use("/offer-request", offerRequestRoutes);
app.use("/ride-request", rideRequestRoutes);
app.use("/request-responses", responseRequest);
app.use("/messages", messagesRoutes);
app.use("/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaraSabay API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
