
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      purpose,
      message,
    } = body;

    if (
      !firstName ||
      !email ||
      !phone ||
      !service ||
      !purpose
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const firstNameHtml = escapeHtml(firstName);
    const lastNameHtml = escapeHtml(lastName || "Not provided");
    const emailHtml = escapeHtml(email);
    const phoneHtml = escapeHtml(phone);
    const serviceHtml = escapeHtml(service);
    const purposeHtml = escapeHtml(purpose);
    const messageHtml = escapeHtml(message || "No message provided").replace(
      /\r?\n/g,
      "<br />"
    );
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.CORS_ORIGIN ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "FamilyScript <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New FamilyScript Inquiry — ${firstName} ${lastName || ""}`,
      text: `
New contact form submission

First Name: ${firstName}
Last Name: ${lastName || "Not provided"}
Email: ${email}
Phone: ${phone}
Service: ${service}
Documentation Purpose: ${purpose}

Message:
${message || "No message provided"}
      `,
      html: `
        <!doctype html>
        <html lang="en">
          <body style="margin: 0; padding: 32px 16px; background-color: #f4eee3; color: #542338; font-family: Arial, Helvetica, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #fffdf9; border: 1px solid #ddcdb8; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 30px 32px 24px; background-color: #542338; text-align: center;">
                        <p style="margin: 0; color: #f4eee3; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">New inquiry</p>
                        <h1 style="margin: 10px 0 0; color: #ffffff; font-size: 25px; font-weight: 400; line-height: 1.25;">Family Script Website</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px 32px 34px;">
                        <p style="margin: 0 0 22px; color: #6e5360; font-size: 14px; line-height: 1.6;">A new contact form submission has arrived. The details are below.</p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: separate; border-spacing: 0 8px;">
                          <tr>
                            <td width="50%" style="padding: 14px 16px; background-color: #f7f0e6; border: 1px solid #eadcca; border-radius: 5px 0 0 5px;">
                              <p style="margin: 0 0 5px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Name</p>
                              <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.4;">${firstNameHtml} ${lastNameHtml}</p>
                            </td>
                            <td width="50%" style="padding: 14px 16px; background-color: #f7f0e6; border: 1px solid #eadcca; border-left: 0; border-radius: 0 5px 5px 0;">
                              <p style="margin: 0 0 5px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Phone</p>
                              <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.4;">${phoneHtml}</p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding: 14px 16px; background-color: #f7f0e6; border: 1px solid #eadcca; border-radius: 5px;">
                              <p style="margin: 0 0 5px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Email</p>
                              <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.4;"><a href="mailto:${emailHtml}" style="color: #542338; text-decoration: none;">${emailHtml}</a></p>
                            </td>
                          </tr>
                          <tr>
                            <td width="50%" style="padding: 14px 16px; background-color: #f7f0e6; border: 1px solid #eadcca; border-radius: 5px 0 0 5px;">
                              <p style="margin: 0 0 5px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Service</p>
                              <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.4;">${serviceHtml}</p>
                            </td>
                            <td width="50%" style="padding: 14px 16px; background-color: #f7f0e6; border: 1px solid #eadcca; border-left: 0; border-radius: 0 5px 5px 0;">
                              <p style="margin: 0 0 5px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Purpose</p>
                              <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.4;">${purposeHtml}</p>
                            </td>
                          </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 18px 20px; border-left: 3px solid #b99850; background-color: #fbf8f1;">
                          <p style="margin: 0 0 8px; color: #977b62; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;">Message</p>
                          <p style="margin: 0; color: #542338; font-size: 14px; line-height: 1.7;">${messageHtml}</p>
                        </div>
                        <p style="margin: 26px 0 0; color: #977b62; font-size: 12px; line-height: 1.5;">Reply directly to this email to respond to ${firstNameHtml}.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 32px; background-color: #f7f0e6; border-top: 1px solid #eadcca; text-align: center;">
                        <p style="margin: 0; color: #977b62; font-size: 11px; letter-spacing: 0.5px;">Family Script · Preserving stories, creating legacies</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "Unable to send your message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}