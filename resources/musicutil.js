exports.canModifyQueue = (member) => {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
        return;
    }

    return true;
};

let config;

try {
    config = require('../settings.json');
}   catch (error) {
    config = null;
}

exports.TOKEN = config ? config.Token : process.env.TOKEN;
exports.PREFIX = config ? config.Prefix : process.env.PREFIX;
exports.YOUTUBE_API_KEY = config ? config.Youtube_Api_Key : process.env.YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config ? config.Soundcloud_Client_ID : process.env.SOUNDCLOUD_CLIENT_ID;
exports.SPOTIFY_API_ID = config ? config.Spotify_Api_ID : process.env.SPOTIFY_API_ID;
exports.SPOTIFY_API_SECRET = config ? config.Spotify_Api_Secret : process.env.SPOTIFY_API_SECRET;
exports.MAX_PLAYLIST_SIZE = 1000
exports.PRUNING = false
exports.STAY_TIME = 5
exports.DEFAULT_VOLUME = 100
exports.LOCALE = "en"