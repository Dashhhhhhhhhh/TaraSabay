require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./modules/auth/auth.routes");
const driverRoutes = require("./modules/driver_profiles/driver.routes");

const rideOfferRoutes = require("./modules/ride_offers/ride_offers.routes");
const offerRequestRoutes = require("./modules/offer_requests/offer_requests.routes");
const rideRequestRoutes = require("./modules/ride_requests/ride_requests.routes");

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);

app.use("/ride-offer", rideOfferRoutes);
app.use("/offer-request", offerRequestRoutes);
app.use("/ride-request", rideRequestRoutes);

app.get("/test-route", (req, res) => {
  res.json({
    success: true,
    message: `Access granted`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
