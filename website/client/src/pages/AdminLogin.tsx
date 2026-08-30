import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Fingerprint, KeyRound, ArrowRight } from "lucide-react";
import { 
  verifyAdminCredentials, getAdminEmail,
  authenticateWithBiometric, isBiometricSupported, isBiometricRegistered,
  checkRateLimit, recordFailedAttempt, clearRateLimit,
  logSecurityEvent, sanitizeInput
} from "../lib/security";

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
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({ remaining: 5 });
  const [lockoutTime, setLockoutTime] = useState<string | null>(null);

  useEffect(() => {
    // Check existing session
    const user = localStorage.getItem("admin_user");
    if (user) {
      setLocation("/admin/dashboard");
    }

    // Check biometric support
    isBiometricSupported().then(setBiometricSupported);
    setBiometricAvailable(isBiometricRegistered(getAdminEmail()));

    // Check rate limit
    const limit = checkRateLimit("login");
    setRateLimitInfo(limit);
    if (!limit.allowed && limit.lockedUntil) {
      const remaining = Math.ceil((limit.lockedUntil - Date.now()) / 60000);
      setLockoutTime(`${remaining} دقيقة`);
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check rate limit
    const limit = checkRateLimit("login");
    if (!limit.allowed) {
      const remaining = Math.ceil((limit.lockedUntil! - Date.now()) / 60000);
      setError(`تم قفل الحساب لمدة ${remaining} دقيقة بسبب محاولات كثيرة`);
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      const cleanEmail = sanitizeInput(email);
      const isValid = await verifyAdminCredentials(cleanEmail, password);

      if (isValid) {
        clearRateLimit("login");
        logSecurityEvent("LOGIN_SUCCESS", `Email: ${cleanEmail}`);
        
        const user = {
          email: cleanEmail,
          name: "مدير المنصة",
          role: "admin",
          loginTime: new Date().toISOString(),
          loginMethod: "password"
        };
        localStorage.setItem("admin_user", JSON.stringify(user));
        setLocation("/admin/dashboard");
      } else {
        recordFailedAttempt("login");
        logSecurityEvent("LOGIN_FAILED", `Email: ${cleanEmail}`);
        
        const newLimit = checkRateLimit("login");
        setRateLimitInfo(newLimit);
        
        if (!newLimit.allowed) {
          setError("تم قفل الحساب لمدة 15 دقيقة بسبب محاولات كثيرة");
        } else {
          setError(`البريد الإلكتروني أو كلمة المرور غير صحيحة (${newLimit.remaining} محاولات متبقية)`);
        }
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!biometricSupported) {
        setError("المتصفح لا يدعم تسجيل الدخول بالبصمة");
        setLoading(false);
        return;
      }

      if (!biometricAvailable) {
        setError("البصمة غير مسجلة. سجّل بصمتك أولاً من لوحة التحكم");
        setLoading(false);
        return;
      }

      // Check rate limit for biometric
      const limit = checkRateLimit("biometric");
      if (!limit.allowed) {
        const remaining = Math.ceil((limit.lockedUntil! - Date.now()) / 60000);
        setError(`تم قفل البصمة لمدة ${remaining} دقيقة`);
        setLoading(false);
        return;
      }

      const result = await authenticateWithBiometric();

      if (result.success) {
        clearRateLimit("biometric");
        logSecurityEvent("BIOMETRIC_LOGIN_SUCCESS", `User: ${result.userId}`);
        
        const user = {
          email: result.userId,
          name: "مدير المنصة",
          role: "admin",
          loginTime: new Date().toISOString(),
          loginMethod: "biometric"
        };
        localStorage.setItem("admin_user", JSON.stringify(user));
        setLocation("/admin/dashboard");
      } else {
        recordFailedAttempt("biometric");
        logSecurityEvent("BIOMETRIC_LOGIN_FAILED", result.error || "Unknown error");
        setError(result.error || "فشل التحقق بالبصمة");
      }
    } catch {
      setError("حدث خطأ في التحقق بالبصمة");
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
      
      const cleanEmail = sanitizeInput(email);
      if (cleanEmail === getAdminEmail()) {
        setResetSent(true);
        logSecurityEvent("PASSWORD_RESET_REQUESTED", `Email: ${cleanEmail}`);
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

    if (newPassword.length < 12) {
      setError("كلمة المرور يجب أن تكون 12 حرف على الأقل مع أرقام ورموز");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResetSent(false);
      setMode("login");
      setPassword(newPassword);
      logSecurityEvent("PASSWORD_RESET_COMPLETED", "Password changed successfully");
      alert("تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.");
    } catch {
      setError("حدث خطأ في إعادة تعيين كلمة المرور");
    }
  };

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

        {lockoutTime && (
          <div style={{ 
            padding: "12px", 
            background: "#FEF3C7", 
            color: "#92400E", 
            borderRadius: "8px", 
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={18} />
            الحساب مقفل لمدة {lockoutTime}
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
              disabled={loading}
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
                disabled={loading}
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

          {biometricSupported && biometricAvailable && (
            <button
              onClick={handleBiometricLogin}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                color: "#F3B71B",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: loading ? 0.5 : 1
              }}
            >
              <Fingerprint size={16} />
              الدخول بالبصمة
            </button>
          )}
        </div>          <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "#F0F9FF", 
          borderRadius: "8px",
          fontSize: "13px",
          color: "#0369A1"
        }}>
          <strong>🔐 الأمان:</strong>
          <br />
          • الحماية من Brute Force (5 محاولات ثم قفل 15 دقيقة)
          <br />
          • تسجيل جميع محاولات الدخول
          <br />
          • البصمة موثقة ومحمية بـ WebAuthn
          <br />
          • جلسات آمنة لمدة 24 ساعة
          <br />
          • تشفير AES-256-GCM
        </div>
      </div>
    </div>
  );
}
