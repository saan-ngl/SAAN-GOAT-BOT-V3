const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "owner",
    aliases: ["admininfo", "info", "ownerinfo"],
    version: "3.0",
    author: "Siam Ahmed Saan ",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show owner information" },
    category: "owner",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, message }) {

    const ownerName = "Siam Ahmed Saan ";
    const ownerAge = "23";
    const fbName = "𝗦𝗮𝗮𝗻 𝗘𝘅𝗵𝗮𝘂𝘀𝘁𝗲𝗱";
    const messenger = "https://www.facebook.com/siam.ahmed.491801";
    const whatsapp = "stfu";
    const telegram = "@Saan's-Supremacy";
    const address = "Gulshan Rd 133, Dhaka, Bangladesh";
    const religion = "Islam";
    const apiServer = "https://saan-apis.vercel.app";
    const relationship = "In a relationship with Mahuya Adhikari";
    const videoLink = "https://files.catbox.moe/vd43nx.mp4";
    const timeBD = moment().tz("Asia/Dhaka");
    
    const infoMsg = 
`『 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 』
━━━━━━━━━━━━━━━━━━━━━

👤 𝗔𝗕𝗢𝗨𝗧 𝗠𝗘:
● Name: ${ownerName}
● Age: ${ownerAge}
● Relationship: ${relationship}
● Religion: ${religion}
● Address: ${address}

📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:
● Facebook: ${fbName}
● Fb Link: ${messenger}
● WhatsApp: ${whatsapp}
● Telegram: ${telegram}
● API Server: ${apiServer}

⏰ 𝗗𝗔𝗧𝗘 & 𝗧𝗜𝗠𝗘 (𝗕𝗗):
● ${timeBD.format("DD MMMM, YYYY")}
● ${timeBD.format("hh:mm:ss A")}
━━━━━━━━━━━━━━━━━━━━━`;

    try {
      return message.reply({
        body: infoMsg,
        attachment: await global.utils.getStreamFromURL(videoLink)
      });
    } catch (e) {
      return message.reply(infoMsg);
    }
  },

  onChat: async function ({ event, message }) {
    if (event.body?.toLowerCase() === "info") {
      return this.onStart({ message, event });
    }
  }
};
