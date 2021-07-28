const { canModifyQueue, LOCALE } = require("../../resources/musicutil");
const i18n = require("i18n");
i18n.setLocale(LOCALE);

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "remove",
    description: "Remove song from the queue",
    cooldown: 5,
    aliases: ["rm"],
    args: 1,
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "remove <Queue Number>",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.channel.send(i18n.__("remove.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
        if (!args.length) return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));

        const arguments = args.join("");
        const songs = arguments.split(",").map((arg) => parseInt(arg));
        let removed = [];

        if (pattern.test(arguments)) {
            queue.songs = queue.songs.filter((item, index) => {
                if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
                else return true;
            });

            queue.textChannel.send(
                i18n.__mf("remove.result", {
                    title: removed.map((song) => song.title).join("\n"),
                    author: message.author.id
                })
            );
        } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
            console.log("we got elsed!");
            return queue.textChannel.send(
                i18n.__mf("remove.result", {
                    title: queue.songs.splice(args[0] - 1, 1)[0].title,
                    author: message.author.id
                })
            );
        } else {
            console.log("we got the last one");
            return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));
        }
    }
};