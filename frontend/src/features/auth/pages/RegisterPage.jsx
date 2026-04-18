import RegisterForm from "../RegisterForm";
import { Link } from "react-router-dom";
import { registerUser } from "./../api/auth.api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate(); 

  const handleRegister = async (payload) => {
    try {
      const response = await registerUser(payload);
      console.log("Register success:", response.data);

      navigate("/login");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <main>
      <h1>Register</h1>
      <p>Create your TaraSabay account.</p>

      <RegisterForm onSubmit={handleRegister} />

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
