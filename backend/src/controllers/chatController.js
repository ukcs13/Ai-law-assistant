const ChatHistory = require('../models/ChatHistory');
const LawSection = require('../models/LawSection');
const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    let currentSessionId = sessionId;

    if (!currentSessionId) {
      currentSessionId = Date.now().toString(); // Simple ID generation
    }

    // Retrieve history
    let chatSession = await ChatHistory.findOne({ sessionId: currentSessionId });
    if (!chatSession) {
      chatSession = new ChatHistory({ sessionId: currentSessionId, messages: [] });
    }

    // Add user message
    chatSession.messages.push({ role: 'user', content: message });
    
    // RAG: Search for relevant laws
    let retrievedContext = "";
    try {
      const searchResults = await LawSection.find(
        { $text: { $search: message } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(3);

      if (searchResults.length > 0) {
        retrievedContext = "Relevant Legal Sections & Case Laws:\n";
        searchResults.forEach(doc => {
          retrievedContext += `\n- Act: ${doc.act} Section ${doc.section_number} (${doc.title})\n`;
          retrievedContext += `  Description: ${doc.description}\n`;
          if (doc.relevant_cases && doc.relevant_cases.length > 0) {
            retrievedContext += `  Key Case Laws:\n`;
            doc.relevant_cases.forEach(c => {
               retrievedContext += `    * ${c.title} (${c.citation}): ${c.summary}\n`;
            });
          }
        });
      }
    } catch (err) {
      console.error("RAG Search Error:", err);
      // Continue without context if search fails
    }

    // Get AI response with enriched context
    // Pass last 5 messages for conversation history
    const historyContext = chatSession.messages.slice(-5);
    
    // Construct a system prompt or enriched user prompt
    const enhancedPrompt = retrievedContext 
      ? `Context:\n${retrievedContext}\n\nUser Question: ${message}\n\nInstructions:\n1. Cite the relevant sections provided.\n2. Mention the case laws if applicable.\n3. Provide step-by-step filing procedure.\n4. Suggest a legal strategy.`
      : message;

    const aiResponse = await aiService.generateResponse(enhancedPrompt, historyContext);

    // Add AI message
    chatSession.messages.push({ role: 'assistant', content: aiResponse });
    await chatSession.save();

    res.json({
      sessionId: currentSessionId,
      reply: aiResponse,
      history: chatSession.messages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing chat" });
  }
};

exports.getHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chatSession = await ChatHistory.findOne({ sessionId });
        if (!chatSession) return res.json([]);
        res.json(chatSession.messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
}
