export const resetPasswordTemplate = (email) => {
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
                            <td style="padding:40px 40px 32px;">
                                <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#18181b;">
                                    Reset your password
                                </h1>
                                <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.6;">
                                    We received a request to reset the password for <strong>${email}</strong>.
                                    If you didn't request this, you can safely ignore this email.
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