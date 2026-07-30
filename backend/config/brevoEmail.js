import nodemailer from "nodemailer";
import * as brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates modern, dark metallic & gold HTML email template for Brevo OTP emails
 */
const getOtpEmailHtmlTemplate = (recipientName, otp, portalType = "USER") => {
  const isAdmin = portalType === "ADMIN";
  const portalTitle = isAdmin ? "ADMIN SECURITY CONSOLE" : "ATHLETE PORTAL";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #000000;
      padding: 40px 10px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #09090b;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
    }
    .header {
      background: linear-gradient(180deg, #18181b 0%, #09090b 100%);
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: rgba(212, 175, 55, 0.15);
      border: 1px solid #D4AF37;
      border-radius: 12px;
      color: #F5D76E;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: 1px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-gold {
      color: #D4AF37;
    }
    .content {
      padding: 35px 30px;
      text-align: center;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .message {
      font-size: 13px;
      color: #a1a1aa;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .otp-box {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
      border: 2px dashed #D4AF37;
      border-radius: 16px;
      padding: 20px;
      margin: 0 auto 28px auto;
      max-width: 320px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #F5D76E;
      margin: 0;
      padding-left: 12px;
    }
    .expiry-text {
      font-size: 11px;
      color: #71717a;
      margin-top: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .expiry-highlight {
      color: #D4AF37;
      font-weight: 700;
    }
    .warning {
      background-color: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
      text-align: left;
      margin-top: 20px;
      border-left: 3px solid #D4AF37;
    }
    .footer {
      background-color: #000000;
      padding: 20px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 10px;
      color: #52525b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="badge">${portalTitle}</div>
        <h1 class="brand-title">XCLUSIVE <span class="brand-gold">FITNESS</span></h1>
      </div>

      <!-- Main Body -->
      <div class="content">
        <div class="greeting">Hello ${recipientName || "Valued Athlete"},</div>
        <p class="message">
          We received a request to reset your password for your <strong>Xclusive Fitness</strong> account. 
          Use the 6-digit security code below to complete your password recovery.
        </p>

        <!-- OTP Display Box -->
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="expiry-text">Valid for <span class="expiry-highlight">10 Minutes</span></div>
        </div>

        <div class="warning">
          <strong>Security Notice:</strong> If you did not initiate this password reset request, please ignore this email or contact support immediately. Never share your verification code with anyone.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        © 2026 Xclusive Fitness & Performance Center. All rights reserved.<br>
        Automated Security Dispatch • Do not reply directly to this email.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const sendBrevoOtpEmail = async ({ toEmail, recipientName, otp, portalType = "USER" }) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "jyotipandeycselit@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Xclusive Fitness";
  const apiKey = process.env.BRAVO_API_KEY || process.env.BREVO_API_KEY;
  const smtpKey = process.env.BRAVO_SMTP_KEY || apiKey;
  const smtpHost = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
  const smtpUser = process.env.BREVO_SMTP_USER || "b3c209001@smtp-brevo.com";
  const smtpPort = parseInt(process.env.BRAVO_PORT || "587", 10);

  const subject = `[Xclusive Fitness] ${otp} is your ${portalType} Password Reset Code`;
  const htmlContent = getOtpEmailHtmlTemplate(recipientName, otp, portalType);

  // Send via Brevo SMTP Relay
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // 587 uses STARTTLS
      auth: {
        user: smtpUser,
        pass: smtpKey,
      },
    });

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Brevo SMTP Email Dispatched] Success to ${toEmail} | MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (smtpError) {
    console.error("[Brevo SMTP Email Error] Failed to send email via Brevo SMTP:", smtpError.message);
    throw new Error(`Email dispatch failed via Brevo: ${smtpError.message}`);
  }
};
