const express = require('express');
const router = express.Router();
const lawController = require('../controllers/lawController');
const chatController = require('../controllers/chatController');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// Law Search Routes
router.get('/laws/search', lawController.searchLaws);
router.get('/laws', lawController.getAllSections);
router.post('/laws/seed', lawController.seedData);

// Chat Routes
router.post('/chat', chatController.sendMessage);
router.get('/chat/:sessionId', chatController.getHistory);

// Document Analysis Route (Inline controller for simplicity for now)
const upload = multer({ dest: 'uploads/' });

router.post('/analyze-doc', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        
        // Clean up file
        fs.unlinkSync(req.file.path);
        
        // In a real app, send text to AI for analysis
        const summary = `Document contains ${data.numpages} pages. Key clauses detected: None in mock mode.`;
        const risks = ["Mock Risk: Termination clause found on page 1."];
        
        res.json({
            text_preview: data.text.substring(0, 500) + "...",
            summary,
            risks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing document" });
    }
});

module.exports = router;
