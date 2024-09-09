const userEmailTemplate = (name) => {
    `
    <div style="font-family: Arial, sans-serif; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div style="background: #fff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; max-width: 600px; width: 100%;">
            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2>Registration Successful, ${name}!</h2>
            <p style="font-size: 16px;">We are happy to inform you that your registration with Zens has been completed successfully.</p>
            <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
            <p style="font-size: 16px;">Thank you,</p>
            <p style="font-size: 16px;">Zens Team</p>
        </div>
    </div>
    `;
}

const adminEmailTemplate = (name, email, phone) => {
    `
    <div style="font-family: Arial, sans-serif; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
     <div style="background: #fff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; max-width: 600px; width: 100%;">
         <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="width: 150px; margin-bottom: 20px;" />
         <h2>New User Registered</h2>
         <p style="font-size: 16px;">A new user has registered on Zens with the following details:</p>
         <ul style="font-size: 16px; line-height: 1.6; list-style: none; padding: 0;">
             <li>Name: ${name}</li>
             <li>Email: ${email}</li>
             <li>Phone: ${phone}</li>
         </ul>
         <p style="font-size: 16px;">Please follow up if necessary.</p>
         <p style="font-size: 16px;">Zens Admin</p>
     </div>
    </div>
    `;
}

const forgetMailSendOtp = (name ,otp)=>{
    `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; box-sizing: border-box;">
            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="display: block; margin: 0 auto; width: 200px;"/>
            <h2 style="color: #0056b3; font-size: 24px; margin: 0 0 10px;">Hello ${name},</h2>
            <p style="font-size: 16px; margin: 0 0 10px;">We received a request to reset your password. To complete the process, please use the OTP below:</p>
            <h3 style="font-size: 24px; color: #e74c3c; margin: 0 0 10px;">${otp}</h3>
            <p style="font-size: 14px; color: #555; margin: 0 0 20px;">For security reasons, please do not share this OTP with anyone. If you did not request a password reset, you can safely ignore this email.</p>
            <p style="margin: 0 0 10px;">Thank you,<br>
            <strong>Zens</strong></p>
            <p style="font-size: 12px; color: #aaa; margin: 0;">If you have any questions or need further assistance, please contact our support team.</p>
        </div>
    </body>
    </html>
`
}

const sendMailAfterfrogetPassword = (name)=>{
    `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; box-sizing: border-box;">
            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="display: block; margin: 0 auto; width: 200px;"/>
            <h2 style="color: #0056b3; font-size: 24px; margin: 0 0 10px;">Hello ${name},</h2>
            <p style="font-size: 16px; margin: 0 0 10px;">Your password has been reset successfully. If you did not request this change, please contact our support team immediately.</p>
            <p style="font-size: 14px; color: #555; margin: 0 0 20px;">Thank you,<br><strong>Zens</strong></p>
            <p style="font-size: 12px; color: #aaa; margin: 0;">If you have any questions or need further assistance, please contact our support team.</p>
        </div>
    </body>
    </html>
`
}

const ChangePasswordMail = (name)=>{
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center;">
                <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="ZENS Logo" style="max-width: 150px; height: auto;">
            </div>
            <div style="text-align: center; padding: 20px;">
                <h1 style="color: #007bff;">Password Changed Successfully</h1>
                <p style="color: #333; font-size: 16px;">Dear User ${name},</p>
                <p style="color: #333; font-size: 16px;">Your password has been changed successfully. If you did not request this change, please contact our support immediately.</p>
                <p style="color: #333; font-size: 16px;">Thank you for using our service!</p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 14px; color: #888;">
                &copy; 2024 ZENS. All rights reserved.
            </div>
        </div>
    </body>
    </html>
`
}

module.exports = {
    userEmailTemplate ,adminEmailTemplate ,forgetMailSendOtp ,sendMailAfterfrogetPassword ,ChangePasswordMail
}