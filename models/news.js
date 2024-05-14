// models/news.js dosyası
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['road', 'announcements', 'events']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});
const News = mongoose.model('News', newsSchema);

module.exports = News;