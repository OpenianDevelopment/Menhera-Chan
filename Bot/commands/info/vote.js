const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');
const DBL = require("dblapi.js");

module.exports = {
    name: 'vote',
    description: 'votes for our bot',
    category:'general',
    args: false,
    run:async(client,message,args)=>{
        const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczMTE0Mzk1NDAzMjIzMDQ1MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA3NDM3NzIzfQ.Je4W0naACdZPsP_yWpHX06yYhKmPxbI9AFYO0MFif5o', client);
        dbl.hasVoted(message.author.id).then(votes => {if(votes == false){message.channel.send("It looks like you didn't vote \nGo to https://top.gg/bot/731143954032230453 to vote!")}else{message.channel.send("You already voted! \nCome back at a later time.")}
        });
    }
}