import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    API.get("/user/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await API.put("/user/profile/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="prof-page">
        <p className="prof-empty">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="prof-page">
        <p className="prof-empty">Could not load profile. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="prof-page">
      <nav className="prof-breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>Profile</span>
      </nav>

      <header className="prof-hero">
        <div className="prof-hero-left">
          <div className="prof-avatar">
            {(user.name || "U")
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="prof-eyebrow">Account</p>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
        <Link to="/dashboard" className="prof-back">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <div className="prof-grid">
        <section className="prof-card">
          <h2>Profile details</h2>
          <div className="prof-fields">
            <div>
              <span>Full name</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{user.role || "student"}</strong>
            </div>
            <div>
              <span>Email verified</span>
              <strong>{user.isEmailVerified ? "Yes" : "No"}</strong>
            </div>
            {user.profile?.education_level && (
              <div>
                <span>Education</span>
                <strong>{user.profile.education_level}</strong>
              </div>
            )}
            {user.profile?.target_exam?.length > 0 && (
              <div>
                <span>Target exams</span>
                <strong>
                  {Array.isArray(user.profile.target_exam)
                    ? user.profile.target_exam.join(", ")
                    : user.profile.target_exam}
                </strong>
              </div>
            )}
          </div>
        </section>

        <section className="prof-card">
          <h2>Change password</h2>
          <form onSubmit={handlePasswordChange} className="prof-form">
            <label>
              Current password
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
                required
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, newPassword: e.target.value }))
                }
                required
                minLength={6}
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                required
                minLength={6}
              />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? "Updating…" : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
