const mongoose = require('mongoose');

const LawSectionSchema = new mongoose.Schema({
  act: {
    type: String,
    required: true,
    enum: ['IPC', 'IT Act', 'CrPC'],
    index: true
  },
  section_number: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: [String],
  relevant_cases: [{
    title: String,
    citation: String,
    summary: String
  }],
  embedding: [Number] // For future vector search
}, { timestamps: true });

// Text index for search
LawSectionSchema.index({ title: 'text', description: 'text', section_number: 'text' });

module.exports = mongoose.model('LawSection', LawSectionSchema);
