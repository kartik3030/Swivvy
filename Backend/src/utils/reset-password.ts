export const resetPasswordTemplate = (email, resetUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Reset Your Password</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                        
                        <tr>
                            <td style="background:#18181b;padding:32px 40px;">
                                <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">
                                    Swivvy
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px;">
                                <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#18181b;">
                                    Reset Your Password
                                </h1>

                                <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.6;">
                                    We received a request to reset the password associated with:
                                </p>

                                <p style="margin:0 0 24px;font-size:15px;font-weight:600;color:#18181b;">
                                    ${email}
                                </p>

                                <p style="margin:0 0 32px;font-size:15px;color:#52525b;line-height:1.6;">
                                    Click the button below to create a new password. This link will expire shortly for security reasons.
                                </p>

                                <div style="text-align:center;margin-bottom:32px;">
                                    <a
                                        href="${resetUrl}" 
                                        style="
                                            display:inline-block;
                                            background:#18181b;
                                            color:#ffffff;
                                            text-decoration:none;
                                            padding:14px 32px;
                                            border-radius:8px;
                                            font-size:15px;
                                            font-weight:600;
                                        "
                                    >
                                        Reset Password
                                    </a>
                                </div>

                                <p style="margin:0 0 8px;font-size:14px;color:#52525b;">
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>

                                <p style="margin:0;font-size:13px;word-break:break-all;color:#2563eb;">
                                    ${resetUrl}
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:0 40px;">
                                <hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" />
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:24px 40px 32px;">
                                <p style="margin:0;font-size:13px;color:#a1a1aa;">
                                    If you didn't request a password reset, you can safely ignore this email.
                                </p>

                                <p style="margin:12px 0 0;font-size:13px;color:#a1a1aa;">
                                    © ${new Date().getFullYear()} Swivvy. All rights reserved.
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
};