const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  Judulcatatan: {
    type: String,
  },
  catatan: {
    type: String,
    required: true,
  },
  Tanggalcatatan: {
    type: Date,
    default: Date.now,
  },
  statuses: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Template", templateSchema);
