module.exports = {
  config: {
    name: "dp",
    version: "1.0",
    author: "xalman",
    countDown: 5,
    role: 0,
    shortDescription: "Get 4 random DPs",
    longDescription: "Get 4 random profile pictures for boys or girls at once.",
    category: "image",
    guide: "{pn} boy or {pn} girl"
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const { threadID, messageID } = event;

    const type = args[0] ? args[0].toLowerCase() : "boy";
    
    if (type !== "boy" && type !== "girl") {
      return api.sendMessage("❌ Please use 'boy' or 'girl'. Example: /dp boy", threadID, messageID);
    }

    api.sendMessage(`📸 Fetching 4 random ${type} DPs... Please wait.`, threadID, messageID);

    try {
      const attachments = [];

      for (let i = 0; i < 4; i++) {
        const res = await axios.get(`https://nx-dp-api-poaz.onrender.com/dp/${type}`);
        const imageUrl = res.data.url;

        const stream = await global.utils.getStreamFromURL(imageUrl);
        attachments.push(stream);
      }

      const form = {
        body: `✅ 4 Random ${type.toUpperCase()} DPs\n👤 Author: xalman`,
        attachment: attachments
      };

      return api.sendMessage(form, threadID, messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred! Maybe the API is down or slow.", threadID, messageID);
    }
  }
};
