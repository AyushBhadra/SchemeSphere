const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHindi: { type: String },
  department: { type: String },
  category: {
    type: String,
    enum: ['Education', 'Healthcare', 'Agriculture', 'Financial', 'Housing'],
    required: true,
  },
  description: { type: String },
  descriptionHindi: { type: String },
  benefits: { type: String },
  benefitsHindi: { type: String },
  applicationUrl: { type: String },
  deadline: { type: Date },
  criteria: {
    minAge: { type: Number },
    maxAge: { type: Number },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    maxAnnualIncome: { type: Number },
    targetOccupations: [{ type: String }],
    state: { type: String, default: 'All-India' },
    casteCategories: [{ type: String }],
  },
  requiredDocuments: [{ type: String }],
});

module.exports = mongoose.model('Scheme', schemeSchema);
