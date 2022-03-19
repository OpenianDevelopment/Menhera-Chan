module.exports = async (client, invite) => {

    if (!invite.guild.me.hasPermission('MANAGE_GUILD')) return;
    if (!invite.guild.me.hasPermission('MANAGE_CHANNELS')) return;
    client.invite.set(invite.guild.id, await invite.guild.fetchInvites()); //adding invite to cached invite

}