const express = require('express');
const {
  generateSlogans,
  generatePoster,
  chat,
  generateCampaign,
  saveCampaign,
  getHistory,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  regenerateHeadline,
  regenerateAdCopy,
  regenerateCTA,
  regenerateCaption,
  improveText,
  chatWithAi
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate-slogans', protect, generateSlogans);
router.post('/generate-poster', protect, generatePoster);
router.post('/chat', protect, chat);
router.post('/campaign', protect, generateCampaign);
router.post('/campaigns/generate', protect, generateCampaign);
router.post('/save', protect, saveCampaign);
router.get('/history', protect, getHistory);

router.get('/campaigns', protect, getCampaigns);
router.get('/campaigns/:id', protect, getCampaign);
router.put('/campaigns/:id', protect, updateCampaign);
router.delete('/campaigns/:id', protect, deleteCampaign);
router.post('/campaigns/:id/duplicate', protect, duplicateCampaign);
router.post('/campaigns/:id/regenerate/headline', protect, regenerateHeadline);
router.post('/campaigns/:id/regenerate/adcopy', protect, regenerateAdCopy);
router.post('/campaigns/:id/regenerate/cta', protect, regenerateCTA);
router.post('/campaigns/:id/regenerate/caption', protect, regenerateCaption);
router.post('/ai/improve', protect, improveText);
router.post('/ai/chat', protect, chatWithAi);

module.exports = router;
