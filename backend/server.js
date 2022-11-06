const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database.js");

//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to  Uncaught Exception`);
  process.exit(1);
});

// config
dotenv.config({ path: "backend/config/config.env" });

//conecting to the databse
connectDatabase();

PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`server started 🔥 on PORT No :${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to  Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
