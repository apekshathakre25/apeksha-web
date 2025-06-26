const mongoose = require('mongoose');

const GithubModel = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repo: { type: String, required: true },
  date: { type: Date, required: true },
  commits: { type: Number, default: 0 },
  linesAdded: { type: Number, default: 0 },
  
  linesDeleted: { type: Number, default: 0 }
}, { collection: 'githubs' });

module.exports = mongoose.model('GithubModel', GithubModel);
