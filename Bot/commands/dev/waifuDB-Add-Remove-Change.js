const Discord = require('discord.js'); const dbfunctions = require('../../function/dbfunctions');
;
const globalFunc = require('../../function/dbfunctions');
const { updateWaifu, addWaifu, removeWaifu } = require('../../function/dbfunctions(2)')

module.exports = {
    name: 'waifudb',
    description: 'waifu db',
    category: 'dev',
    usage: '{"id":<id>,"name":"<name>","anime":"<anime>","image":"<image>","gender":"<gender>","cost":"<cost>"}   [side note all but id can be left blank]',
    args: true,
    run: async (client, message, args) => {
        var data = await globalFunc.bl(message.author.id, `dev`);
        if (data == null) return message.channel.send(`You're not a developer`);
        var text;
        if (args[0] == "+") {
            text = message.content.split("waifudb + ")[1]
        } else if (args[0] == "-") {
            text = message.content.split("waifudb - ")[1]
        } else if (args[0] == "update") {
            text = message.content.split("waifudb update ")[1]
        } else {
            return (message.channel.send("invalid operator \n(has to be +, -, or update)"))
        }

        try {
            var data = JSON.parse(text)
        } catch {
            return message.channel.send("Invalid format")
        }
        var stat;
        if (args[0] == "update") {
            stat = await update(message, data);
            if (stat == 1) return message.channel.send("no id")
            if (stat == 2) return message.channel.send("error updating waifu")
            return
        }
        if (args[0] == "+") {
            stat = await add(message, data);
            if (stat == 1) return message.channel.send("no name")
            if (stat == 2) return message.channel.send("no anime")
            if (stat == 3) return message.channel.send("no gender")
            if (stat == 4) return message.channel.send("no cost")
            if (stat == 5) return message.channel.send("no image")
            return
        }
        if (args[0] == "-") {
            stat = await remove(message, data);
            if (stat == 1) return message.channel.send("no id")
            if (stat == 1) return message.channel.send("unable to remove")
            return
        }

    }
}
async function add(message, data) {
    if (data.name == undefined) { return 1 }
    if (data.anime == undefined) { return 2 }
    if (data.gender == undefined) { return 3 }
    if (data.cost == undefined) { return 4 }
    if (data.image == undefined) { return 5 }
    var stats = await addWaifu(data.name, data.image, data.gender, data.anime, data.cost)
    if (stats == false) return 6
    message.channel.send("waifu added")
    return 0
}
async function remove(message, data) {
    if (data.id == undefined) return 1
    var stats = await removeWaifu(data.id)
    if (stats == false) return 2
    message.channel.send("waifu removed")
    return 0
}
async function update(message, data) {
    if (data.id == undefined) return 1
    if (data.name == undefined) { data.name = null }
    if (data.anime == undefined) { data.anime = null }
    if (data.gender == undefined) { data.gender = null }
    if (data.cost == undefined) { data.cost = null }
    if (data.image == undefined) { data.image = null }
    var stats = await updateWaifu(data.id, data.name, data.image, data.gender, data.anime, data.cost)
    if (stats == false) return 2
    message.channel.send("waifu updated")
    return 0
}