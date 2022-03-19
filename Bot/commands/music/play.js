const { play } = require("../../function/musicfunctions");
const ytdl = require("ytdl-core");
const yts = require('yt-search')
const scdl = require("soundcloud-downloader");


const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
  category: "music",
  run: async (client, message, args) => {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!args.length) {
      const embed = new MessageEmbed().setDescription('Sweety, You need to put something so i can play it!').setColor('RED');
      return message.channel.send(embed);
    }

    if (!channel) {
      const embed = new MessageEmbed().setDescription('Aww! Did you forget to join the Voice Channel Sweety?').setColor('RED');
      return message.channel.send(embed);
    }


    if (serverQueue && channel !== message.guild.me.voice.channel) {
      const embed = new MessageEmbed().setDescription('Honey! You need to be in same channel as me').setColor('RED');
      return message.channel.send(embed);
    }




    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has("CONNECT")) {
      const embed = new MessageEmbed().setDescription('Dang it! I don\'t have permission to connect to the channel.').setColor('RED');
      return message.channel.send(embed);
    }

    if (!permissions.has("SPEAK")) {
      const embed = new MessageEmbed().setDescription('Oh no! Sweety! I don\'t have permission to speak in the channel.').setColor('RED');
      return message.channel.send(embed);
    }

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return client.commands.get("playlist").run(client, message, args);
    }
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
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
        return message.reply('Couldn\'t find that video sweety').catch(console.error);
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
        return message.reply('Couldn\'t find that track sweety').catch(console.error);
      }
    } else {
      try {
        const results = await yts(search);



        songInfo = await ytdl.getInfo(results.all[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply('Couldn\'t find that video sweety').catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      const embed = new MessageEmbed().setColor('GREEN').setTitle('✅ Song Added').setDescription(`**${song.title}** has been added to the queue by ${message.author}`)
      return serverQueue.textChannel
        .send(embed)
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
      const embed = new MessageEmbed().setDescription('Something went wrong, I am not able to join the channel.')
      return message.channel.send(embed).catch(console.error);
    }
  }
};
