// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");
const { execute } = require("./search");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "stop",
    description: "Stops Music",
    cooldown: 5,
    aliases: ["st"],
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "stop",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);
    }
};