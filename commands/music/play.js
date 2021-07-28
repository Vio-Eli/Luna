// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { play } = require("../../resources/music_play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default
const spotifyAPI = require("spotify-finder") // SPOTIFY API 4 U!!!
const https = require("https");
const { YOUTUBE_API_KEY, SPOTIFY_API_ID, SPOTIFY_API_SECRET, SOUNDCLOUD_CLIENT_ID, LOCALE, DEFAULT_VOLUME } = require("../../resources/musicutil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const spotify = new spotifyAPI({
    consumer: {
        key: SPOTIFY_API_ID,
        secret: SPOTIFY_API_SECRET
    }
})
const spdl = require("spdl-core")
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "play",
    description: "Joins Luna to VC",
    cooldown: 5,
    aliases: ["p"],
    args: 0,
    guildOnly: true,
    privileges: ["SEND_MESSAGES", "CONNECT", "SPEAK"],
    usage: "play <YouTube URL | Video Name | Soundcloud URL>",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const { channel } = message.member.voice;

        let serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) return message.reply(i18n.__("play.errorNotChannel")).catch(console.error);
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message
                .reply(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user }))
                .catch(console.error);

        let fileclip
        
        if (!args.length)
            if (message.attachments.first()) {
                fileclip = message.attachments.first();
                args[0] = ''
            } else {
            return message
                .reply(i18n.__mf("play.usageReply", { prefix: message.client.prefix }))
                .catch(console.error);
            };

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.reply(i18n.__("play.missingPermissionConnect"));
        if (!permissions.has("SPEAK")) return message.reply(i18n.__("play.missingPermissionSpeak"));

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
        const SpotifyRegex = /^(https:\/\/open.spotify.com\/.*playlist\/|spotify:.*:playlist:)([a-zA-Z0-9]+)(.*)$/gm;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get("playlist").execute(Glossary, client, message, args);
        } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
            return message.client.commands.get("playlist").execute(Glossary, client, message, args);
        } else if (SpotifyRegex.test(url)) {
            return message.client.commands.get("playlist").execute(Glossary, client, message, args);
        }

        if (mobileScRegex.test(url)) {
            try {
                https.get(url, function (res) {
                    if (res.statusCode == "302") {
                        return message.client.commands.get("play").execute(Glossary, client, message, [res.headers.location]);
                    } else {
                        return message.reply("No content could be found at that url.").catch(console.error);
                    }
                });
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
            return message.reply("Following url redirection...").catch(console.error);
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME || 100,
            playing: true
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else if (scRegex.test(url)) {
            try {
                const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
                song = {
                    title: trackInfo.title,
                    url: trackInfo.permalink_url,
                    duration: Math.ceil(trackInfo.duration / 1000)
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else if (spdl.validateURL(url)) {
            try {
                const spotifyInfo = await spdl.getInfo(url, SPOTIFY_API_ID)
                song = {
                    title: spotifyInfo.title,
                    url: spotifyInfo.url,
                    duration: spotifyInfo.duration
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else if (fileclip) {
            console.log(fileclip.url)
            song = {
                title: fileclip.name,
                url: fileclip.url,
                duration: 'TODO'
            };
        } else {
            try {
                const results = await youtube.searchVideos(search, 1, { part: "snippet" });
                // PATCH 1 : avoid cases when there are nothing on the search results.
                if (results.length <= 0) {
                    // No video results.
                    message.reply(i18n.__mf("play.songNotFound")).catch(console.error);
                    return;
                }
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            return serverQueue.textChannel
                .send(i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
                .catch(console.error);
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(i18n.__('play.cantJoinChannel', { error: error })).catch(console.error);
        }
    }
};





