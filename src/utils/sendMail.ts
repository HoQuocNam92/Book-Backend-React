import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendMail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Reset your password',
    html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                  Reset Your Password
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px; color: #333333;">
                <p style="font-size: 16px; margin-bottom: 16px;">
                  Hi,
                </p>

                <p style="font-size: 16px; margin-bottom: 16px;">
                  We received a request to reset your password. Click the button below to continue.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a
                    href="${link}"
                    style="
                      display: inline-block;
                      background-color: #2563eb;
                      color: #ffffff;
                      padding: 14px 28px;
                      text-decoration: none;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 6px;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p style="font-size: 14px; color: #555;">
                  This link will expire in <strong>10 minutes</strong>.
                </p>

                <p style="font-size: 14px; color: #555;">
                  If you didn’t request a password reset, you can safely ignore this email.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

                <p style="font-size: 12px; color: #888;">
                  If the button above does not work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 12px; word-break: break-all; color: #2563eb;">
                  ${link}
                </p>
              </td>
            </tr>

            <tr>
              <td style="background: #f9fafb; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  © ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
