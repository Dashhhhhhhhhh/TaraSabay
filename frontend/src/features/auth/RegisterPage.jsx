import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <main>
      <h1>Register</h1>
      <p>Create your TaraSabay account.</p>

      <RegisterForm />

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
