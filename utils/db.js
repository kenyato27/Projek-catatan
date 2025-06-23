const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("❌ Koneksi database gagal:", err);
});

db.once("open", () => {
  console.log("✅ Berhasil terhubung ke MongoDB Atlas!");
});
