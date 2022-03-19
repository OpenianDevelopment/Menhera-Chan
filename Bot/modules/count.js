module.exports = async function (client) {
    setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
    }, 1800000);
}
