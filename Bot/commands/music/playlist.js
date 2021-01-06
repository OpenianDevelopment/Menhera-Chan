const { MessageEmbed } = require("discord.js");
const { play } = require("../../function/musicfunctions");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader");
var { youtube_api, MAX_PLAYLIST_SIZE } = require("../../botconfig.json");
const youtube = new YouTubeAPI(youtube_api);
const globalFunc = require('../../function/dbfunctions');

module.exports = {
  name: "playlist",
  cooldown: 5,
  aliases: ["pl"],
  description: "Play a playlist from youtube",
  category: "music",
  run:async (client, message, args)=>{
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    
    if (!channel){
        const embed = new MessageEmbed().setDescription('Aww! Did you forget to join the Voice Channel Sweety?').setColor('RED');
        return message.channel.send(embed);
    }

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")){
        const embed = new MessageEmbed().setDescription('Dang it! I don\'t have permission to connect to the channel.').setColor('RED');
        return message.channel.send(embed);
    }
     
    if (!permissions.has("SPEAK")){
        const embed = new MessageEmbed().setDescription('Oh no! Sweety! I don\'t have permission to speak in the channel.').setColor('RED');
        return message.channel.send(embed);
    }
    if (serverQueue && channel !== message.guild.me.voice.channel){
        const embed = new MessageEmbed().setDescription('Honey! You need to be in same channel as me').setColor('RED');
        return message.channel.send(embed);
    }
    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data) MAX_PLAYLIST_SIZE = 50;
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply("Playlist not found :(").catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send("⌛ fetching the playlist...");
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data) MAX_PLAYLIST_SIZE = 50;
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    const newSongs = videos.map((video) => {
      return (song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      });
    });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
    const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

    message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);

      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Could not join the channel: ${error.message}`).catch(console.error);
      }
    }
  }
};