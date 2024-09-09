const userEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; padding: 20px;">
        <div style="text-align: center;">
            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="width: 150px;"/>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <h1 style="color: #333;">Thank You, ${name}!</h1>
            <p style="color: #555;">We have received your message. Our team will get back to you as soon as possible.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888;">
            <p>&copy; 2024 Zens. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;


// Email template for the admin (with inline CSS)
const adminEmailTemplate = (name, email, phone, subject, message) => `
<!DOCTYPE html>
<html>
<head></head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="padding: 20px; max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="width: 150px;">
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <h1 style="color: #333;">New Contact Submission</h1>
            <p style="color: #555;"><strong>Name:</strong> ${name}</p>
            <p style="color: #555;"><strong>Email:</strong> ${email}</p>
            <p style="color: #555;"><strong>Phone:</strong> ${phone}</p>
            <p style="color: #555;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #555;"><strong>Message:</strong> ${message}</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888;">
            <p>&copy; 2024 Zens. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
    userEmailTemplate,adminEmailTemplate
}