/**
 * CareSlot SMS Dispatch Service
 * Supports:
 * 1. Fast2SMS (Free / popular for Indian +91 mobile numbers)
 * 2. Twilio (Global SMS Gateway)
 * 3. Graceful fallback logging when credentials are not yet configured
 */

export async function sendOtpSms(phoneNumber, otpCode) {
  const cleanPhone = (phoneNumber || "").replace(/\D/g, "").slice(-10);

  if (cleanPhone.length < 10) {
    return { sent: false, error: "Invalid 10-digit mobile phone number" };
  }

  // 1. FAST2SMS (India Quick SMS Gateway)
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsKey) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otpCode,
          numbers: cleanPhone,
        }),
      });
      const data = await response.json();
      if (data && data.return) {
        console.log(`[CareSlot SMS] Fast2SMS OTP dispatched to +91 ${cleanPhone}`);
        return { sent: true, provider: "fast2sms", messageId: data.request_id };
      }
      console.warn(`[CareSlot SMS] Fast2SMS error:`, data.message);
    } catch (err) {
      console.error(`[CareSlot SMS] Fast2SMS fetch error:`, err.message);
    }
  }

  // 2. TWILIO SMS (Global)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");
      const params = new URLSearchParams();
      params.append("To", `+91${cleanPhone}`);
      params.append("From", twilioFrom);
      params.append("Body", `Your CareSlot Hospital verification code is: ${otpCode}. Valid for 10 mins. Do not share this OTP.`);

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );
      const data = await res.json();
      if (data && data.sid) {
        console.log(`[CareSlot SMS] Twilio OTP sent to +91 ${cleanPhone}:`, data.sid);
        return { sent: true, provider: "twilio", messageId: data.sid };
      }
      console.warn(`[CareSlot SMS] Twilio error:`, data.message);
    } catch (err) {
      console.error(`[CareSlot SMS] Twilio fetch error:`, err.message);
    }
  }

  // 3. Fallback: Log to server console for development & demo testing
  console.log(`[CareSlot SMS Service] OTP for +91 ${cleanPhone}: ${otpCode}`);
  return {
    sent: false,
    reason: "SMS_GATEWAY_NOT_CONFIGURED",
    message: "SMS gateway credentials not set in .env.local",
  };
}
