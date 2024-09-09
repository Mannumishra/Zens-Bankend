require('dotenv').config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const { connectDb } = require("./config/Database");
const categoryRouter = require("./routes/categoryRouter");
const productCategoryRouter = require('./routes/productCategoryRoutes');
const productRouter = require('./routes/productRouter');
const bannerRouter = require('./routes/bannerRouter');
const checkoutRouter = require('./routes/checkoutRouter');
const userRouter = require('./routes/userRouter');
const Contactrouter = require('./routes/contactRoutes');

const app = express();

// Use compression to reduce response size
app.use(compression());

// Use helmet for securing HTTP headers
app.use(helmet());

// Implement rate limiting for API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// Configure CORS with a specific origin (adjust as needed)
// app.use(cors({
//     origin: 'http://localhost:3000'
// }));

app.use(cors())
app.use(express.json());
app.set(express.static("uploads"))
app.use("/api", categoryRouter);
app.use("/api", productCategoryRouter);
app.use("/api", productRouter);
app.use("/api", bannerRouter);
app.use("/api", checkoutRouter);
app.use("/api", userRouter);
app.use("/api", Contactrouter);

// Connect to the database
connectDb();

// Start the server
app.listen(8000, () => {
    console.log("Server is running at 8000 Port");
});
