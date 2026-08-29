import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Fingerprint, KeyRound, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "reset" | "biometric">("login");
  const [resetSent, setResetSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
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
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResetSent(true);
        if (data.resetUrl) {
          setResetToken(data.resetUrl.split("token=")[1] || "");
        }
      } else {
        setError(data.error || "خطأ في إرسال طلب إعادة التعيين");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMode("login");
        setPassword("");
        setError("");
        alert("تم إعادة تعيين كلمة المرور بنجاح. سجّل الدخول بكلمة المرور الجديدة.");
      } else {
        setError(data.error || "خطأ في إعادة تعيين كلمة المرور");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Get authentication options
      const optionsResponse = await fetch("/api/admin/webauthn/authenticate/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const optionsData = await optionsResponse.json();

      if (!optionsResponse.ok) {
        setError(optionsData.error || "لم يتم تسجيل بصمة بعد");
        setLoading(false);
        return;
      }

      // Start WebAuthn authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(optionsData.options.challenge), c => c.charCodeAt(0)),
          timeout: optionsData.options.timeout,
          rpId: optionsData.options.rpId,
          allowCredentials: optionsData.options.allowCredentials.map((cred: { id: string; type: string; transports: string[] }) => ({
            id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
            type: cred.type as PublicKeyCredentialType,
            transports: cred.transports as AuthenticatorTransport[],
          })),
          userVerification: optionsData.options.userVerification,
        },
      });

      if (!credential) {
        setError("فشلت المصادقة بالبصمة");
        setLoading(false);
        return;
      }

      // Verify credential
      const verifyResponse = await fetch("/api/admin/webauthn/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((credential as any).rawId)))),
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.success) {
        localStorage.setItem("admin_user", JSON.stringify(verifyData.user));
        setLocation("/admin/dashboard");
      } else {
        setError(verifyData.error || "فشلت المصادقة بالبصمة");
      }
    } catch {
      setError("جهازك لا يدعم تسجيل البصمة أو حدث خطأ");
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
            {mode === "login" && <p>سجّل الدخول للوصول إلى لوحة إدارة المنصة</p>}
            {mode === "forgot" && <p>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>}
            {mode === "reset" && <p>أدخل كلمة المرور الجديدة</p>}
            {mode === "biometric" && <p>استخدم بصمة أصابعك أو التعرف على وجهك</p>}
          </div>

          {/* Login Form */}
          {mode === "login" && (
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
                  placeholder="vipservicesyemen@gmail.com"
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

              <button type="submit" className="admin-login-button" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>

              <div className="admin-login-links">
                <button type="button" className="admin-link-btn" onClick={() => { setMode("forgot"); setError(""); }}>
                  <KeyRound size={14} />
                  نسيت كلمة المرور؟
                </button>
                {biometricSupported && (
                  <button type="button" className="admin-link-btn" onClick={() => { setMode("biometric"); setError(""); }}>
                    <Fingerprint size={14} />
                    الدخول بالبصمة
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="admin-login-form">
              {error && (
                <div className="admin-login-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {resetSent ? (
                <div className="admin-login-success">
                  <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>
                  <button type="button" className="admin-link-btn" onClick={() => { setMode("reset"); setResetSent(false); }}>
                    <ArrowRight size={14} />
                    إعادة تعيين الآن
                  </button>
                </div>
              ) : (
                <>
                  <div className="admin-form-field">
                    <label htmlFor="reset-email">
                      <Mail size={16} />
                      <span>البريد الإلكتروني</span>
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vipservicesyemen@gmail.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button type="submit" className="admin-login-button" disabled={loading}>
                    {loading ? (
                      <span className="loading-spinner" />
                    ) : (
                      <>
                        <KeyRound size={18} />
                        <span>إرسال رابط إعادة التعيين</span>
                      </>
                    )}
                  </button>
                </>
              )}

              <button type="button" className="admin-link-btn" onClick={() => { setMode("login"); setError(""); }}>
                <ArrowRight size={14} />
                العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword} className="admin-login-form">
              {error && (
                <div className="admin-login-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="admin-form-field">
                <label htmlFor="new-password">
                  <Lock size={16} />
                  <span>كلمة المرور الجديدة</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="confirm-password">
                  <Lock size={16} />
                  <span>تأكيد كلمة المرور</span>
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="admin-login-button" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner" />
                ) : (
                  <>
                    <KeyRound size={18} />
                    <span>إعادة تعيين كلمة المرور</span>
                  </>
                )}
              </button>

              <button type="button" className="admin-link-btn" onClick={() => { setMode("login"); setError(""); }}>
                <ArrowRight size={14} />
                العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* Biometric Login */}
          {mode === "biometric" && (
            <div className="admin-login-form">
              {error && (
                <div className="admin-login-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="biometric-login-section">
                <div className="biometric-icon-large">
                  <Fingerprint size={64} />
                </div>
                <p>اضغط على الزر أدناه لبدء تسجيل الدخول بالبصمة</p>
                <button type="button" className="admin-login-button biometric-btn" onClick={handleBiometricLogin} disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner" />
                  ) : (
                    <>
                      <Fingerprint size={22} />
                      <span>تسجيل الدخول بالبصمة</span>
                    </>
                  )}
                </button>
              </div>

              <button type="button" className="admin-link-btn" onClick={() => { setMode("login"); setError(""); }}>
                <ArrowRight size={14} />
                العودة لتسجيل الدخول بالبريد
              </button>
            </div>
          )}

          <div className="admin-login-footer">
            <p>© 2026 ViP Yemen — المهندس علي درهم الدحان</p>
          </div>
        </div>
      </div>
    </div>
  );
}
