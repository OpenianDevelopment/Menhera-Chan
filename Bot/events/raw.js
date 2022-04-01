module.exports = (client, raw) => {
	if (raw.t === "INTERACTION_CREATE") {
		let command = client.SlashCommands.get(raw.d.data.name);
		if (!command) return;
		let guild = client.guilds.cache.get(raw.d.guild_id);
		try {
			command.run(client, raw.d, guild);
		} catch (err) {
			console.log(`Error in ${raw.d.data.name}`)
		}
		return;
	}
};
