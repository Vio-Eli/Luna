// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { canModifyQueue, LOCALE } = require("../../resources/musicutil")
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "volume",
    description : "Changes Volume",
    cooldown    : 5,
    aliases     : ["v"],
    args        : 1,
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "volume <number 1-100>",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    execute(Glossary, client, message, args) {
        let queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.reply(i18n.__("volume.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member))
            return message.reply(i18n.__("volume.errorNotChannel")).catch(console.error);
        
        if (!args[0]) return message.reply(i18n.__mf("volume.currentVolume", { volume: queue.volume })).catch(console.error);
        if (isNaN(args[0])) return message.reply(i18n.__("volume.errorNotNumber")).catch(console.error);
        if (Number(args[0]) > 100 || Number(args[0]) < 0)
            return message.reply(i18n.__("volume.errorNotValid")).catch(console.error);

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
        return queue.textChannel.send(i18n.__mf("volume.result", { arg: args[0]})).catch(console.error);
    }
};