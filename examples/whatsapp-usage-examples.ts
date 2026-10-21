/**
 * SwiftProject WhatsApp Gateway - Production Usage Examples
 *
 * Demonstrates:
 * 1. Next.js App Router API Route (POST /api/whatsapp/send)
 * 2. Next.js Server Action (sendOrderNotification, sendOtpVerification, sendAppointmentReminder)
 * 3. Express Controller with Full Quota & 429 Error Handling
 */

import {
  sendTextMessage,
  sendImage,
  sendDocument,
  sendLocation,
  sendPoll,
  WhatsAppRateLimitError,
  WhatsAppDailyQuotaExceededError,
  WhatsAppAuthError,
  WhatsAppValidationError,
  type WhatsAppSuccessResponse
} from '../lib/whatsapp.ts';

// ============================================================================
// EXAMPLE 1: Next.js App Router API Route (app/api/whatsapp/send/route.ts)
// ============================================================================

/**
 * Sample Next.js 13+ App Router Route Handler
 * Endpoint: POST /api/whatsapp/send
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, phone, order, otp, appointment } = body;

    let response: WhatsAppSuccessResponse;

    switch (type) {
      case 'ORDER_CONFIRMATION': {
        const orderMessage = `
🎉 *Order Confirmed!*

Hi ${order.customerName}!
Your order *#${order.orderNumber}* has been received and confirmed.

📦 Total: ₹${order.total}
📅 Expected Delivery: ${order.deliveryDate}

Track order: https://geethikadigitalworld.com/order/${order.id}
Need help? Call +91 9492686421
        `.trim();

        response = await sendTextMessage(phone, orderMessage);
        break;
      }

      case 'OTP': {
        const otpMessage = `🔐 *Geethika Digital World*: Your verification code is *${otp.code}*. Valid for 10 minutes. Do not share this OTP with anyone.`;
        response = await sendTextMessage(phone, otpMessage);
        break;
      }

      case 'APPOINTMENT_REMINDER': {
        const reminder = `
📸 *Photography Session Reminder*

Hi ${appointment.clientName},
This is a gentle reminder about your photoshoot session:

📅 Date: ${appointment.date}
⏰ Time: ${appointment.time}
📍 Venue: ${appointment.venue}

We look forward to creating wonderful memories!
        `.trim();

        response = await sendTextMessage(phone, reminder);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported message type: ${type}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Log remaining daily quota
    if (response.quota) {
      console.log(`[WhatsApp Gateway] Message ${response.messageId} queued for ${response.to}.`);
      console.log(`[WhatsApp Gateway Quota] Plan: ${response.quota.plan} | Used Today: ${response.quota.usedToday}/${response.quota.dailyLimit} | Remaining: ${response.quota.dailyRemaining}`);
    }

    return new Response(JSON.stringify({ success: true, data: response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // 1. Handle Burst Rate Limiting (Too many requests in 1 minute)
    if (error instanceof WhatsAppRateLimitError) {
      console.warn(`[WhatsApp Burst Throttle] Retry after ${error.retryAfter}s`);
      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code,
          retryAfter: error.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(error.retryAfter),
          },
        }
      );
    }

    // 2. Handle Daily Message Quota Cap (Exceeded dailyLimit, e.g. 500)
    if (error instanceof WhatsAppDailyQuotaExceededError) {
      console.error(`[WhatsApp Daily Quota Cap Reached] Reset at ${error.resetsAt}`);
      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code,
          dailyLimit: error.dailyLimit,
          usedToday: error.usedToday,
          resetsAt: error.resetsAt,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Handle Validation Error (Invalid phone number or empty message)
    if (error instanceof WhatsAppValidationError) {
      return new Response(
        JSON.stringify({ error: error.message, code: 'VALIDATION_ERROR' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Handle Gateway Auth Error (Token invalid or missing)
    if (error instanceof WhatsAppAuthError) {
      return new Response(
        JSON.stringify({ error: error.message, code: 'AUTH_ERROR' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('[WhatsApp API Route Error]', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ============================================================================
// EXAMPLE 2: Next.js Server Actions (actions/whatsapp.ts)
// ============================================================================

/**
 * Server Action: Dispatch Order Confirmation with Invoice PDF
 */
export async function sendOrderWithInvoiceAction(order: {
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  invoiceUrl: string;
  total: number;
}) {
  try {
    const caption = `Invoice for Order #${order.orderNumber} - ₹${order.total}`;
    
    // Dispatch invoice PDF directly via WhatsApp
    const result = await sendDocument(
      order.customerPhone,
      order.invoiceUrl,
      `Invoice_${order.orderNumber}.pdf`,
      caption
    );

    console.log(`[Server Action] Sent invoice to ${result.to}, daily remaining: ${result.quota?.dailyRemaining}`);
    return { success: true, messageId: result.messageId, quota: result.quota };
  } catch (error: any) {
    if (error instanceof WhatsAppDailyQuotaExceededError) {
      console.error(`Daily limit reached: ${error.usedToday}/${error.dailyLimit}`);
      return { success: false, error: 'Daily WhatsApp quota reached. Message queued for tomorrow.' };
    }
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Send Interactive Customer Feedback Poll
 */
export async function sendFeedbackPollAction(customerPhone: string, orderNumber: string) {
  try {
    const question = `How was your experience with Order #${orderNumber} from Geethika Digital World?`;
    const options = ['⭐⭐⭐⭐⭐ Excellent', '⭐⭐⭐⭐ Good', '⭐⭐⭐ Average', 'Need Assistance'];

    const result = await sendPoll(customerPhone, question, options, 1);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// EXAMPLE 3: Express Controller (controllers/whatsappController.ts)
// ============================================================================

export const expressWhatsAppController = {
  /**
   * Express Handler: Send OTP SMS/WhatsApp
   */
  async sendOtp(req: any, res: any) {
    const { phone, otp } = req.body;

    try {
      const message = `Your Geethika Digital World login OTP is: *${otp}*. Valid for 5 minutes.`;
      const result = await sendTextMessage(phone, message);

      if (result.quota) {
        console.log(`[Express OTP] Dispatched OTP. Quota used: ${result.quota.usedToday}/${result.quota.dailyLimit}`);
      }

      return res.json({
        success: true,
        message: 'OTP sent via WhatsApp',
        messageId: result.messageId,
        dailyRemaining: result.quota?.dailyRemaining,
      });
    } catch (error: any) {
      if (error instanceof WhatsAppRateLimitError) {
        return res.status(429).json({
          error: error.message,
          retryAfter: error.retryAfter,
        });
      }

      if (error instanceof WhatsAppDailyQuotaExceededError) {
        return res.status(429).json({
          error: error.message,
          dailyLimit: error.dailyLimit,
          usedToday: error.usedToday,
        });
      }

      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Express Handler: Share Studio Location Coordinates
   */
  async shareStudioLocation(req: any, res: any) {
    const { customerPhone } = req.body;

    try {
      const result = await sendLocation(
        customerPhone,
        17.385044, // Latitude
        78.486671, // Longitude
        'Geethika Digital World Studio',
        'Main Road, Near Bus Stand'
      );

      return res.json({
        success: true,
        messageId: result.messageId,
        quota: result.quota,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};
