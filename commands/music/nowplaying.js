// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const { splitBar } = require("string-progressbar");
const { LOCALE } = require("../../resources/musicutil")
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "nowplaying",
    description: "Show now playing song",
    cooldown: 5,
    aliases: ["np"],
    args: 0,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "nowplaying",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(i18n.__("nowplaying.errorNotQueue")).catch(console.error);

        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;

        let nowPlaying = new MessageEmbed()
            .setTitle(i18n.__("nowplaying.embedTitle"))
            .setDescription(`${song.title}\n${song.url}`)
            .setColor("#F8AA2A")
            .setAuthor(message.client.user.username);

        if (song.duration > 0) {
            nowPlaying.addField(
                "\u200b",
                new Date(seek * 1000).toISOString().substr(11, 8) +
                "[" +
                splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "]" +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
                false
            );
            nowPlaying.setFooter(
                i18n.__mf("nowplaying.timeRemaining", { time: new Date(left * 1000).toISOString().substr(11, 8) })
            );
        }

        return message.channel.send(nowPlaying);
    }
};
