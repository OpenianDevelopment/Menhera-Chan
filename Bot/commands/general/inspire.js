const axios = require('axios')
module.exports = {
    name: 'inspire',
    category: 'general',
    description: 'random inspirational quotes',
    run: async (client, message, args)=>{
        await axios.get('https://www.affirmations.dev/').then(res=>{
            message.channel.send(res.data.affirmation)
        })
    }
}