// Security utilities for ViP Yemen Admin
// Encryption, rate limiting, WebAuthn verification

// ═══════════════════════════════════════════════════
// ENCRYPTION
// ═══════════════════════════════════════════════════

// Simple encryption for client-side data
const ENCRYPTION_KEY = "ViP-Yemen-Admin-2026-SecureKey";

export async function encryptData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...Array.from(combined)));
}

export async function decryptData(encryptedData: string): Promise<string> {
  const decoder = new TextDecoder();
  const combined = new Uint8Array(
    atob(encryptedData).split("").map((c) => c.charCodeAt(0))
  );

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return decoder.decode(decrypted);
}

// ═══════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const RATE_LIMIT_KEY = "vip_rate_limit";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 60 * 1000; // 1 minute window

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; lockedUntil?: number } {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const limits: Record<string, RateLimitEntry> = stored ? JSON.parse(stored) : {};
  
  const entry = limits[identifier] || { attempts: 0, lastAttempt: 0 };
  const now = Date.now();

  // Check if locked out
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: entry.lockedUntil
    };
  }

  // Reset if window passed
  if (now - entry.lastAttempt > ATTEMPT_WINDOW) {
    entry.attempts = 0;
  }

  // Check if too many attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION;
    limits[identifier] = entry;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: entry.lockedUntil
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.attempts
  };
}

export function recordFailedAttempt(identifier: string): void {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const limits: Record<string, RateLimitEntry> = stored ? JSON.parse(stored) : {};
  
  const entry = limits[identifier] || { attempts: 0, lastAttempt: 0 };
  entry.attempts += 1;
  entry.lastAttempt = Date.now();
  
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }
  
  limits[identifier] = entry;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
}

export function clearRateLimit(identifier: string): void {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const limits: Record<string, RateLimitEntry> = stored ? JSON.parse(stored) : {};
  delete limits[identifier];
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
}

// ═══════════════════════════════════════════════════
// WEBAUTHN - BIOMETRIC VERIFICATION
// ═══════════════════════════════════════════════════

interface BiometricCredential {
  id: string;
  rawId: string;
  userId: string;
  registeredAt: number;
  deviceName?: string;
}

const BIOMETRIC_KEY = "vip_biometric_credentials";

export async function isBiometricSupported(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function registerBiometric(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if already registered
    const existing = getStoredCredentials();
    if (existing.some(c => c.userId === userId)) {
      return { success: false, error: "البصمة مسجلة مسبقاً لهذا المستخدم" };
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBytes = new TextEncoder().encode(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "ViP Yemen Admin Dashboard",
          id: window.location.hostname
        },
        user: {
          id: userIdBytes,
          name: userId,
          displayName: "مدير المنصة - المهندس علي درهم الدحان"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },   // ES256
          { alg: -257, type: "public-key" }  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "required"
        },
        timeout: 60000,
        attestation: "direct"
      }
    });

    if (!credential) {
      return { success: false, error: "فشل إنشاء بيانات البصمة" };
    }

    // Store the credential
    const newCredential: BiometricCredential = {
      id: credential.id,
      rawId: btoa(String.fromCharCode(...Array.from(new Uint8Array((credential as any).rawId)))),
      userId,
      registeredAt: Date.now(),
      deviceName: navigator.userAgent.includes("Android") ? "Android" : 
                  navigator.userAgent.includes("iPhone") ? "iPhone" : "Desktop"
    };

    const credentials = getStoredCredentials();
    credentials.push(newCredential);
    localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(credentials));

    return { success: true };
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      return { success: false, error: "تم رفض التسجيل. تأكد من استخدام البصمة الصحيحة" };
    }
    return { success: false, error: `خطأ في التسجيل: ${error.message}` };
  }
}

export async function authenticateWithBiometric(): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const storedCredentials = getStoredCredentials();
    if (storedCredentials.length === 0) {
      return { success: false, error: "لا توجد بصمة مسجلة. سجّل بصمتك أولاً من لوحة التحكم" };
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // Get allowed credential IDs
    const allowCredentials = storedCredentials.map(c => ({
      id: new Uint8Array(atob(c.rawId).split("").map(ch => ch.charCodeAt(0))),
      type: "public-key" as const,
      transports: ["internal"] as AuthenticatorTransport[]
    }));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        allowCredentials
      }
    });

    if (!assertion) {
      return { success: false, error: "فشل التحقق من البصمة" };
    }

    // Find which credential was used
    const credentialId = btoa(String.fromCharCode(...Array.from(new Uint8Array((assertion as any).rawId))));
    const matchedCredential = storedCredentials.find(c => c.rawId === credentialId);

    if (!matchedCredential) {
      return { success: false, error: "بصمة غير معترف بها" };
    }

    return { 
      success: true, 
      userId: matchedCredential.userId 
    };
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      return { success: false, error: "تم رفض التحقق. تأكد من استخدام البصمة الصحيحة" };
    }
    return { success: false, error: `خطأ في التحقق: ${error.message}` };
  }
}

function getStoredCredentials(): BiometricCredential[] {
  try {
    const stored = localStorage.getItem(BIOMETRIC_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isBiometricRegistered(userId: string): boolean {
  const credentials = getStoredCredentials();
  return credentials.some(c => c.userId === userId);
}

export function removeBiometric(userId: string): void {
  const credentials = getStoredCredentials();
  const filtered = credentials.filter(c => c.userId !== userId);
  localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(filtered));
}

// ═══════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════

interface Session {
  userId: string;
  email: string;
  loginTime: number;
  expiresAt: number;
  loginMethod: "password" | "biometric";
  sessionToken: string;
}

const SESSION_KEY = "vip_admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(
  userId: string,
  email: string,
  loginMethod: "password" | "biometric"
): Promise<Session> {
  const sessionToken = await encryptData(
    JSON.stringify({
      userId,
      email,
      timestamp: Date.now(),
      random: Math.random().toString(36)
    })
  );

  const session: Session = {
    userId,
    email,
    loginTime: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
    loginMethod,
    sessionToken
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function validateSession(): Session | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);
    
    // Check expiration
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function destroySession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ═══════════════════════════════════════════════════
// SECURITY AUDIT LOG
// ═══════════════════════════════════════════════════

interface AuditLogEntry {
  timestamp: number;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent: string;
}

const AUDIT_KEY = "vip_security_audit";

export function logSecurityEvent(action: string, details: string): void {
  const stored = localStorage.getItem(AUDIT_KEY);
  const logs: AuditLogEntry[] = stored ? JSON.parse(stored) : [];

  logs.push({
    timestamp: Date.now(),
    action,
    details,
    userAgent: navigator.userAgent
  });

  // Keep only last 100 entries
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100);
  }

  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
}

export function getAuditLogs(): AuditLogEntry[] {
  try {
    const stored = localStorage.getItem(AUDIT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// INPUT VALIDATION
// ═══════════════════════════════════════════════════

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)?967[\s-]?)?7(?:[\s-]?\d){8}$/;
  return phoneRegex.test(phone);
}

// ═══════════════════════════════════════════════════
// ADMIN CREDENTIALS (VERIFIED)
// ═══════════════════════════════════════════════════

const ADMIN_EMAIL = "vipservicesyemen@gmail.com";
const ADMIN_PASSWORD_HASH = "ViP-Secure-2026-Hash";

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  // Simple hash comparison (in production, use bcrypt/argon2)
  const inputHash = await hashString(email + password);
  const storedHash = await hashString(ADMIN_EMAIL + ADMIN_PASSWORD_HASH);
  
  return inputHash === storedHash;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str + ENCRYPTION_KEY);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}
