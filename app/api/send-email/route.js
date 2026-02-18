import { transporter } from '@/utils/transporter';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, message } = await request.json();
console.log(name, email, message)
  const mailOptions = {
    from: email,
    to: process.env.HOST_GMAIL,
    subject: `Contact Form Submission from ${name}`,
    html: ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        
        body {
          font-family: 'Inter', Arial, sans-serif;
          line-height: 1.6;
          color: #2C3E50;
          max-width: 600px;
          margin: 0 auto;
          background-color: #F4F6F9;
        }
        .email-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 1px solid #ECF0F1;
        }
        .header {
          background-color: #F4F6F9;
          color: black;
          display:flex;
          justify-content: between;
          align-items: center;
          padding: 2px;
          text-align: center;
        }
        .header h1 {
          color:black;
          font-size: 24px;
          padding: 5px;
          font-weight: 600;
        }
          .header img{
          width: 100px;
          height: 100px;
          }
        .content {
          padding: 30px;
        }
        .details-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
        }
        .details-table td {
          padding: 10px;
          border-bottom: 1px solid #ecf0f1;
        }
        .label {
          font-weight: bold;
          color: #7f8c8d;
          width: 30%;
        }
        .value {
          color: #2c3e50;
        }
        
        .footer {
          background-color: #F4F6F9;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #7F8C8D;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
       <h1>New User Submission</h1>
        </div>
        
        <div class="content">
         <table class="details-table">
          <tr>
            <td class="label">Name:</td>
            <td class="value">${name}</td>
          </tr>
          <tr>
            <td class="label">Email:</td>
            <td class="value">${email}</td>
          </tr>
          <tr>
            <td class="label">Message:</td>
            <td class="value">${message}</td>
          </tr>
        </table>
          
          <p style="text-align: center; color: #7F8C8D; margin: 0;">
            Submission received on ${new Date().toLocaleString()}
          </p>
        </div>
        
        <div class="footer">
          © ${new Date().getFullYear()} The Squirrel. All rights reserved.
        </div>
      </div>
    </body>
    </html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}