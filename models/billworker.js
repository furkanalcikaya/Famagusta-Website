// models/bills.js dosyası
const mongoose = require('mongoose');

const billsSchema = new mongoose.Schema({
  
  bill_id: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  }
});
const Bills = mongoose.model('Bills', billsSchema);

module.exports = Bills;