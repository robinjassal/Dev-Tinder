import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/auth/authSlice";

function Profile() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
    skills: user?.skills?.join(", ") || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);

    const payload = {
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      setSaved(true);
    }
  };

  return (
    <main className="page">
      <h1 className="page-title">Your profile</h1>

      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <div className="profile-preview">
          <div
            className="profile-avatar"
            style={{ backgroundImage: `url(${formData.photoUrl})` }}
          />
        </div>

        <label>
          First name
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last name
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            min="18"
            value={formData.age}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
        </label>

        <label>
          Photo URL
          <input
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <label>
          About
          <textarea
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleChange}
          />
        </label>

        <label>
          Skills (comma separated)
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />
        </label>

        {error && (
          <p className="status-text error">
            {typeof error === "string" ? error : "Could not update profile"}
          </p>
        )}
        {saved && <p className="status-text success">Profile updated!</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}

export default Profile;
