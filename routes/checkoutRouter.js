const { createCheckout, getAllCheckouts, getCheckoutById, updateCheckoutStatus, deleteCheckout } = require("../controllers/checkoutControllar")

const checkoutRouter = require("express").Router()
checkoutRouter.post("/checkout" ,createCheckout)
checkoutRouter.get('/checkouts', getAllCheckouts);
checkoutRouter.get('/checkout/:id', getCheckoutById);
checkoutRouter.put('/checkout/:id', updateCheckoutStatus);
checkoutRouter.delete('/checkout/:id', deleteCheckout);

module.exports = checkoutRouter