const ytdlDiscord = require("ytdl-core");
const scdl = require("soundcloud-downloader");
const { PRUNING, STAY_TIME } = require("../botconfig.json");
const { canModifyQueue } = require("../modules/queue");
const { MessageEmbed } = require("discord.js");
const spdl = require("spdl-core");
module.exports = {
	async play(song, message) {
		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			setTimeout(function () {
				if (queue.connection.dispatcher && message.guild.me.voice.channel)
					return;
				queue.channel.leave();
				queue.textChannel.send("Left the voice channel!");
			}, STAY_TIME * 1000);
			queue.textChannel.send("❌ The queue ended.");
			return message.client.queue.delete(message.guild.id);
		}

		let stream = null;
		let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

		// if (song.url.includes("youtube.com")) {
		// 	stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
		// }
		// } else if (song.type === "sp") {
		// 	stream = await spdl(song.url);
		// }
		if (song.type === "yt") {
			stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
		} else if (song.type === "sp") {
			stream = await spdl(song.url);
			console.log(stream);
		}

		queue.connection.on("disconnect", () =>
			message.client.queue.delete(message.guild.id)
		);

		const dispatcher = queue.connection
			.play(stream)
			.on("finish", () => {
				if (collector && !collector.ended) collector.stop();

				if (queue.loop) {
					// if loop is on, push the song back at the end of the queue
					// so it can repeat endlessly
					let lastSong = queue.songs.shift();
					queue.songs.push(lastSong);
					module.exports.play(queue.songs[0], message);
				} else {
					// Recursively play the next song
					queue.songs.shift();
					module.exports.play(queue.songs[0], message);
				}
			})
			.on("error", (err) => {
				console.error(err);
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			});
		dispatcher.setVolumeLogarithmic(queue.volume / 100);

		try {
			const playing = new MessageEmbed()
				.setTitle(`🎶 Started playing: **${song.title}**`)
				.addField(
					"Song URL",
					`[URL](${song.url})`
				) /*.addField('Song Duration',`${song.duration}`)*/
				.setColor("GREEN");
			var playingMessage = await queue.textChannel.send(playing);
			await playingMessage.react("⏭");
			await playingMessage.react("⏯");
			await playingMessage.react("🔇");
			await playingMessage.react("🔉");
			await playingMessage.react("🔊");
			await playingMessage.react("🔁");
			await playingMessage.react("⏹");
		} catch (error) {
			return;
		}

		const filter = (reaction, user) => user.id !== message.client.user.id;
		var collector = playingMessage.createReactionCollector(filter, {
			time: song.duration > 0 ? song.duration * 1000 : 600000,
		});

		collector.on("collect", (reaction, user) => {
			if (!queue) return;
			const member = message.guild.member(user);

			switch (reaction.emoji.name) {
				case "⏭":
					queue.playing = true;
					reaction.users.remove(user);
					if (!canModifyQueue(member)) return;
					queue.connection.dispatcher.end();
					const skipped = new MessageEmbed()
						.setDescription(`${user} ⏩ skipped the song.`)
						.setColor("GREEN");
					queue.textChannel.send(skipped);
					collector.stop();
					break;

				case "⏯":
					reaction.users.remove(user);
					if (!canModifyQueue(member)) return;
					if (queue.playing) {
						queue.playing = !queue.playing;
						queue.connection.dispatcher.pause(true);
						const paused = new MessageEmbed()
							.setDescription(`${user} ⏸ paused the music.`)
							.setColor("RED");
						queue.textChannel.send(paused);
					} else {
						queue.playing = !queue.playing;
						queue.connection.dispatcher.resume();
						const resumed = new MessageEmbed()
							.setDescription(`${user} ▶ resumed the music!`)
							.setColor("GREEN");
						queue.textChannel.send(resumed);
					}
					break;

				case "🔇":
					reaction.users.remove(user);
					if (!canModifyQueue(member)) return;
					if (queue.volume <= 0) {
						queue.volume = 100;
						queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
						const unmuted = new MessageEmbed()
							.setDescription(`${user} 🔊 unmuted the music!`)
							.setColor("GREEN");
						queue.textChannel.send(unmuted);
					} else {
						queue.volume = 0;
						queue.connection.dispatcher.setVolumeLogarithmic(0);
						const muted = new MessageEmbed()
							.setDescription(`${user} 🔇 muted the music!`)
							.setColor("RED");
						queue.textChannel.send(muted);
					}
					break;

				case "🔉":
					reaction.users.remove(user);
					if (!canModifyQueue(member) || queue.volume == 0) return;
					if (queue.volume - 10 <= 0) queue.volume = 0;
					else queue.volume = queue.volume - 10;
					queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
					const decreasedVolume = new MessageEmbed()
						.setDescription(
							`${user} 🔉 decreased the volume, the volume is now ${queue.volume}%`
						)
						.setColor("GREEN");
					queue.textChannel.send(decreasedVolume);
					break;

				case "🔊":
					reaction.users.remove(user);
					if (!canModifyQueue(member) || queue.volume == 100) return;
					if (queue.volume + 10 >= 100) queue.volume = 100;
					else queue.volume = queue.volume + 10;
					queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
					const increasedVolume = new MessageEmbed()
						.setDescription(
							`${user} 🔊 increased the volume, the volume is now ${queue.volume}%`
						)
						.setColor("GREEN");
					queue.textChannel.send(increasedVolume);
					break;

				case "🔁":
					reaction.users.remove(user);
					if (!canModifyQueue(member)) return;
					queue.loop = !queue.loop;
					const loop = new MessageEmbed()
						.setDescription(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
						.setColor("GREEN");
					queue.textChannel.send(loop);
					break;

				case "⏹":
					reaction.users.remove(user);
					if (!canModifyQueue(member)) return;
					queue.songs = [];
					const stopped = new MessageEmbed()
						.setDescription(`${user} ⏹ stopped the music!`)
						.setColor("RED");
					queue.textChannel.send(stopped);
					try {
						queue.connection.dispatcher.end();
					} catch (error) {
						console.error(error);
						queue.connection.disconnect();
					}
					collector.stop();
					break;

				default:
					reaction.users.remove(user);
					break;
			}
		});

		collector.on("end", () => {
			playingMessage.reactions.removeAll();
			if (PRUNING && playingMessage && !playingMessage.deleted) {
				playingMessage.delete({ timeout: 3000 });
			}
		});
	},
};
