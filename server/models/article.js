const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Graphql', 'Rest API']
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Article', ArticleSchema)