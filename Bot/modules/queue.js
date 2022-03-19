exports.canModifyQueue = (member) => {
  const { channelID } = member.voice;
  const botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    member.send("You need to join the voice channel first!");
    return;
  }

  return true;
};