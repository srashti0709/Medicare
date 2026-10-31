const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);


dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Medicare server running on port ${PORT}`);
});