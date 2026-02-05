import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Send OTP Email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'verification' 
    ? 'Verify Your Email - Geethika Digital World'
    : 'Password Reset OTP - Geethika Digital World';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #FF69B4, #DC143C);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .otp-box {
          background: #f0f0f0;
          border: 2px dashed #DC143C;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          border-radius: 8px;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #DC143C;
          letter-spacing: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #FF69B4, #DC143C);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌹 Geethika Digital World</h1>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p>${purpose === 'verification' 
            ? 'Thank you for registering with Geethika Digital World. Please use the OTP below to verify your email address.' 
            : 'You requested to reset your password. Please use the OTP below to proceed.'
          }</p>
          
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
          </div>

          <p><strong>Important:</strong></p>
          <ul>
            <li>This OTP is valid for 10 minutes only</li>
            <li>Do not share this OTP with anyone</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>

          <p>Best regards,<br><strong>Geethika Digital World Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Geethika Digital World. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Geethika Digital World" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html
  };

  try {
    console.log(`📧 Sending email to: ${email}`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`📤 From: ${process.env.EMAIL_USER}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    throw error;
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #FF69B4, #DC143C);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌹 Welcome to Geethika Digital World!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Welcome to Geethika Digital World! We're excited to have you join our community.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our beautiful collection of products</li>
            <li>Book our professional services</li>
            <li>Track your orders</li>
            <li>Enjoy exclusive offers</li>
          </ul>
          <p>If you have any questions, feel free to contact us anytime.</p>
          <p>Best regards,<br><strong>Geethika Digital World Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Geethika Digital World" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Geethika Digital World! 🌹',
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
  }
};

export default transporter;
