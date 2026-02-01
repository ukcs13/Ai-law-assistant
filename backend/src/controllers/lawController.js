const LawSection = require('../models/LawSection');

exports.searchLaws = async (req, res) => {
  try {
    const { query, act } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Basic text search using MongoDB text index
    let searchCriteria = { $text: { $search: query } };
    
    if (act) {
      searchCriteria.act = act;
    }

    const results = await LawSection.find(searchCriteria, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await LawSection.find().limit(50);
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.seedData = async (req, res) => {
    // Endpoint to populate some initial data for testing
    try {
        const count = await LawSection.countDocuments();
        if (count > 0) return res.json({ message: "Data already exists" });

        const sections = [
            {
                act: "IPC",
                section_number: "378",
                title: "Theft",
                description: "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
                keywords: ["theft", "steal", "property"]
            },
            {
                act: "IPC",
                section_number: "302",
                title: "Punishment for murder",
                description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
                keywords: ["murder", "punishment", "death"]
            },
            {
                act: "IPC",
                section_number: "420",
                title: "Cheating and dishonestly inducing delivery of property",
                description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person...",
                keywords: ["cheating", "fraud", "420"]
            },
            {
                act: "IT Act",
                section_number: "66",
                title: "Computer Related Offences",
                description: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
                keywords: ["computer", "hacking", "fraud"]
            }
        ];

        await LawSection.insertMany(sections);
        res.json({ message: "Seed data inserted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error seeding data" });
    }
}
