require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./modules/auth/auth.routes");
const driverRoutes = require("./modules/driver_profiles/driver.routes");


app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
=======
const rideOfferRoutes = require("./modules/ride_offers/ride_offers.routes");

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
app.use("/offer", rideOfferRoutes);
>>>>>>> ab147cb (Initial TaraSabay backend setup with auth, driver profiles, and ride offers)

app.get("/test-route", (req, res) => {
  res.json({
    success: true,
    message: `Access granted`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
