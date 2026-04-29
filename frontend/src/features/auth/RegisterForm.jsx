import { useState } from "react";
import { validateContactNumber } from "../../utils/helper";

function RegisterForm({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (contactNumber && !validateContactNumber(contactNumber)) {
      alert(
        "Please enter a valid Philippine contact number (e.g., 09123456789).",
      );
      return;
    }

    const payload = {
      first_name: firstName,
      middle_initial: middleInitial || null,
      last_name: lastName,
      email,
      password,
      contact_number: contactNumber || null,
      role_name: role,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="middle_initial">Middle Initial</label>
        <input
          id="middle_initial"
          type="text"
          placeholder="Enter your middle initial"
          value={middleInitial}
          onChange={(event) => setMiddleInitial(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          id="contactNumber"
          type="text"
          placeholder="Enter your contact number"
          value={contactNumber}
          onChange={(event) => setContactNumber(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          required
        >
          <option value="">--Select a Role</option>
          <option value="Passenger">Passenger</option>
          <option value="Driver">Driver</option>
        </select>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
