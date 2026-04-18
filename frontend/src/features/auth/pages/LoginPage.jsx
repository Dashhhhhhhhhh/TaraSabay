import { Link } from "react-router-dom";
import LoginForm from "../LoginForm";

function LoginPage() {
  return (
    <main>
      <h1>TARASABAY</h1>
      <p>
        TaraSabay makes daily commuting easier by helping communities share
        rides, save gas, and save money.
      </p>
      <h1>Login</h1>
      <p>Sign in to your TaraSabay account.</p>

      <LoginForm />

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}

export default LoginPage;
