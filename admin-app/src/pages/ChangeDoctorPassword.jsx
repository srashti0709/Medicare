
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { LockKeyhole, ShieldCheck, Eye, EyeOff } from "lucide-react";

const ChangeDoctorPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must be different from the temporary password.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      await api.patch(
        "/auth/change-doctor-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          ...user,
          mustChangePassword: false,
        })
      );

      navigate("/doctor-dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 44px 13px 14px",
    border: "1px solid #CBDAD6",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#404848",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  };

  const passwordField = (label, name, field, placeholder) => (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#164B4D",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={showPasswords[field] ? "text" : "password"}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="new-password"
          style={inputStyle}
        />

        <button
          type="button"
          onClick={() => togglePassword(field)}
          aria-label={
            showPasswords[field] ? "Hide password" : "Show password"
          }
          style={{
            position: "absolute",
            right: "13px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "#66817C",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          {showPasswords[field] ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F8F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "470px",
          background: "#FFFFFF",
          border: "1px solid #CBDAD6",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 12px 40px rgba(0, 52, 53, 0.07)",
        }}
      >
        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "15px",
            background: "#E7F4F1",
            color: "#164B4D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "22px",
          }}
        >
          <LockKeyhole size={27} />
        </div>

        <h1
          style={{
            color: "#003435",
            fontSize: "27px",
            fontWeight: 800,
            margin: "0 0 10px",
          }}
        >
          Create Your Password
        </h1>

        <p
          style={{
            color: "#64736F",
            fontSize: "14px",
            lineHeight: 1.7,
            margin: "0 0 26px",
          }}
        >
          You're using a temporary password provided by the administrator.
          Please create a new password to continue to your doctor dashboard.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            padding: "13px",
            background: "#E7F4F1",
            borderRadius: "10px",
            marginBottom: "24px",
            color: "#164B4D",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          <ShieldCheck size={19} style={{ flexShrink: 0 }} />
          <span>
            Choose a secure password with at least 8 characters.
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {passwordField(
            "Temporary Password",
            "currentPassword",
            "current",
            "Enter your temporary password"
          )}

          {passwordField(
            "New Password",
            "newPassword",
            "new",
            "Enter your new password"
          )}

          {passwordField(
            "Confirm New Password",
            "confirmPassword",
            "confirm",
            "Re-enter your new password"
          )}

          {error && (
            <div
              style={{
                background: "#FFF0EF",
                border: "1px solid #F2C5C1",
                color: "#B42318",
                borderRadius: "9px",
                padding: "12px",
                fontSize: "13px",
                marginBottom: "18px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: loading ? "#66817C" : "#003435",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Updating Password..." : "Change Password & Continue"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#82918D",
            fontSize: "12px",
            margin: "22px 0 0",
          }}
        >
          Medicare · Secure Doctor Access
        </p>
      </div>
    </div>
  );
};

export default ChangeDoctorPassword;
