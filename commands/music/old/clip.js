const { PREFIX, LOCALE } = require("../../../resources/musicutil");
const i18n = require("i18n");
const fs = require('fs')

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "clip",
    description: "Plays a Clip",
    cooldown: 5,
    aliases: ["cl"],
    args: 0,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "clip <Attach Clip as File>",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const { channel } = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);

        //if (!args.length) return message.reply(i18n.__("clip.usagesReply")).catch(console.error);
        if (queue) return message.reply(i18n.__("clip.errorQueue"));
        if (!channel) return message.reply(i18n.__("clip.errorNotChannel")).catch(console.error);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        message.client.queue.set(message.guild.id, queueConstruct);

        let clip = message.attachments.first().url;

        console.log(clip)

        try {
            queueConstruct.connection = await channel.join();
            const dispatcher = queueConstruct.connection
                .play(clip)
                .on("finish", () => {
                    message.client.queue.delete(message.guild.id);
                    channel.leave();
                })
                .on("error", err => {
                    message.client.queue.delete(message.guild.id);
                    channel.leave();
                    console.error(err);
                });
        } catch (error) {
            console.error(error);
        }
    }
};