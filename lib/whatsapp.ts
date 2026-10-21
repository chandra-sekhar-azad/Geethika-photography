/**
 * SwiftProject WhatsApp Gateway - Production-Ready TypeScript Client
 *
 * Dedicated utility library for sending WhatsApp messages, media, location, contacts,
 * polls, reactions, and replies via SwiftProject WhatsApp Gateway.
 *
 * Documentation & Specifications:
 * - Base URL: https://wg.swiftproject.in/api/send
 * - Auth: Bearer ${process.env.WHATSAPP_TOKEN}
 * - Format: Strict international phone format without '+' or spaces.
 */

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export interface WhatsAppQuota {
  plan: string;
  dailyLimit: number;
  usedToday: number;
  dailyRemaining: number;
  resetsAt: string; // ISO 8601 timestamp (e.g. 2026-09-22T00:00:00.000Z)
}

export interface WhatsAppRateLimitHeaders {
  rateLimitLimit?: number;      // Allowed burst messages per minute (e.g. 20)
  quotaDailyLimit?: number;     // Daily message limit (e.g. 500)
  quotaDailyUsed?: number;      // Total messages dispatched today
  quotaDailyRemaining?: number; // Messages remaining for today
  quotaDailyReset?: string;     // ISO timestamp when daily counter resets (midnight UTC)
}

export interface WhatsAppAttachment {
  url: string;
  contentType: string;
  fileName?: string;
}

export interface WhatsAppLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface WhatsAppContact {
  fullName: string;
  phone: string;
}

export interface WhatsAppPoll {
  name: string;
  options: string[];
  selectableCount?: number;
}

export interface WhatsAppReaction {
  emoji: string;
  messageId: string;
}

export interface WhatsAppPayload {
  phone: string;
  message?: string;
  attachment?: WhatsAppAttachment;
  location?: WhatsAppLocation;
  contact?: WhatsAppContact;
  poll?: WhatsAppPoll;
  reaction?: WhatsAppReaction;
  quotedMessageId?: string;
}

export interface WhatsAppSuccessResponse {
  ok: boolean;
  success: boolean;
  messageId: string;
  session?: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | string;
  to: string;
  quota?: WhatsAppQuota;
  headers?: WhatsAppRateLimitHeaders;
}

export interface WhatsAppRateLimitErrorData {
  error: string;
  code: 'RATE_LIMIT_EXCEEDED';
  retryAfter: number; // in seconds
}

export interface WhatsAppDailyLimitErrorData {
  error: string;
  code: 'DAILY_LIMIT_EXCEEDED';
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  resetsAt: string;
}

// ============================================================================
// 2. CUSTOM ERROR CLASSES
// ============================================================================

export class WhatsAppError extends Error {
  public statusCode?: number;
  public headers?: WhatsAppRateLimitHeaders;
  public rawResponse?: unknown;

  constructor(message: string, statusCode?: number, headers?: WhatsAppRateLimitHeaders, rawResponse?: unknown) {
    super(message);
    this.name = 'WhatsAppError';
    this.statusCode = statusCode;
    this.headers = headers;
    this.rawResponse = rawResponse;
  }
}

export class WhatsAppValidationError extends WhatsAppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'WhatsAppValidationError';
  }
}

export class WhatsAppAuthError extends WhatsAppError {
  constructor(message = 'Invalid or missing WhatsApp Gateway API token.') {
    super(message, 401);
    this.name = 'WhatsAppAuthError';
  }
}

export class WhatsAppRateLimitError extends WhatsAppError {
  public readonly code = 'RATE_LIMIT_EXCEEDED';
  public retryAfter: number;

  constructor(message: string, retryAfter = 30, headers?: WhatsAppRateLimitHeaders, raw?: unknown) {
    super(message, 429, headers, raw);
    this.name = 'WhatsAppRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class WhatsAppDailyQuotaExceededError extends WhatsAppError {
  public readonly code = 'DAILY_LIMIT_EXCEEDED';
  public dailyLimit?: number;
  public usedToday?: number;
  public remaining?: number;
  public resetsAt?: string;

  constructor(
    message: string,
    details?: { dailyLimit?: number; usedToday?: number; remaining?: number; resetsAt?: string },
    headers?: WhatsAppRateLimitHeaders,
    raw?: unknown
  ) {
    super(message, 429, headers, raw);
    this.name = 'WhatsAppDailyQuotaExceededError';
    this.dailyLimit = details?.dailyLimit;
    this.usedToday = details?.usedToday;
    this.remaining = details?.remaining;
    this.resetsAt = details?.resetsAt;
  }
}

// ============================================================================
// 3. CONFIGURATION & ENVIRONMENT VALIDATION
// ============================================================================

const DEFAULT_GATEWAY_URL = 'https://wg.swiftproject.in/api/send';

/**
 * Retrieve and validate WhatsApp Gateway configuration from environment.
 */
export function getWhatsAppConfig(): { url: string; token: string } {
  // Support both standard Node.js process.env and Vite import.meta.env if available
  const envUrl =
    (typeof process !== 'undefined' && process.env?.WHATSAPP_URL) ||
    DEFAULT_GATEWAY_URL;

  const envToken =
    (typeof process !== 'undefined' && process.env?.WHATSAPP_TOKEN) || '';

  if (!envToken || envToken.trim() === '') {
    throw new WhatsAppAuthError(
      'Missing WHATSAPP_TOKEN environment variable. Please set it in your .env or .env.local file.'
    );
  }

  return {
    url: envUrl.trim(),
    token: envToken.trim(),
  };
}

// ============================================================================
// 4. PHONE NUMBER FORMATTING & SANITIZATION
// ============================================================================

/**
 * Sanitizes phone numbers by removing spaces, dashes, parentheses, and the leading '+' symbol.
 * Enforces international format with country code (e.g., '919876543210' or '15551234567').
 *
 * @param phone Raw phone number string or number
 * @param defaultCountryCode Default country code if 10 digits provided (default '91' for India)
 * @returns Clean digits-only string without '+' or spaces
 */
export function sanitizePhoneNumber(phone: string | number, defaultCountryCode = '91'): string {
  if (!phone) {
    throw new WhatsAppValidationError('Phone number is required.');
  }

  // Strip all non-digit characters
  let cleaned = String(phone).replace(/\D/g, '');

  // Strip any leading zeroes (e.g., 09876543210 -> 9876543210)
  cleaned = cleaned.replace(/^0+/, '');

  // If a 10-digit number is provided (e.g. standard Indian mobile), prepend default country code
  if (cleaned.length === 10) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }

  // International phone numbers typically range between 10 and 15 digits (ITU-T E.164)
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new WhatsAppValidationError(
      `Invalid phone number "${phone}". Sanitized result "${cleaned}" is ${cleaned.length} digits. WhatsApp requires 10-15 digits including country code without '+'.`
    );
  }

  return cleaned;
}

// ============================================================================
// 5. CORE API REQUEST DISPATCHER
// ============================================================================

/**
 * Extract rate limit and quota headers from standard fetch Response headers.
 */
function extractRateLimitHeaders(headers: Headers): WhatsAppRateLimitHeaders {
  const parseNum = (val: string | null) => (val ? parseInt(val, 10) : undefined);

  return {
    rateLimitLimit: parseNum(headers.get('x-ratelimit-limit')),
    quotaDailyLimit: parseNum(headers.get('x-quota-daily-limit')),
    quotaDailyUsed: parseNum(headers.get('x-quota-daily-used')),
    quotaDailyRemaining: parseNum(headers.get('x-quota-daily-remaining')),
    quotaDailyReset: headers.get('x-quota-daily-reset') || undefined,
  };
}

/**
 * Low-level dispatch function to call SwiftProject WhatsApp Gateway.
 * Handles authentication, body serialization, header inspection, and strict 429 error differentiation.
 */
export async function sendWhatsAppRequest(payload: WhatsAppPayload): Promise<WhatsAppSuccessResponse> {
  const { url, token } = getWhatsAppConfig();

  // Validate and sanitize destination phone number
  const sanitizedPhone = sanitizePhoneNumber(payload.phone);
  const finalPayload: WhatsAppPayload = {
    ...payload,
    phone: sanitizedPhone,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalPayload),
    });
  } catch (networkError: any) {
    throw new WhatsAppError(
      `Failed to connect to WhatsApp Gateway (${url}): ${networkError?.message || networkError}`
    );
  }

  const rateLimitHeaders = extractRateLimitHeaders(response.headers);

  // Attempt to parse response body as JSON
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // If not JSON, capture raw text
    const text = await response.text().catch(() => '');
    data = { error: text || `HTTP ${response.status} ${response.statusText}` };
  }

  // Handle Rate Limiting & Quota Exceeded (HTTP 429)
  if (response.status === 429) {
    const isBurst =
      data?.code === 'RATE_LIMIT_EXCEEDED' ||
      (typeof data?.error === 'string' && data.error.toLowerCase().includes('per-minute'));

    if (isBurst) {
      const retryAfter =
        data?.retryAfter ??
        (response.headers.get('retry-after') ? parseInt(response.headers.get('retry-after')!, 10) : 30);
      throw new WhatsAppRateLimitError(
        data?.error || `Per-minute rate limit exceeded. Please retry after ${retryAfter} seconds.`,
        retryAfter,
        rateLimitHeaders,
        data
      );
    }

    // Otherwise, daily quota reached
    const dailyLimit = data?.dailyLimit ?? rateLimitHeaders.quotaDailyLimit;
    const usedToday = data?.usedToday ?? rateLimitHeaders.quotaDailyUsed;
    const remaining = data?.remaining ?? rateLimitHeaders.quotaDailyRemaining ?? 0;
    const resetsAt = data?.resetsAt ?? rateLimitHeaders.quotaDailyReset;

    throw new WhatsAppDailyQuotaExceededError(
      data?.error ||
        `Daily message quota reached (${usedToday}/${dailyLimit}). Counter resets at ${resetsAt || 'midnight UTC'}.`,
      { dailyLimit, usedToday, remaining, resetsAt },
      rateLimitHeaders,
      data
    );
  }

  // Handle Authentication failure (HTTP 401 / 403)
  if (response.status === 401 || response.status === 403) {
    throw new WhatsAppAuthError(
      data?.error || `WhatsApp Gateway authentication failed (HTTP ${response.status}). Check WHATSAPP_TOKEN.`
    );
  }

  // Handle other HTTP errors (400, 500, etc.)
  if (!response.ok || data?.ok === false || data?.success === false) {
    const errorMsg = data?.error || data?.message || `WhatsApp Gateway returned error HTTP ${response.status}`;
    throw new WhatsAppError(errorMsg, response.status, rateLimitHeaders, data);
  }

  return {
    ok: data.ok ?? true,
    success: data.success ?? true,
    messageId: data.messageId,
    session: data.session,
    status: data.status || 'QUEUED',
    to: data.to || sanitizedPhone,
    quota: data.quota,
    headers: rateLimitHeaders,
  };
}

// ============================================================================
// 6. HIGH-LEVEL EXPORTED SEND FUNCTIONS
// ============================================================================

/**
 * 1. Send plain text WhatsApp message.
 *
 * @param phone Destination phone number (e.g., '919876543210' or '+91 98765 43210')
 * @param text The text message content
 */
export async function sendTextMessage(phone: string, text: string): Promise<WhatsAppSuccessResponse> {
  if (!text || text.trim() === '') {
    throw new WhatsAppValidationError('Message text cannot be empty.');
  }

  return sendWhatsAppRequest({
    phone,
    message: text,
  });
}

/**
 * 2. Send image via URL or base64 data URI.
 *
 * @param phone Destination phone number
 * @param imageUrl Public image URL or data URI
 * @param caption Optional caption to display with the image
 * @param contentType Optional MIME type (defaults to auto-detected or 'image/jpeg')
 */
export async function sendImage(
  phone: string,
  imageUrl: string,
  caption?: string,
  contentType?: string
): Promise<WhatsAppSuccessResponse> {
  if (!imageUrl) {
    throw new WhatsAppValidationError('Image URL is required.');
  }

  const detectedType = contentType || inferContentType(imageUrl, 'image/jpeg');

  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: imageUrl,
      contentType: detectedType,
    },
    message: caption,
  });
}

/**
 * 3. Send Document / PDF attachment.
 *
 * @param phone Destination phone number
 * @param documentUrl Public URL of the document
 * @param fileName File name with extension (e.g., 'invoice.pdf')
 * @param caption Optional caption for the document
 * @param contentType Optional MIME type (defaults to 'application/pdf')
 */
export async function sendDocument(
  phone: string,
  documentUrl: string,
  fileName: string,
  caption?: string,
  contentType?: string
): Promise<WhatsAppSuccessResponse> {
  if (!documentUrl || !fileName) {
    throw new WhatsAppValidationError('Document URL and fileName are required.');
  }

  const detectedType = contentType || inferContentType(fileName, 'application/pdf');

  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: documentUrl,
      contentType: detectedType,
      fileName,
    },
    message: caption,
  });
}

/**
 * 4. Send Video attachment.
 *
 * @param phone Destination phone number
 * @param videoUrl Public URL of the video (MP4, etc.)
 * @param caption Optional caption for the video
 * @param contentType Optional MIME type (defaults to 'video/mp4')
 */
export async function sendVideo(
  phone: string,
  videoUrl: string,
  caption?: string,
  contentType?: string
): Promise<WhatsAppSuccessResponse> {
  if (!videoUrl) {
    throw new WhatsAppValidationError('Video URL is required.');
  }

  const detectedType = contentType || inferContentType(videoUrl, 'video/mp4');

  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: videoUrl,
      contentType: detectedType,
    },
    message: caption,
  });
}

/**
 * 5. Send Audio / Voice note attachment.
 *
 * @param phone Destination phone number
 * @param audioUrl Public URL of the audio file (MP3, OGG, WAV)
 * @param contentType Optional MIME type (defaults to 'audio/mpeg')
 */
export async function sendAudio(
  phone: string,
  audioUrl: string,
  contentType?: string
): Promise<WhatsAppSuccessResponse> {
  if (!audioUrl) {
    throw new WhatsAppValidationError('Audio URL is required.');
  }

  const detectedType = contentType || inferContentType(audioUrl, 'audio/mpeg');

  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: audioUrl,
      contentType: detectedType,
    },
  });
}

/**
 * 6. Send Location coordinates with name and address.
 *
 * @param phone Destination phone number
 * @param lat Latitude coordinate (e.g., 12.9716)
 * @param lng Longitude coordinate (e.g., 77.5946)
 * @param name Optional name of the location / venue (e.g. 'Geethika Digital World')
 * @param address Optional street address
 */
export async function sendLocation(
  phone: string,
  lat: number,
  lng: number,
  name?: string,
  address?: string
): Promise<WhatsAppSuccessResponse> {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new WhatsAppValidationError('Latitude and longitude must be valid numbers.');
  }

  return sendWhatsAppRequest({
    phone,
    location: {
      latitude: lat,
      longitude: lng,
      name,
      address,
    },
  });
}

/**
 * 7. Send Contact Card (vCard).
 *
 * @param phone Destination phone number
 * @param fullName Full name of the contact
 * @param contactPhone Phone number of the contact
 */
export async function sendContact(
  phone: string,
  fullName: string,
  contactPhone: string
): Promise<WhatsAppSuccessResponse> {
  if (!fullName || !contactPhone) {
    throw new WhatsAppValidationError('Contact fullName and contactPhone are required.');
  }

  const sanitizedContactPhone = sanitizePhoneNumber(contactPhone);

  return sendWhatsAppRequest({
    phone,
    contact: {
      fullName,
      phone: sanitizedContactPhone,
    },
  });
}

/**
 * 8. Send Interactive Poll.
 *
 * @param phone Destination phone number
 * @param question The poll question
 * @param options Array of choices (e.g., ['Monday', 'Tuesday', 'Wednesday'])
 * @param selectableCount Number of options selectable (default: 1)
 */
export async function sendPoll(
  phone: string,
  question: string,
  options: string[],
  selectableCount = 1
): Promise<WhatsAppSuccessResponse> {
  if (!question || !Array.isArray(options) || options.length < 2) {
    throw new WhatsAppValidationError('Poll requires a question and at least 2 options.');
  }

  return sendWhatsAppRequest({
    phone,
    poll: {
      name: question,
      options,
      selectableCount,
    },
  });
}

/**
 * 9. Send Reaction to an existing message.
 *
 * @param phone Destination phone number
 * @param emoji Single emoji character (e.g., '👍', '❤️', '🔥')
 * @param messageId ID of the message to react to
 */
export async function sendReaction(
  phone: string,
  emoji: string,
  messageId: string
): Promise<WhatsAppSuccessResponse> {
  if (!emoji || !messageId) {
    throw new WhatsAppValidationError('Emoji and messageId are required for reaction.');
  }

  return sendWhatsAppRequest({
    phone,
    reaction: {
      emoji,
      messageId,
    },
  });
}

/**
 * 10. Send Reply quoting an existing message.
 *
 * @param phone Destination phone number
 * @param text The response message
 * @param quotedMessageId ID of the original message being replied to
 */
export async function sendReply(
  phone: string,
  text: string,
  quotedMessageId: string
): Promise<WhatsAppSuccessResponse> {
  if (!text || !quotedMessageId) {
    throw new WhatsAppValidationError('Reply text and quotedMessageId are required.');
  }

  return sendWhatsAppRequest({
    phone,
    message: text,
    quotedMessageId,
  });
}

// ============================================================================
// 7. HELPER UTILITIES
// ============================================================================

/**
 * Infer MIME content-type from file extension or URL string.
 */
function inferContentType(pathOrUrl: string, fallback: string): string {
  const cleanPath = pathOrUrl.split('?')[0].toLowerCase();
  if (cleanPath.endsWith('.png')) return 'image/png';
  if (cleanPath.endsWith('.jpg') || cleanPath.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanPath.endsWith('.webp')) return 'image/webp';
  if (cleanPath.endsWith('.gif')) return 'image/gif';
  if (cleanPath.endsWith('.pdf')) return 'application/pdf';
  if (cleanPath.endsWith('.mp4')) return 'video/mp4';
  if (cleanPath.endsWith('.mov')) return 'video/quicktime';
  if (cleanPath.endsWith('.mp3')) return 'audio/mpeg';
  if (cleanPath.endsWith('.ogg')) return 'audio/ogg';
  if (cleanPath.endsWith('.wav')) return 'audio/wav';
  if (cleanPath.endsWith('.doc')) return 'application/msword';
  if (cleanPath.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return fallback;
}

export default {
  sendTextMessage,
  sendImage,
  sendDocument,
  sendVideo,
  sendAudio,
  sendLocation,
  sendContact,
  sendPoll,
  sendReaction,
  sendReply,
  sendWhatsAppRequest,
  sanitizePhoneNumber,
  getWhatsAppConfig,
};
