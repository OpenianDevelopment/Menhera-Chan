const fetch = require('node-fetch');
const CryptoJS = require('crypto-js')
const { getToken } = require('./dbfunctions')
const { decrypt } = require('./functions')

const TOKEN = process.env.DISCORD_BOT_TOKEN
async function getBotGuilds(id){
    const response = await fetch(`http://discord.com/api/v8/guilds/${id}`,{
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    })
    return response.json();
}
async function getUserGuilds(id){
    const credentials = await getToken(id)
    const encryptedaccesstoken = credentials.get('accessToken')
    const decrypted = decrypt(encryptedaccesstoken)
    const accessToken = decrypted.toString(CryptoJS.enc.Utf8)
    const response = await fetch('http://discord.com/api/v8/users/@me/guilds',{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.json();
}

function CheckGuild(guild,userGuild){
 const userGuilds = userGuild.filter(g=> g.id===guild)
 
 return userGuilds
}

async function getGuildChannel(guild){
    const response = await fetch(`http://discord.com/api/v8/guilds/${guild}/channels`,{
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    })
    return response.json()
}

async function getGuildRole(guild){
    const response = await fetch(`http://discord.com/api/v8/guilds/${guild}/roles`,{
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    })
    return response.json()
}

module.exports = {getBotGuilds, getUserGuilds, getGuildChannel, CheckGuild, getGuildRole};