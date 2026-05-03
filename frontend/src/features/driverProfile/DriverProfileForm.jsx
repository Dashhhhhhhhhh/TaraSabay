import { useState } from "react";
import { cleanName } from "../../utils/helper";

function DriverProfileForm({ onSubmit, initialValues }) {
  const [vehicle_type, setVehicleType] = useState(
    initialValues?.vehicle_type || "",
  );
  const [seatCapacity, setSeatCapacity] = useState(
    initialValues?.seat_capacity || "",
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanVehicleType = cleanName(vehicle_type);
    const allowedVehicleType = ["sedan", "van", "suv", "motorcycle"];
    if (!allowedVehicleType.includes(cleanVehicleType)) {
      alert("Vehicle type must be one of: sedan, van, SUV, or motorcycle.");
      return;
    }

    const parsedSeatCapacity = Number(seatCapacity);
    if (!Number.isInteger(parsedSeatCapacity)) {
      alert("Seat capacity must be a valid number.");
      return;
    }

    const payload = {
      vehicle_type: cleanVehicleType,
      seat_capacity: parsedSeatCapacity,
    };

    if (initialValues?.driver_profile_id) {
      onSubmit(initialValues.driver_profile_id, payload);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="vehicle_type">Vehicle Type</label>
        <select
          id="vehicle_type"
          value={vehicle_type}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">-- Select Vehicle Type --</option>
          <option value="sedan">Sedan</option>
          <option value="van">Van</option>
          <option value="suv">SUV</option>
          <option value="motorcycle">Motorcycle</option>
        </select>
      </div>
      <div>
        <label htmlFor="seat_capacity">Seat Capacity</label>
        <input
          id="seat_capacity"
          type="number"
          value={seatCapacity}
          onChange={(e) => setSeatCapacity(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {initialValues ? "Update Driver Profile" : "Create Driver Profile"}
      </button>
    </form>
  );
}

export default DriverProfileForm;
