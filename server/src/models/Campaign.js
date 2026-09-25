const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'campaign' },
  title: { type: String, required: true },
  campaignName: { type: String },
  productName: { type: String },
  businessDescription: { type: String },
  industry: { type: String },
  objective: { type: String },
  targetAudience: { type: String },
  location: { type: String },
  platforms: [{ type: String }],
  budget: { type: String },
  duration: { type: String },
  tone: { type: String },
  campaignStrategy: { type: String },
  usp: { type: String },
  headlines: [{ type: String }],
  descriptions: [{ type: String }],
  adCopies: [{ type: String }],
  ctas: [{ type: String }],
  hashtags: [{ type: String }],
  keywords: [{ type: String }],
  creativeSuggestions: [{ type: String }],
  analytics: { type: mongoose.Schema.Types.Mixed, default: {} },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
