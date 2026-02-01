const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const LawSection = require('../models/LawSection');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-law-assistant');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Read JSON file
    const dataPath = path.join(__dirname, '../data/laws.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing data
    await LawSection.deleteMany();
    console.log('Data Cleared...');

    // Insert new data
    await LawSection.insertMany(jsonData);
    console.log('Data Imported Successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await LawSection.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
