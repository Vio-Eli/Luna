// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");
const { execute } = require("./search");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "loop",
    description: "Loops song/queue",
    cooldown: 5,
    aliases: ["l"],
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "loop",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(i18n.__("loop.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

        // toggle from false to true and reverse
        queue.loop = !queue.loop;
        return queue.textChannel
            .send(i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }))
            .catch(console.error);
    }
};