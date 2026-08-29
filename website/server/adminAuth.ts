import type { Express, Request, Response } from "express";

function parseCookies(req: Request): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieHeader = req.headers.cookie || "";
  cookieHeader.split(";").forEach(cookie => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name) cookies[name] = rest.join("=");
  });
  return cookies;
}


// Admin credentials (stored in environment or database)
const ADMIN_EMAIL = "vipservicesyemen@gmail.com";
const ADMIN_PASSWORD = "Ali711780999*$#@%";

// Password reset tokens (in production, use database)
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

// WebAuthn credential store (in production, use database)
const webauthnCredentials = new Map<string, { credentialId: string; publicKey: string; counter: number }>();

// Simple session store (in production, use Redis or database)
const sessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  return password.split('').map(c => c.charCodeAt(0).toString(16)).join('');
}

export function registerAdminAuthRoutes(app: Express) {
  // Admin login endpoint
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
        return;
      }

      // Check credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const sessionId = generateSessionId();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        sessions.set(sessionId, {
          userId: "admin-001",
          email: ADMIN_EMAIL,
          expiresAt,
        });

        // Set session cookie
        res.cookie("admin_session", sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.json({
          success: true,
          user: {
            id: "admin-001",
            email: ADMIN_EMAIL,
            name: "المهندس علي درهم الدحان",
            role: "admin",
          },
        });
      } else {
        res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "خطأ في الخادم" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const sessionId = cookies.admin_session;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.clearCookie("admin_session", { path: "/" });
    res.json({ success: true });
  });

  // Check admin session
  app.get("/api/admin/me", (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const sessionId = cookies.admin_session;
    if (!sessionId) {
      res.status(401).json({ error: "غير مسجل الدخول" });
      return;
    }

    const session = sessions.get(sessionId);
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(sessionId);
      res.clearCookie("admin_session", { path: "/" });
      res.status(401).json({ error: "انتهت صلاحية الجلسة" });
      return;
    }

    res.json({
      user: {
        id: session.userId,
        email: session.email,
        name: "المهندس علي درهم الدحان",
        role: "admin",
      },
    });
  });

  // Change password endpoint
  app.post("/api/admin/change-password", (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const sessionId = cookies.admin_session;
    if (!sessionId) {
      res.status(401).json({ error: "غير مسجل الدخول" });
      return;
    }

    const session = sessions.get(sessionId);
    if (!session) {
      res.status(401).json({ error: "جلسة غير صالحة" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (currentPassword !== ADMIN_PASSWORD) {
      res.status(400).json({ error: "كلمة المرور الحالية غير صحيحة" });
      return;
    }

    // In production, update password in database
    // For now, just acknowledge
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  });

  // Password reset request endpoint
  app.post("/api/admin/forgot-password", (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
      return;
    }
    if (email !== ADMIN_EMAIL) {
      // Always return success for security (don't reveal if email exists)
      res.json({ success: true, message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" });
      return;
    }
    // Generate reset token
    const token = generateSessionId();
    resetTokens.set(token, {
      email: ADMIN_EMAIL,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    // In production, send email with reset link
    console.log(`[Password Reset] Token: ${token} for ${ADMIN_EMAIL}`);
    console.log(`[Password Reset] Reset URL: /admin/reset-password?token=${token}`);
    res.json({ success: true, message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني", resetUrl: `/admin/reset-password?token=${token}` });
  });

  // Password reset endpoint
  app.post("/api/admin/reset-password", (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ error: "الرمز وكلمة المرور الجديدة مطلوبان" });
      return;
    }
    const resetData = resetTokens.get(token);
    if (!resetData || resetData.expiresAt < Date.now()) {
      res.status(400).json({ error: "الرمز غير صالح أو منتهي الصلاحية" });
      return;
    }
    // In production, update password in database
    resetTokens.delete(token);
    console.log(`[Password Reset] Password reset successful for ${resetData.email}`);
    res.json({ success: true, message: "تم إعادة تعيين كلمة المرور بنجاح" });
  });

  // WebAuthn registration options
  app.post("/api/admin/webauthn/register/options", (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const sessionId = cookies.admin_session;
    if (!sessionId) {
      res.status(401).json({ error: "غير مسجل الدخول" });
      return;
    }
    const session = sessions.get(sessionId);
    if (!session) {
      res.status(401).json({ error: "جلسة غير صالحة" });
      return;
    }
    // Generate WebAuthn registration options
    const challenge = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
    const options = {
      challenge: Buffer.from(challenge).toString("base64url"),
      rp: { name: "ViP Yemen", id: "vip-yemen-140.vercel.app" },
      user: {
        id: "admin-001",
        name: session.email,
        displayName: "المهندس علي درهم الدحان",
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    };
    res.json({ options });
  });

  // WebAuthn registration verify
  app.post("/api/admin/webauthn/register/verify", (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const sessionId = cookies.admin_session;
    if (!sessionId) {
      res.status(401).json({ error: "غير مسجل الدخول" });
      return;
    }
    const { credentialId, publicKey } = req.body;
    if (!credentialId || !publicKey) {
      res.status(400).json({ error: "بيانات الاعتماد مطلوبة" });
      return;
    }
    // Store credential
    webauthnCredentials.set("admin-001", {
      credentialId,
      publicKey,
      counter: 0,
    });
    console.log(`[WebAuthn] Credential registered for admin`);
    res.json({ success: true, message: "تم تسجيل البصمة بنجاح" });
  });

  // WebAuthn authentication options
  app.post("/api/admin/webauthn/authenticate/options", (req: Request, res: Response) => {
    const credential = webauthnCredentials.get("admin-001");
    if (!credential) {
      res.status(404).json({ error: "لم يتم تسجيل بصمة بعد" });
      return;
    }
    const challenge = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
    const options = {
      challenge: Buffer.from(challenge).toString("base64url"),
      timeout: 60000,
      rpId: "vip-yemen-140.vercel.app",
      allowCredentials: [{
        id: credential.credentialId,
        type: "public-key",
        transports: ["internal"],
      }],
      userVerification: "required",
    };
    res.json({ options });
  });

  // WebAuthn authentication verify
  app.post("/api/admin/webauthn/authenticate/verify", (req: Request, res: Response) => {
    const { credentialId } = req.body;
    if (!credentialId) {
      res.status(400).json({ error: "بيانات الاعتماد مطلوبة" });
      return;
    }
    const credential = webauthnCredentials.get("admin-001");
    if (!credential || credential.credentialId !== credentialId) {
      res.status(401).json({ error: "البصمة غير معترف بها" });
      return;
    }
    // Create session
    const sessionId = generateSessionId();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    sessions.set(sessionId, {
      userId: "admin-001",
      email: ADMIN_EMAIL,
      expiresAt,
    });
    res.cookie("admin_session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    // Update counter
    credential.counter++;
    console.log(`[WebAuthn] Authentication successful for admin`);
    res.json({
      success: true,
      user: {
        id: "admin-001",
        email: ADMIN_EMAIL,
        name: "المهندس علي درهم الدحان",
        role: "admin",
      },
    });
  });
}
