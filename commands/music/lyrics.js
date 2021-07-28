// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const lyricsFinder = require("lyrics-finder");
const { LOCALE } = require("../../resources/musicutil")
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "lyrics",
    description: "Get lyrics for the currently playing song",
    cooldown: 5,
    aliases: ["ly"],
    args: 0,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "lyrics",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(i18n.__("lyrics.errorNotQueue")).catch(console.error);

        let lyrics = null;
        const title = queue.songs[0].title;
        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
        } catch (error) {
            lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
        }

        let lyricsEmbed = new MessageEmbed()
            .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
            .setDescription(lyrics)
            .setColor("#F8AA2A")
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch(console.error);
    }
};