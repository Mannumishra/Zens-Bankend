const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            ssl: true,  // SSL/TLS encryption ka priyog karein agar zaroori ho
            connectTimeoutMS: 10000,  // Connection timeout set karein (10 seconds)
            serverSelectionTimeoutMS: 5000, // Server selection ke liye retry time set karein (5 seconds)
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
    }
};

module.exports = {
    connectDb,
};
