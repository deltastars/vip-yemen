import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        setLocation("/admin/dashboard");
      } else {
        setError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <ShieldCheck size={40} />
            </div>
            <h1>لوحة التحكم</h1>
            <p>سجّل الدخول للوصول إلى لوحة إدارة المنصة</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="admin-login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="admin-form-field">
              <label htmlFor="email">
                <Mail size={16} />
                <span>البريد الإلكتروني</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                required
                autoComplete="email"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="password">
                <Lock size={16} />
                <span>كلمة المرور</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء" : "إظهار"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>© 2026 ViP Yemen — المهندس علي درهم الدحان</p>
          </div>
        </div>
      </div>
    </div>
  );
}
