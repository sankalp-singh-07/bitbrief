import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@bitbrief.com';

// In-memory rate limiting configuration
const rateLimitMap = new Map<string, number[]>();
const EMAIL_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(email) || [];
  const activeTimestamps = timestamps.filter(ts => now - ts < WINDOW_MS);
  
  if (activeTimestamps.length >= EMAIL_LIMIT) {
    return false;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(email, activeTimestamps);
  return true;
}

// Nodemailer transporter helper
async function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    // Fallback/Mock transport in development when credentials are not configured
    console.warn('SMTP credentials not configured. Using mock console mailer.');
    return {
      sendMail: async (mailOptions: { to: string; subject: string; html: string }) => {
        console.log('--- Mock Mail Output ---');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Content Preview: ${mailOptions.html.slice(0, 200)}...`);
        console.log('------------------------');
        return { messageId: 'mock_' + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    pool: true, // Use SMTP connection pooling
    maxConnections: 5,
    maxMessages: 100,
  });
}

// Send standard email
export async function sendMail(to: string, subject: string, html: string) {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: SMTP_FROM,
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer sendMail failed:', error);
    throw new Error('Failed to deliver email message');
  }
}

function getBaseHtmlTemplate(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f5f7;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-top: 30px;
            margin-bottom: 30px;
            border: 1px solid #e1e4e8;
          }
          .header {
            background-color: #0077B6;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px 30px;
            color: #2D2D2D;
            line-height: 1.6;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #eaeaea;
          }
          .button {
            display: inline-block;
            background-color: #0077B6;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>bitBrief.</h1>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} bitBrief. All rights reserved.</p>
            <p>You are receiving this email because you signed up on bitBrief.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  if (!checkRateLimit(to)) throw new Error('Rate limit exceeded for emails to this address.');
  const subject = 'Welcome to bitBrief! 🚀';
  const html = getBaseHtmlTemplate(
    'Welcome to bitBrief',
    `<h2>Welcome, ${name}!</h2>
     <p>Thank you for joining bitBrief. We are excited to help you optimize your cryptocurrency research with AI-driven insights.</p>
     <p>Here is what you can do right now:</p>
     <ul>
       <li><strong>Build a Watchlist</strong>: Track up to 3 coins for free, monitoring prices and trend metrics.</li>
       <li><strong>Generate Newsletters</strong>: Compile custom analytical reports on your selected assets dynamically.</li>
       <li><strong>Get Volatility Alerts</strong>: Configure target price triggers to stay ahead of market moves.</li>
     </ul>
     <p>Ready to get started? Head to your dashboard now.</p>
     <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>`
  );
  return sendMail(to, subject, html);
}

// 2. Subscription/Purchase Confirmation Email
export async function sendSubscriptionEmail(to: string, name: string, plan: string, expiryDate: Date) {
  if (!checkRateLimit(to)) throw new Error('Rate limit exceeded for emails to this address.');
  const subject = 'Your bitBrief Pro Subscription is Active! ⚡';
  const expiryString = new Date(expiryDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const html = getBaseHtmlTemplate(
    'Subscription Activated',
    `<h2>Thank You for Upgrading, ${name}!</h2>
     <p>Your subscription to <strong>bitBrief Pro</strong> is officially active.</p>
     <p>You now have full, unrestricted access to the complete suite of premium research tools:</p>
     <ul>
       <li><strong>Expanded Watchlist</strong>: Track up to 10 cryptocurrencies simultaneously.</li>
       <li><strong>AI Predictive Market Insights</strong>: View machine learning projections and support/resistance clusters.</li>
       <li><strong>Unlimited Active Alerts</strong>: Set up as many target price notifications as you need.</li>
       <li><strong>Whale Accumulation Heatmaps</strong>: Monitor institutional movement trends.</li>
     </ul>
     <div style="background-color: #f8f9fa; border: 1px solid #eaeaea; padding: 15px; border-radius: 8px; margin-top: 20px; margin-bottom: 20px;">
       <p style="margin: 0; font-size: 14px;"><strong>Plan details:</strong></p>
       <p style="margin: 5px 0 0 0; font-size: 14px;">Price: $10.00 (One-time/3-month pass)</p>
       <p style="margin: 5px 0 0 0; font-size: 14px;">Valid until: <strong>${expiryString}</strong></p>
     </div>
     <p>Enjoy your premium tools!</p>
     <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Access Pro Tools</a>`
  );
  return sendMail(to, subject, html);
}

// 3. Support Ticket Email (delivery to staff + receipt to user)
export async function sendSupportTicketEmail(fromEmail: string, name: string, ticketSubject: string, description: string) {
  if (!checkRateLimit(fromEmail)) throw new Error('Rate limit exceeded for emails to this address.');
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@bitbrief.com';
  
  // Send receipt to user
  const userSubject = `Support Request Received: ${ticketSubject}`;
  const userHtml = getBaseHtmlTemplate(
    'Support Ticket Received',
    `<h2>Hello ${name},</h2>
     <p>We have successfully received your support request. Our team is reviewing the details and will get back to you shortly.</p>
     <div style="background-color: #f8f9fa; border-left: 4px solid #0077B6; padding: 15px; margin: 20px 0; border-radius: 4px;">
       <p style="margin: 0 0 5px 0; font-weight: bold;">Ticket Summary:</p>
       <p style="margin: 0 0 10px 0; font-style: italic;">"${ticketSubject}"</p>
       <p style="margin: 0; font-size: 13px; color: #555;">${description.replace(/\n/g, '<br>')}</p>
     </div>
     <p>Thank you for your patience.</p>`
  );
  await sendMail(fromEmail, userSubject, userHtml);

  // Send copy to support team
  const staffSubject = `[SUPPORT TICKET] ${ticketSubject} (User: ${name})`;
  const staffHtml = `
    <h3>New Support Request Received</h3>
    <p><strong>From:</strong> ${name} (&lt;${fromEmail}&gt;)</p>
    <p><strong>Subject:</strong> ${ticketSubject}</p>
    <p><strong>Description:</strong></p>
    <div style="background-color: #f8f9fa; padding: 15px; border: 1px solid #eaeaea; border-radius: 6px; font-family: sans-serif;">
      ${description.replace(/\n/g, '<br>')}
    </div>
  `;
  return sendMail(supportEmail, staffSubject, staffHtml);
}

// 4. Email Verification Helper Template
export async function sendVerificationEmail(to: string, code: string) {
  if (!checkRateLimit(to)) throw new Error('Rate limit exceeded for emails to this address.');
  const subject = 'Verify your email address';
  const html = getBaseHtmlTemplate(
    'Verify your email',
    `<h2>Email Verification</h2>
     <p>Please use the following verification code to complete your registration:</p>
     <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
       ${code}
     </div>
     <p>This code will expire in 15 minutes.</p>`
  );
  return sendMail(to, subject, html);
}

// 5. Password Reset Helper Template
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  if (!checkRateLimit(to)) throw new Error('Rate limit exceeded for emails to this address.');
  const subject = 'Reset your password';
  const html = getBaseHtmlTemplate(
    'Reset your password',
    `<h2>Password Reset Request</h2>
     <p>We received a request to reset the password for your account. Click the button below to set a new password:</p>
     <div style="text-align: center;">
       <a href="${resetLink}" class="button">Reset Password</a>
     </div>
     <p>If you did not make this request, you can safely ignore this email.</p>
     <p>This link will expire in 1 hour.</p>`
  );
  return sendMail(to, subject, html);
}
