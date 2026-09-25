const { GoogleGenAI } = require('@google/genai');
const Campaign = require('../models/Campaign');
const Chat = require('../models/Chat');

const initGemini = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is missing or invalid');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const parseJsonResponse = (responseText) => {
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch (error) {
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch (secondError) {
      return null;
    }
  }
};

const normalizeText = (value, fallback = '') => {
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const flattened = value.flatMap(item => (Array.isArray(item) ? item : [item]));
    const firstValid = flattened.find(item => item !== null && item !== undefined && item !== '');
    if (!firstValid) return fallback;
    return normalizeText(firstValid, fallback);
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, item]) => item !== null && item !== undefined && item !== '');
    if (!entries.length) return fallback;
    return entries.map(([key, item]) => `${key}: ${normalizeText(item, '')}`).join(' • ') || fallback;
  }
  return fallback;
};

const normalizeStringArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    const items = value.flatMap((item) => {
      if (Array.isArray(item)) return item;
      return [item];
    }).map((item) => normalizeText(item, '')).filter(Boolean);
    return items.length ? items : fallback;
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (value && typeof value === 'object') {
    const normalized = normalizeText(value, '');
    return normalized ? [normalized] : fallback;
  }

  return fallback;
};

const sanitizeCampaignResult = (details = {}, result = {}) => {
  const fallback = fallbackCampaign(details);

  return {
    ...fallback,
    ...result,
    campaignName: normalizeText(result.campaignName || details.campaignName || details.productName, fallback.campaignName),
    productName: normalizeText(result.productName || details.productName, fallback.productName),
    businessDescription: normalizeText(result.businessDescription || details.businessDescription, fallback.businessDescription),
    industry: normalizeText(result.industry || details.industry, fallback.industry),
    objective: normalizeText(result.objective || details.objective, fallback.objective),
    targetAudience: normalizeText(result.targetAudience || details.targetAudience, fallback.targetAudience),
    location: normalizeText(result.location || details.location, fallback.location),
    platforms: Array.isArray(result.platforms) && result.platforms.length ? result.platforms.map(item => normalizeText(item, '')).filter(Boolean) : fallback.platforms,
    budget: normalizeText(result.budget || details.budget, fallback.budget),
    duration: normalizeText(result.duration || details.duration, fallback.duration),
    tone: normalizeText(result.tone || details.tone, fallback.tone),
    campaignStrategy: normalizeText(result.campaignStrategy, fallback.campaignStrategy),
    usp: normalizeText(result.usp, fallback.usp),
    headlines: normalizeStringArray(result.headlines, fallback.headlines),
    descriptions: normalizeStringArray(result.descriptions, fallback.descriptions),
    adCopies: normalizeStringArray(result.adCopies, fallback.adCopies),
    ctas: normalizeStringArray(result.ctas, fallback.ctas),
    hashtags: normalizeStringArray(result.hashtags, fallback.hashtags),
    keywords: normalizeStringArray(result.keywords, fallback.keywords),
    creativeSuggestions: normalizeStringArray(result.creativeSuggestions, fallback.creativeSuggestions),
    analytics: (result.analytics && typeof result.analytics === 'object') ? result.analytics : fallback.analytics,
    captions: result.captions || fallback.captions || {}
  };
};

const fallbackCampaign = (details = {}) => ({
  campaignName: details.campaignName || details.productName || 'AI Campaign',
  productName: details.productName || 'Your Product',
  businessDescription: details.businessDescription || 'A modern product ready for growth.',
  industry: details.industry || 'General',
  objective: details.objective || 'Brand Awareness',
  targetAudience: details.targetAudience || 'Modern consumers',
  location: details.location || 'Global',
  platforms: Array.isArray(details.platforms) ? details.platforms : ['Instagram'],
  budget: details.budget || '$500',
  duration: details.duration || '30 days',
  tone: details.tone || 'Professional',
  campaignStrategy: 'Focus on audience pain points, clear value proposition, platform-native messaging, and a strong CTA.',
  usp: 'A differentiated product experience designed to stand out in a crowded market.',
  headlines: ['Build smarter campaigns with AI', 'Turn attention into action', 'Grow faster with confidence'],
  descriptions: ['Value-driven messaging crafted for conversion and brand recall.', 'Clear positioning designed for today’s digital audience.', 'Persuasive copy tuned to the selected platform and objective.'],
  adCopies: ['Launch a campaign that speaks directly to your customer’s goals and motivations.', 'Create momentum with focused messaging and consistent brand storytelling.', 'Use clear benefits and an unmistakable call to action to drive action.'],
  ctas: ['Learn More', 'Get Started', 'Shop Now'],
  captions: {
    instagram: {
      hook: 'Big ideas deserve bold execution.',
      caption: 'Ready to grow smarter? Discover a better way to market your brand with AI-driven strategy.',
      cta: 'Learn More',
      hashtags: ['#AI', '#Marketing', '#Growth']
    },
    facebook: {
      primaryText: 'Turn your next campaign into a growth engine with smarter creative and stronger messaging.',
      headline: 'Smarter marketing starts here',
      description: 'Engineered to deliver clarity, traction, and conversion.',
      cta: 'Get Started'
    },
    googleAds: {
      headlines: ['Smarter Advertising', 'Boost Growth', 'Stronger Campaigns'],
      descriptions: ['Target the right audience with compelling, data-informed messaging.', 'Improve reach and conversion with AI-powered strategy.'],
      cta: 'Get Started'
    },
    youtube: {
      title: 'How to build a stronger campaign that converts',
      hook: 'If you want sharper marketing, start here.',
      description: 'A quick walkthrough on how AI can improve strategy, creative, and conversion.',
      cta: 'Watch Now'
    },
    linkedin: {
      headline: 'Marketing that connects strategy to growth',
      post: 'Great campaigns start with clarity, audience insight, and disciplined creative execution.',
      cta: 'Read More'
    }
  },
  keywords: ['marketing', 'growth', 'AI', 'campaign strategy', 'audience targeting'],
  hashtags: ['#AI', '#Marketing', '#BrandGrowth', '#CampaignStrategy'],
  creativeSuggestions: ['Use a clean studio backdrop with product close-ups.', 'Show the product in a real-world use case with dynamic motion.', 'Highlight transformation and measurable outcomes with minimal, premium styling.'],
  analytics: {
    clarity: 90,
    audienceRelevance: 88,
    ctaStrength: 86,
    engagementPotential: 91,
    brandAlignment: 89,
    note: 'AI-generated estimates, not guaranteed advertising performance.'
  },
  aiGenerated: true
});

exports.generateSlogans = async (req, res) => {
  try {
    const { productName, tone, audience } = req.body;
    const ai = initGemini();
    const prompt = `Generate 10 catchy slogans for a product named "${productName}". The tone should be ${tone} and target audience is ${audience}. Return only valid JSON with the key "slogans" and an array of strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const result = parseJsonResponse(response.text) || { slogans: [
      `${productName} made for momentum`,
      `Smarter choices start with ${productName}`,
      `${productName}: built for better results`
    ] };

    res.status(200).json(result);
  } catch (error) {
    console.error('Slogan generation fallback activated:', error.message);
    const fallback = {
      slogans: [
        `${req.body.productName || 'Your product'} made for momentum`,
        `Smarter choices start with ${req.body.productName || 'your product'}`,
        `${req.body.productName || 'Your product'}: built for better results`
      ],
      note: 'Gemini is temporarily unavailable. These slogan options are generated fallback ideas.'
    };
    res.status(200).json(fallback);
  }
};

exports.generatePoster = async (req, res) => {
  try {
    const { brandName, productName, industry, targetAudience, colorTheme, posterStyle, campaignGoal } = req.body;
    const ai = initGemini();

    const prompt = `You are an expert marketing designer. Create the text and layout prompt for a poster. Brand: ${brandName} Product: ${productName} Industry: ${industry} Target Audience: ${targetAudience} Color Theme: ${colorTheme} Style: ${posterStyle} Goal: ${campaignGoal}. Return only valid JSON with headline, subheadline, cta, and visualPrompt.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const result = parseJsonResponse(response.text) || {
      headline: `${productName} Moves Faster`,
      subheadline: 'Build attention, trust, and traction with a clearer marketing message.',
      cta: 'Get Started',
      visualPrompt: 'Minimal premium product shot, bright modern colors, bold headline overlay, clean lifestyle background.'
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Poster generation fallback activated:', error.message);
    const fallback = {
      headline: `${req.body.productName || 'Your Product'} Moves Faster`,
      subheadline: 'Build attention, trust, and traction with a clearer marketing message.',
      cta: 'Get Started',
      visualPrompt: 'Minimal premium product shot, bright modern colors, bold headline overlay, clean lifestyle background.',
      note: 'Gemini is temporarily unavailable. This is a fallback poster concept.'
    };
    res.status(200).json(fallback);
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user.id;
    const ai = initGemini();

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ message: 'Chat not found' });
    } else {
      chat = new Chat({ userId, messages: [] });
    }

    let fullPrompt = 'You are a world-class AI marketing strategist. Give actionable modern marketing advice. Keep responses concise and formatting clean.\n\n';
    if (chat.messages.length > 0) {
      fullPrompt += 'Previous conversation:\n';
      chat.messages.slice(-5).forEach((m) => {
        fullPrompt += `${m.role === 'user' ? 'User' : 'You'}: ${m.content}\n`;
      });
      fullPrompt += '\nNew Message from User:\n';
    }
    fullPrompt += message;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    const responseText = response.text || 'I can help with that strategy.';

    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'model', content: responseText });
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(200).json({ reply: responseText, chatId: chat._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in chat', error: error.message });
  }
};

exports.generateCampaign = async (req, res) => {
  try {
    const details = req.body || {};
    const ai = initGemini();

    const prompt = `You are an expert digital advertising strategist. Create a complete advertising campaign based on the user's business information. Generate a structured JSON object with: campaignName, productName, businessDescription, industry, objective, targetAudience, location, platforms, budget, duration, tone, campaignStrategy, usp, headlines, descriptions, adCopies, ctas, captions, keywords, hashtags, creativeSuggestions, analytics. Return ONLY valid JSON. User details: ${JSON.stringify(details, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const result = parseJsonResponse(response.text) || fallbackCampaign(details);
    const finalResult = sanitizeCampaignResult(details, result);

    const campaign = new Campaign({
      userId: req.user.id,
      type: 'campaign',
      title: finalResult.campaignName || 'Generated Campaign',
      campaignName: finalResult.campaignName,
      productName: finalResult.productName,
      businessDescription: finalResult.businessDescription,
      industry: finalResult.industry,
      objective: finalResult.objective,
      targetAudience: finalResult.targetAudience,
      location: finalResult.location,
      platforms: Array.isArray(finalResult.platforms) ? finalResult.platforms : [],
      budget: finalResult.budget,
      duration: finalResult.duration,
      tone: finalResult.tone,
      campaignStrategy: finalResult.campaignStrategy,
      usp: finalResult.usp,
      headlines: Array.isArray(finalResult.headlines) ? finalResult.headlines : [],
      descriptions: Array.isArray(finalResult.descriptions) ? finalResult.descriptions : [],
      adCopies: Array.isArray(finalResult.adCopies) ? finalResult.adCopies : [],
      ctas: Array.isArray(finalResult.ctas) ? finalResult.ctas : [],
      hashtags: Array.isArray(finalResult.hashtags) ? finalResult.hashtags : [],
      keywords: Array.isArray(finalResult.keywords) ? finalResult.keywords : [],
      creativeSuggestions: Array.isArray(finalResult.creativeSuggestions) ? finalResult.creativeSuggestions : [],
      analytics: finalResult.analytics || {},
      content: finalResult
    });

    await campaign.save();
    res.status(200).json({ ...finalResult, campaignId: campaign._id });
  } catch (error) {
    console.error('Campaign generation fallback activated:', error.message);
    const fallback = fallbackCampaign(details);
    const campaign = new Campaign({
      userId: req.user.id,
      type: 'campaign',
      title: fallback.campaignName || 'Generated Campaign',
      campaignName: fallback.campaignName,
      productName: fallback.productName,
      businessDescription: fallback.businessDescription,
      industry: fallback.industry,
      objective: fallback.objective,
      targetAudience: fallback.targetAudience,
      location: fallback.location,
      platforms: Array.isArray(fallback.platforms) ? fallback.platforms : [],
      budget: fallback.budget,
      duration: fallback.duration,
      tone: fallback.tone,
      campaignStrategy: fallback.campaignStrategy,
      usp: fallback.usp,
      headlines: Array.isArray(fallback.headlines) ? fallback.headlines : [],
      descriptions: Array.isArray(fallback.descriptions) ? fallback.descriptions : [],
      adCopies: Array.isArray(fallback.adCopies) ? fallback.adCopies : [],
      ctas: Array.isArray(fallback.ctas) ? fallback.ctas : [],
      hashtags: Array.isArray(fallback.hashtags) ? fallback.hashtags : [],
      keywords: Array.isArray(fallback.keywords) ? fallback.keywords : [],
      creativeSuggestions: Array.isArray(fallback.creativeSuggestions) ? fallback.creativeSuggestions : [],
      analytics: fallback.analytics || {},
      content: fallback
    });

    await campaign.save();
    res.status(200).json({ ...fallback, campaignId: campaign._id, warning: 'Gemini is temporarily unavailable; fallback campaign content was generated instead.' });
  }
};

exports.saveCampaign = async (req, res) => {
  try {
    const { type, title, content } = req.body;
    const campaign = new Campaign({
      userId: req.user.id,
      type: type || 'campaign',
      title: title || 'Saved Campaign',
      content: content || {},
      campaignName: content?.campaignName || title || 'Saved Campaign',
      productName: content?.productName,
      campaignStrategy: content?.campaignStrategy,
      headlines: content?.headlines || [],
      ctas: content?.ctas || [],
      hashtags: content?.hashtags || [],
      analytics: content?.analytics || {}
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving campaign', error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 }).select('-messages');
    res.status(200).json({ campaigns, chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    Object.assign(campaign, req.body);
    campaign.updatedAt = Date.now();
    await campaign.save();
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign', error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign', error: error.message });
  }
};

exports.duplicateCampaign = async (req, res) => {
  try {
    const original = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!original) return res.status(404).json({ message: 'Campaign not found' });

    const duplicated = new Campaign({
      ...original.toObject(),
      _id: undefined,
      title: `${original.title || 'Campaign'} Copy`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await duplicated.save();
    res.status(201).json(duplicated);
  } catch (error) {
    res.status(500).json({ message: 'Error duplicating campaign', error: error.message });
  }
};

const generateRegeneratedSection = async (section, text, context) => {
  const ai = initGemini();
  const prompt = `You are a digital advertising strategist. Improve the following ${section}. Provide only valid JSON with a single key named "${section}" and a string value. Context: ${JSON.stringify(context)}. Current content: ${text}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  const parsed = parseJsonResponse(response.text);
  if (parsed && parsed[section]) return parsed[section];

  return text;
};

exports.regenerateHeadline = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const updatedHeadline = await generateRegeneratedSection('headline', campaign.headlines?.[0] || 'Build smarter campaigns', { productName: campaign.productName, objective: campaign.objective });
    campaign.headlines = [updatedHeadline, ...(campaign.headlines || []).slice(1)];
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ headline: updatedHeadline, campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating headline', error: error.message });
  }
};

exports.regenerateAdCopy = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const updatedCopy = await generateRegeneratedSection('adCopy', campaign.adCopies?.[0] || 'Deliver better results with a smarter advertising strategy.', { productName: campaign.productName, objective: campaign.objective });
    campaign.adCopies = [updatedCopy, ...(campaign.adCopies || []).slice(1)];
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ adCopy: updatedCopy, campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating ad copy', error: error.message });
  }
};

exports.regenerateCTA = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const updatedCta = await generateRegeneratedSection('cta', campaign.ctas?.[0] || 'Get Started', { productName: campaign.productName, objective: campaign.objective });
    campaign.ctas = [updatedCta, ...(campaign.ctas || []).slice(1)];
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ cta: updatedCta, campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating CTA', error: error.message });
  }
};

exports.regenerateCaption = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const updatedCaption = await generateRegeneratedSection('caption', campaign.content?.captions?.instagram?.caption || 'Your next campaign deserves smarter storytelling.', { productName: campaign.productName });
    if (campaign.content?.captions?.instagram) {
      campaign.content.captions.instagram.caption = updatedCaption;
    }
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ caption: updatedCaption, campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating caption', error: error.message });
  }
};

exports.improveText = async (req, res) => {
  try {
    const { text, instruction } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const ai = initGemini();
    const prompt = `You are a performance marketing copy editor. Improve the text based on the instruction. Keep the meaning, but make it more persuasive. Instruction: ${instruction || 'Make it more persuasive'}. Original text: ${text}. Return only valid JSON with a single key named "improvedText".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseJsonResponse(response.text);
    const improvedText = parsed?.improvedText || text;

    res.status(200).json({ improvedText, original: text });
  } catch (error) {
    res.status(500).json({ message: 'Error improving text', error: error.message });
  }
};

exports.chatWithAi = async (req, res) => {
  try {
    const { message, campaignId } = req.body;
    const ai = initGemini();

    let context = 'You are a marketing strategy assistant.';
    if (campaignId) {
      const campaign = await Campaign.findOne({ _id: campaignId, userId: req.user.id });
      if (campaign) {
        context = `Current campaign: ${campaign.productName || 'Unknown product'} | Objective: ${campaign.objective || 'Not specified'} | Platforms: ${(campaign.platforms || []).join(', ') || 'General'}`;
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${context}\n\nUser request: ${message}`
    });

    res.status(200).json({ reply: response.text || 'I can help refine your campaign idea.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with AI assistant', error: error.message });
  }
};
