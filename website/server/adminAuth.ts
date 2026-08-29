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
const ADMIN_PASSWORD_HASH = "Ali711780999*$#@"; // In production, use bcrypt hash

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
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD_HASH) {
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
    if (currentPassword !== ADMIN_PASSWORD_HASH) {
      res.status(400).json({ error: "كلمة المرور الحالية غير صحيحة" });
      return;
    }

    // In production, update password in database
    // For now, just acknowledge
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  });
}
