const orderSendMail = (name ,email ,phone ,address ,city ,state ,pin ,totalPrice ,orderStatus ,paymentMode ,paymentStatus)=>{
    `
                    <html>
                    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; box-sizing: border-box;">
                            <img src="https://urjjafrontend-git-main-mannu-s-projects.vercel.app/static/media/ZENS%20logo%20TM%20CDR%20(1).20ad0761e23f3c801c7f.png" alt="Zens Logo" style="display: block; margin: 0 auto; width: 200px;"/>
                            <h2 style="color: #0056b3; font-size: 24px; margin: 0 0 10px;">Order Confirmation</h2>
                            <p style="font-size: 16px; margin: 0 0 10px;">Thank you for your order, ${name}!</p>
                            <p style="font-size: 16px; margin: 0 0 10px;">Here are the details of your order:</p>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Name:</strong> ${name}</li>
                                <li><strong>Email:</strong> ${email}</li>
                                <li><strong>Phone:</strong> ${phone}</li>
                                <li><strong>Address:</strong> ${address}, ${city}, ${state}, ${pin}</li>
                                <li><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</li>
                                <li><strong>Order Status:</strong> ${orderStatus}</li>
                                <li><strong>Payment Mode:</strong> ${paymentMode}</li>
                                <li><strong>Payment Status:</strong> ${paymentStatus}</li>
                            </ul>
                            <p style="font-size: 14px; color: #555; margin: 0 0 20px;">If you have any questions or need further assistance, please contact our support team.</p>
                            <p style="margin: 0 0 10px;">Thank you,<br><strong>Zens</strong></p>
                            <p style="font-size: 12px; color: #aaa; margin: 0;">If you did not place this order, please contact our support team immediately.</p>
                        </div>
                    </body>
                    </html>
                `
}

module.exports = {
    orderSendMail
}