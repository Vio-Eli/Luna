const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "shuffle",
    description: "Shuffle Queue",
    cooldown: 5,
    aliases: ["sh"],
    args: 0,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "shuffle",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(i18n.__("shuffle.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(i18n.__mf('shuffle.result', { author: message.author })).catch(console.error);
    }
};