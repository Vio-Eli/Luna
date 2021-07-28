// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");
const { execute } = require("./search");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "resume",
    description: "Resumes da musik",
    cooldown: 5,
    aliases: ["r"],
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "resume",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(i18n.__("resume.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel
                .send(i18n.__mf("resume.resultNotPlaying", { author: message.author }))
                .catch(console.error);
        }

        return message.reply(i18n.__("resume.errorPlaying")).catch(console.error);
    }
};