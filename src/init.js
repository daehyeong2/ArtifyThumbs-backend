import "dotenv/config";
import "./db.js";
import app from "./server.js";

const PORT = 4000;

function handleListening() {
  console.log(`✅ Server listenting on PORT ${PORT} 🚀`);
}

app.listen(PORT, handleListening);
