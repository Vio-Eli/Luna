const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "skipto",
    description: "Skip to the selected queue number",
    cooldown: 5,
    aliases: ["st"],
    args: 1,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "skipto <Num of Song in Queue>",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        if (!args.length || isNaN(args[0]))
            return message
                .reply(i18n.__mf("skipto.usageReply", { prefix: message.client.prefix, name: module.exports.name }))
                .catch(console.error);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(i18n.__("skipto.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
        if (args[0] > queue.songs.length)
            return message
                .reply(i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }))
                .catch(console.error);

        queue.playing = true;

        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }

        queue.connection.dispatcher.end();
        queue.textChannel
            .send(i18n.__mf("skipto.result", { author: message.author, arg: args[0] - 1 }))
            .catch(console.error);
    }
};