module.exports = {
  config: {
    name: "fork",
    version: "3.0",
    author: "Siam Ahmed Saan ",
    countDown: 5,
    role: 0,
    shortDescription: "Show repository info",
    category: "utility",
    guide: {
      en: "{p}fork"
    }
  },

  langs: {
    en: {
      current: `📌 SAAN'S-𝐆𝐎𝐀𝐓-𝐁𝐎𝐓-𝐕𝟑
━━━━━━━━━━━━━━━━━━━━━━━━
👑 Repo Owner : Siam Ahmed Saan 
🔗 Repo       : %1
💎 Status     : always updating
━━━━━━━━━━━━━━━━━━━━━━━━`
    }
  },

  onStart: async function ({ message, getLang }) {
    const link = "https://github.com/goatbotnx/NX-GOAT-BOT-V3";
    return message.reply(getLang("current", link));
  },

  onChat: async function ({ message, getLang, event }) {
    if (event.body && event.body.toLowerCase() === "fork") {
      const link = "https://github.com/goatbotnx/NX-GOAT-BOT-V3";
      return message.reply(getLang("current", link));
    }
  }
};
