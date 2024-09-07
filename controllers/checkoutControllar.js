const Checkout = require('../models/checkoutModel');

const createCheckout = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, phone, address, state, city, pin, cartItems, totalPrice, transactionId, orderStatus, paymentMode, paymentStatus } = req.body;
        const errorMessage = [];
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
        const newCheckout = new Checkout({
            name,
            email,
            phone,
            address,
            state,
            city,
            pin,
            cartItems,
            totalPrice,
            transactionId,
            orderStatus,
            paymentMode,
            paymentStatus
        });
        const savedCheckout = await newCheckout.save();
        res.status(200).json(savedCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while creating checkout." });
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


module.exports = {
    createCheckout ,
    getAllCheckouts,
    getCheckoutById,
    deleteCheckout,
    updateCheckoutStatus
};
