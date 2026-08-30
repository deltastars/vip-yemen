import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { registerAdminAuthRoutes } from "./adminAuth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate CSP nonce for inline scripts
function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Security headers middleware
function securityHeaders(req: express.Request, res: express.Response, next: express.NextFunction) {
  const nonce = generateNonce();
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://api.qrserver.com https://*.googleapis.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '));
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  
  // CSP nonce for scripts
  res.locals.nonce = nonce;
  
  next();
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Apply security headers to all routes
  app.use(securityHeaders);
  
  app.use(express.json());

  // Rate limiting for API endpoints
  const rateLimit = new Map<string, { count: number; resetTime: number }>();
  app.use('/api', (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= 100) {
        return res.status(429).json({ error: 'Too many requests' });
      }
      limit.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
    }
    next();
  });

  registerAdminAuthRoutes(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
