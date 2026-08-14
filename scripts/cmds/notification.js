const { getStreamsFromAttachment } = global.utils;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "3.0",
    author: "Siam Ahmed Saan ",
    countDown: 100,
    role: 2,
    shortDescription: { en: "Premium notification sender with progress tracking" },
    longDescription: { en: "Send text/media notifications to all groups with real-time progress and anti-ban delay." },
    category: "owner",
    guide: { en: "{pn} <message or reply to media>" },
    envConfig: { delayPerGroup: 600 }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, usersData }) {
    const { delayPerGroup } = envCommands[commandName];
    const { senderID, threadID } = event;
    
    const senderName = await usersData.getName(senderID) || "Admin";
    const now = moment().tz("Asia/Dhaka");
    const timeString = now.format("hh:mm A");
    const dateString = now.format("DD/MM/YYYY");

    const msgText = args.join(" ") || "";
    const attachments = [
      ...(event.attachments || []),
      ...(event.messageReply?.attachments || [])
    ].filter(item => ["photo", "animated_image", "video", "audio", "sticker"].includes(item.type));

    if (!msgText && attachments.length === 0)
      return message.reply("⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗼𝗿 𝗮𝘁𝘁𝗮𝗰𝗵 𝗺𝗲𝗱𝗶𝗮.");

    let streamAttachments = [];
    if (attachments.length > 0) {
      try {
        streamAttachments = await getStreamsFromAttachment(attachments);
      } catch (err) {
        return message.reply("❌ 𝗠𝗲𝗱𝗶𝗮 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗙𝗮𝗶𝗹𝗲𝗱: Check if the file is too large.");
      }
    }

    const owner = "Siam Ahmed Saan ";
    const formSend = {
      body: `╭━━━〔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〕━━━╮\n┃ 𝗢𝗪𝗡𝗘𝗥: ${owner}\n┃ 𝗔𝗗𝗠𝗜𝗡: ${senderName}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n🕒 𝗧𝗶𝗺𝗲: ${timeString} | ${dateString}\n\n📝 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n───────────────────\n${msgText || "(Media Attachment)"}\n───────────────────\n\n📢 `,
      attachment: streamAttachments
    };

    const allThreads = (await threadsData.getAll()).filter(
      t => t.isGroup && t.members.some(m => m.userID == api.getCurrentUserID() && m.inGroup)
    );

    const total = allThreads.length;
    let sent = 0, failed = 0;

    const statusMsg = await message.reply(`🚀 𝗜𝗻𝗶𝘁𝗶𝗮𝘁𝗶𝗻𝗴 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻...\n📊 𝗧𝗮𝗿𝗴𝗲𝘁: ${total} Groups.`);

    for (const thread of allThreads) {
      try {
        await api.sendMessage(formSend, thread.threadID);
        sent++;
      } catch (e) {
        failed++;
        console.error(`Error in ${thread.threadID}:`, e);
      }

      if ((sent + failed) % 5 === 0 || (sent + failed) === total) {
        await api.editMessage(`📡 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻...\n━━━━━━━━━━━━━━━━━━\n✅ 𝗦𝗲𝗻𝘁: ${sent}\n❌ 𝗙𝗮𝗶𝗹𝗲𝗱: ${failed}\n⏳ 𝗣𝗿𝗼𝗴𝗿𝗲𝘀𝘀: ${Math.round(((sent + failed) / total) * 100)}%`, statusMsg.messageID, threadID);
      }

      const finalDelay = attachments.length > 0 ? 1500 : delayPerGroup;
      await new Promise(res => setTimeout(res, finalDelay));
    }

    const finalReport = `✅ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!\n━━━━━━━━━━━━━━━━━━\n🎯 𝗧𝗼𝘁𝗮𝗹 𝗧𝗮𝗿𝗴𝗲𝘁: ${total}\n🟢 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹: ${sent}\n🔴 𝗙𝗮𝗶𝗹𝗲𝗱: ${failed}\n\n✨ 𝗔𝗹𝗹 𝗴𝗿𝗼𝘂𝗽𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝗱.`;
    
    return api.editMessage(finalReport, statusMsg.messageID, threadID);
  }
};
