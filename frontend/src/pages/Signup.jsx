import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../features/auth/authSlice";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));
    if (signupUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  return (
    <main className="page auth-page">
      {/* <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" /> */}

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Join DevTinder</h1>
        <p className="auth-subtitle">Create your account</p>

        <label>
          First name
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            minLength={4}
          />
        </label>

        <label>
          Last name
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="emailId"
            type="email"
            value={formData.emailId}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && (
          <p className="status-text error">
            {typeof error === "string" ? error : "Signup failed"}
          </p>
        )}
        {success && (
          <p className="status-text success">
            Account created! Redirecting to login...
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
