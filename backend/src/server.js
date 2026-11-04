
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Medicare server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
