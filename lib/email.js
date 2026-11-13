import nodemailer from "nodemailer";

// Lazy-initialized Nodemailer transporter
let transporter = null;

function getTransporter() {
  const user = process.env.GMAIL_USER || "careslot85@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: pass.replace(/\s+/g, ""), // Strip spaces if copied like "abcd efgh ijkl mnop"
      },
      tls: {
        rejectUnauthorized: false, // Prevents certificate verification issue on Windows/corporate proxies
      },
    });
  }
  return transporter;
}

/**
 * Sends a hospital-branded verification email with a 6-digit OTP code
 * @param {string} recipientEmail - Target patient email address
 * @param {string} otpCode - 6-digit verification code
 * @param {string} [purpose="login"] - 'login' or 'signup'
 * @returns {Promise<{ sent: boolean, error?: string }>}
 */
export async function sendOtpEmail(recipientEmail, otpCode, purpose = "login") {
  const mailer = getTransporter();
  const senderEmail = process.env.GMAIL_USER || "careslot85@gmail.com";

  if (!mailer) {
    console.warn(
      `[CareSlot Email] GMAIL_APP_PASSWORD not configured. Code for ${recipientEmail}: ${otpCode}`
    );
    return {
      sent: false,
      reason: "GMAIL_APP_PASSWORD_NOT_SET",
      message: "Gmail App Password not configured in .env.local",
    };
  }

  const isSignup = purpose === "signup";
  const subject = isSignup
    ? `CareSlot - Verify Your Patient Email: ${otpCode}`
    : `CareSlot - Your Patient Login Code: ${otpCode}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 10px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); padding: 32px 30px; text-align: center;">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); width: 48px; height: 48px; border-radius: 14px; line-height: 48px; font-size: 24px; color: #ffffff; margin-bottom: 12px;">
                      🏥
                    </div>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
                      CareSlot <span style="color: #bae6fd;">Health</span>
                    </h1>
                    <p style="color: #e0f2fe; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                      Enterprise OPD & Digital Queue Sync
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 10px;">
                      ${isSignup ? "Verify Your Email Address" : "Patient Portal Access Code"}
                    </h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                      Hello, you recently requested access to the <strong>CareSlot Patient Portal</strong>. Use the 6-digit verification code below to complete your authentication:
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #f8fafc; border: 2px dashed #38bdf8; border-radius: 16px; padding: 24px; text-align: center; margin: 0 0 24px;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-bottom: 8px;">
                        One-Time Passcode (OTP)
                      </span>
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #0369a1; letter-spacing: 8px; display: inline-block;">
                        ${otpCode}
                      </span>
                      <span style="display: block; font-size: 12px; color: #0284c7; font-weight: 600; margin-top: 8px;">
                        ⏱ Valid for 10 minutes
                      </span>
                    </div>

                    <!-- Security Alert -->
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="color: #991b1b; font-size: 12px; line-height: 1.5; margin: 0;">
                        <strong>Security Notice:</strong> Never share this code with anyone. Hospital clinical staff will never call or message you asking for your verification passcode.
                      </p>
                    </div>

                    <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                      If you did not initiate this request, you can safely ignore this email. No access will be granted without this passcode.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0 0 6px;">
                      CareSlot Enterprise Hospital Systems • ISO 27001 & NABH Certified
                    </p>
                    <p style="color: #cbd5e1; font-size: 10px; margin: 0;">
                      Automated notification from ${senderEmail}. Please do not reply directly to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"CareSlot Health OPD" <${senderEmail}>`,
      to: recipientEmail,
      subject,
      text: `Your CareSlot 6-digit verification code is: ${otpCode}. It is valid for 10 minutes.`,
      html: htmlContent,
    });

    console.log(`[CareSlot Email] Successfully sent OTP to ${recipientEmail}:`, info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[CareSlot Email] Failed to send email to ${recipientEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
}
