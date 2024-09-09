const Checkout = require('../models/checkoutModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "rzp_test_XPcfzOlm39oYi8",
    key_secret: process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa",
});

const createCheckout = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, name, email, phone, address, state, city, pin, cartItems, totalPrice, transactionId, orderStatus, paymentMode, paymentStatus } = req.body;
        const errorMessage = [];
        if (!userId) errorMessage.push("UserId is required.");
        if (!name) errorMessage.push("Name is required.");
        if (!email) errorMessage.push("Email is required.");
        if (!phone) errorMessage.push("Phone is required.");
        if (!address) errorMessage.push("Address is required.");
        if (!state) errorMessage.push("State is required.");
        if (!city) errorMessage.push("City is required.");
        if (!pin) errorMessage.push("Pin code is required.");
        if (!Array.isArray(cartItems) || cartItems.length === 0) errorMessage.push("Cart items are required.");
        if (typeof totalPrice !== 'number' || totalPrice <= 0) errorMessage.push("Total price must be a positive number.");
        if (errorMessage.length > 0) {
            return res.status(400).json({ errors: errorMessage });
        }
        if (paymentMode === "Cash on Delivery") {
            const newCheckout = new Checkout({
                userId,
                name,
                email,
                phone,
                address,
                state,
                city,
                pin,
                cartItems,
                totalPrice,
                transactionId: null,
                orderStatus,
                paymentMode,
                paymentStatus: 'Pending'
            });
            const savedCheckout = await newCheckout.save();
            res.status(200).json(savedCheckout);
        }
        else if (paymentMode === 'Online Payment') {
            const options = {
                amount: Math.round(totalPrice * 100), // Convert to paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`, // Unique receipt ID
            };

            const order = await razorpay.orders.create(options);
            if (!order) {
                return res.status(500).json({ message: "Razorpay order creation failed." });
            }

            const newCheckout = new Checkout({
                userId,
                name,
                email,
                phone,
                address,
                state,
                city,
                pin,
                cartItems,
                totalPrice,
                transactionId: order.id, // Save the Razorpay Order ID
                orderStatus: 'Pending',
                paymentMode,
                paymentStatus: 'Pending' // Payment is pending until verified
            });
            const savedCheckout = await newCheckout.save();
            res.status(200).json({
                message: 'Order created successfully. Proceed with payment.',
                checkout: savedCheckout,
                razorpayOrderId: order.id,
                amount: options.amount,
                currency: options.currency,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while creating checkout." });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Create HMAC with your Razorpay API Secret
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa");
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Payment verified successfully, update the checkout status
            const updatedCheckout = await Checkout.findOneAndUpdate(
                { transactionId: razorpay_order_id },
                { paymentStatus: 'Successfull', orderStatus: 'Confirmed' },
                { new: true }
            );
            if (!updatedCheckout) {
                return res.status(404).json({ message: "Order not found." });
            }
            res.status(200).json({ message: 'Payment successful and order confirmed.', checkout: updatedCheckout });
        } else {
            res.status(400).json({ message: 'Invalid signature, payment verification failed.' });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: 'Server error during payment verification.' });
    }
};





const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find({});
        res.status(200).json(checkouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkouts." });
    }
};

const getCheckoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(checkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkout." });
    }
};

const deleteCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCheckout = await Checkout.findByIdAndDelete(id);
        if (!deletedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json({ message: "Checkout deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while deleting checkout." });
    }
};

const updateCheckoutStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;
        const updatedCheckout = await Checkout.findByIdAndUpdate(
            id,
            { orderStatus, paymentStatus },  // Fields to update
            { new: true, runValidators: true } // Return updated document and run validators
        );
        if (!updatedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(updatedCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while updating checkout status." });
    }
};

const getCheckOutByUserID = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Checkout.find({ userId });  // find based on userId, not findOne
        if (!data.length) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    createCheckout,
    getAllCheckouts,
    getCheckoutById,
    deleteCheckout,
    updateCheckoutStatus,
    getCheckOutByUserID,
    verifyPayment,
};
