// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { canModifyQueue, LOCALE } = require("../../resources/musicutil")
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "pause",
    description : "Pauses Luna",
    cooldown    : 5,
    aliases     : ["pooz"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "pause",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args)  {
        // Load Glossary
        Glossary = Glossary.get("commands");

        let queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.reply(i18n.__("pause.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");


        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel
                .send(i18n.__mf("pause.result", { author: message.author }))
                .catch(console.error)
        }
    }
};