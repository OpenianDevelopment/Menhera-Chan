module.exports = (client, oldMem, newMem) => {

   if (newMem.id != client.user.id) return;

   if (newMem.channelId != null) return;

   if (client.queue) client.queue.delete(newMem.guild.id)
}
