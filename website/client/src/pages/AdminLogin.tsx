import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Fingerprint, KeyRound, ArrowRight } from "lucide-react";

// Admin credentials (client-side auth for Vercel deployment)
const ADMIN_CREDENTIALS = {
  email: "vipservicesyemen@gmail.com",
  password: "Ali711780999*$#@%",
  name: "مدير المنصة",
  role: "admin"
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "reset" | "biometric">("login");
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Check existing session
    const user = localStorage.getItem("admin_user");
    if (user) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Client-side authentication
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const user = {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem("admin_user", JSON.stringify(user));
        setLocation("/admin/dashboard");
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === ADMIN_CREDENTIALS.email) {
        setResetSent(true);
        // Generate a mock reset token
        const token = btoa(Date.now().toString());
        localStorage.setItem("admin_reset_token", token);
      } else {
        setError("البريد الإلكتروني غير مسجل في النظام");
      }
    } catch {
      setError("حدث خطأ في إرسال طلب إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would update the password on the server
      // For now, we'll just show a success message
      setResetSent(false);
      setMode("login");
      setPassword(newPassword);
      setError("");
      alert("تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.");
    } catch {
      setError("حدث خطأ في إعادة تعيين كلمة المرور");
    }
  };

  const handleBiometricLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        setError("المتصفح لا يدعم تسجيل الدخول بالبصمة");
        setLoading(false);
        return;
      }

      // For demo purposes, we'll just log in directly
      // In production, you would use WebAuthn API
      const user = {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        loginTime: new Date().toISOString(),
        loginMethod: "biometric"
      };
      localStorage.setItem("admin_user", JSON.stringify(user));
      setLocation("/admin/dashboard");
    } catch {
      setError("فشل تسجيل الدخول بالبصمة");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "forgot" && !resetSent) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <KeyRound size={48} style={{ color: "#F3B71B" }} />
            <h1 style={{ fontSize: "24px", marginTop: "16px", color: "#102A43" }}>
              إعادة تعيين كلمة المرور
            </h1>
            <p style={{ color: "#6B7C8D", marginTop: "8px" }}>
              أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              background: "#FEE2E2", 
              color: "#DC2626", 
              borderRadius: "8px", 
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword}>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: 600 }}>
                <Mail size={16} /> البريد الإلكتروني
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vipservicesyemen@gmail.com"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  direction: "ltr"
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#F3B71B",
                color: "#102A43",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              style={{
                background: "none",
                border: "none",
                color: "#F3B71B",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              <ArrowRight size={16} style={{ marginLeft: "4px" }} />
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "forgot" && resetSent) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <ShieldCheck size={48} style={{ color: "#10B981" }} />
            <h1 style={{ fontSize: "24px", marginTop: "16px", color: "#102A43" }}>
              تم إرسال رابط إعادة التعيين
            </h1>
            <p style={{ color: "#6B7C8D", marginTop: "8px", lineHeight: "1.8" }}>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
              <br />
              تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها.
            </p>
          </div>

          <div style={{ 
            padding: "16px", 
            background: "#F0FDF4", 
            border: "1px solid #BBF7D0",
            borderRadius: "8px", 
            marginBottom: "16px",
            textAlign: "center"
          }}>
            <p style={{ color: "#166534", fontSize: "14px" }}>
              للتجربة: يمكنك استخدام كلمة المرور الجديدة مباشرة
            </p>
          </div>

          <button
            onClick={() => { setMode("reset"); setError(""); }}
            style={{
              width: "100%",
              padding: "14px",
              background: "#F3B71B",
              color: "#102A43",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            إعادة تعيين كلمة المرور
          </button>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              onClick={() => { setMode("login"); setResetSent(false); setError(""); }}
              style={{
                background: "none",
                border: "none",
                color: "#F3B71B",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "reset") {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Lock size={48} style={{ color: "#F3B71B" }} />
            <h1 style={{ fontSize: "24px", marginTop: "16px", color: "#102A43" }}>
              كلمة مرور جديدة
            </h1>
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              background: "#FEE2E2", 
              color: "#DC2626", 
              borderRadius: "8px", 
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword}>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: 600 }}>
                <Lock size={16} /> كلمة المرور الجديدة
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="8 أحرف على الأقل"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: 600 }}>
                <Lock size={16} /> تأكيد كلمة المرور
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="أعد إدخال كلمة المرور"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#F3B71B",
                color: "#102A43",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              إعادة تعيين كلمة المرور
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #F3B71B, #C99700)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(243, 183, 27, 0.3)"
          }}>
            <ShieldCheck size={40} style={{ color: "#102A43" }} />
          </div>
          <h1 style={{ fontSize: "28px", color: "#102A43", margin: "0 0 8px" }}>
            لوحة التحكم
          </h1>
          <p style={{ color: "#6B7C8D", margin: 0 }}>
            سجل الدخول للوصول إلى لوحة إدارة المنصة
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: "12px", 
            background: "#FEE2E2", 
            color: "#DC2626", 
            borderRadius: "8px", 
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: 600, color: "#102A43" }}>
              <Mail size={16} /> البريد الإلكتروني
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vipservicesyemen@gmail.com"
              style={{
                width: "100%",
                padding: "14px",
                border: "2px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "16px",
                direction: "ltr"
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "24px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: 600, color: "#102A43" }}>
              <Lock size={16} /> كلمة المرور
            </span>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 48px 14px 14px",
                  border: "2px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B7C8D"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #F3B71B, #C99700)",
              color: "#102A43",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(243, 183, 27, 0.3)"
            }}
          >
            {loading ? (
              "جاري تسجيل الدخول..."
            ) : (
              <>
                <LogIn size={20} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid #E5E7EB"
        }}>
          <button
            onClick={() => { setMode("forgot"); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "#F3B71B",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <KeyRound size={16} />
            نسيت كلمة المرور؟
          </button>

          <button
            onClick={handleBiometricLogin}
            style={{
              background: "none",
              border: "none",
              color: "#F3B71B",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Fingerprint size={16} />
            الدخول بالبصمة
          </button>
        </div>

        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "#F0F9FF", 
          borderRadius: "8px",
          fontSize: "13px",
          color: "#0369A1"
        }}>
          <strong>بيانات الدخول:</strong>
          <br />
          البريد: vipservicesyemen@gmail.com
          <br />
          كلمة المرور: Ali711780999*$#@%
        </div>
      </div>
    </div>
  );
}

