const Discord = require('discord.js')

module.exports = {
    name: 'rps',
    description: 'Play a cool game of `rock, paper, scissors` with the bot or another user!!',
    category:'fun',
    usage: '<user / "rock", "paper", "scissors">',
    run:async (client,message,args)=>{  
      const member = message.mentions.members.first(); //the member (only works by mention)
      const rpsembed = new Discord.MessageEmbed()
      .setAuthor("New RPS game", client.user.displayAvatarURL(), "https://menhera-chan.in");
      //da best and first embed in this command
  
      const rps = ["rock", "paper", "scissors"]; //the choices (well it could be used for other things but i only used it with "botvalue")
  //1 rock, 2 paper, 3 scissors
      const botvalue = rps[Math.floor(Math.random() * rps.length)]; //bot's choice
  
      var rock = "rock"; 
      var paper = "paper"; 
      var scissors = "scissors";
  
      if(!member) {
          var TheChoice = args[0];
          //the choice
          if(TheChoice === rock
          || TheChoice === paper
          || TheChoice === scissors) {
            var TheWinner; //the winner var
  
        if(
          (TheChoice==rock&&botvalue==scissors)
          || (TheChoice==paper&&botvalue==rock)
          || (TheChoice==scissors&&botvalue==paper)
        ) {
          TheWinner = `${message.author} wins`;
        } else if(TheChoice===botvalue) {
          TheWinner = "Draw, no one wins";
        } else {
          TheWinner = `${client.user} wins`;
        }
          //getting the winner
            rpsembed.addFields(
              {name: client.user.username, value: botvalue, inline: true},
              {name: message.author.username, value: TheChoice, inline: true},
            )
            .setDescription(TheWinner);
            //the embed
            return message.channel.send(rpsembed);
            //ends
          } else {
            return message.channel.send(`That is not from the choices, you need to choose from \`rock\`, \`paper\`, \`scissors\``);
            //ends
          }
      };
          let memberchoice = '-';
          let authorchoice = '-';
          //the choices
          rpsembed.addFields(
            {name: member.user.username, value: memberchoice, inline: true},
            {name: message.author.username, value: authorchoice, inline: true},
          );
          //the embed
          if(member.user.bot) return message.channel.send("Damn so lonely wanna play with a bot kek!");
          if(message.author.id === member.id) return message.channel.send("Damn so lonely wanna play with yourself kek!");
          //if something is wrong before starting the cmd
          message.channel.send(`${member.user}, you have 1 minute to say **\`accept\`** to play **RPS** with **${message.author.tag}**`)
          //the request msg
          let answer = await message.channel.awaitMessages(answers=>answers.author.id===member.id&&
            answers.content.toLowerCase()==="accept",{max: 1, time: 60*1000})
          var accept = (answer.map(answers=>answers.content)).join();
          //the answer of the request msg
          if(accept.toLowerCase()==='accept') {
          //if accepted
          const thismsg = await message.channel.send(rpsembed);
          //sending the msg in "msg.channel" ofc
          var dummy;
          const dummyembed = new Discord.MessageEmbed()
          .setAuthor("NOT New RPS game", client.user.displayAvatarURL(), "https://menhera-chan.in/")
  
          member.send(`Loading...`).catch(err=>{
            dummyembed
            .setDescription(`I think ${message.author} wins then...`)
            .addFields(
              {name: member.user.username, value: "This dummy have their dms closed", inline: true},
              {name: message.author.username, value: "-", inline: true},
            );
            if(err) dummy = 1;
            return thismsg.edit(dummyembed)
          });
          message.author.send("Loading..").catch(err=>{
            dummyembed
            .setDescription(`I think <@${member.id}> wins then...`)
            .addFields(
              {name: member.user.username, value: "-", inline: true},
              {name: message.author.username, value: "This dummy have their dms closed", inline: true},
            );
            if(err) dummy = 1;
            return thismsg.edit(dummyembed)
          });
          if(dummy = 1) return
          await member.send(RPSEmbed())
          //sending and waiting for member's answer
          let manswer = await member.user.dmChannel.awaitMessages(answers=>answers.author.id===member.id&&
            answers.content.toLowerCase()=== "rock"
          || answers.content.toLowerCase()=== "paper"
          || answers.content.toLowerCase()=== "scissors",{max: 1, time: 30*1000});
          var nmemberchoice = (manswer.map(answers=>answers.content.toLowerCase())).join();
          //to get the answer
          if(nmemberchoice===rock) {
            nmemberchoice = "Rock";
            member.send("Okie dokie");
          } else if(nmemberchoice===paper) {
            nmemberchoice = "Paper";
            member.send("Okie dokie");
          } else if(nmemberchoice===scissors) {
            nmemberchoice = "Scissors"; 
            member.send("Okie dokie");
            //choices
          } else {
            member.send("Time ended");
            return message.channel.send(`<@${member.user.id}> didn\'t choose in time, ${message.author} wins...`)
            //if wrong answer it ends
          };
          await message.author.send(RPSEmbed())
          //sending and waiting for the author's choice
          let aanswer = await message.author.dmChannel.awaitMessages(answers=>answers.author.id===message.author.id&&
            answers.content.toLowerCase()=== "rock"
          || answers.content.toLowerCase()=== "paper"
          || answers.content.toLowerCase()=== "scissors",{max: 1, time: 30*1000});
          //if time passes it ends
          var nauthorchoice = (aanswer.map(answers=>answers.content.toLowerCase())).join();
          //to get the answer
          if(nauthorchoice===rock) {
            nauthorchoice = "Rock";
            message.author.send("Okie dokie");
          } else if(nauthorchoice===paper) {
            nauthorchoice = "Paper";
            message.author.send("Okie dokie");
          } else if(nauthorchoice===scissors) {
            nauthorchoice = "Scissors";
            message.author.send("Okie dokie");
            //the choices
          } else {
            message.author.send("Time ended");
            return message.channel.send(`${message.author} didn't choose in time, <@${member.id}> wins...`)
            //if wrong answer it ends
          };
  
          if(!nauthorchoice&&!nmemberchoice) {
            //if none chose yet
            return;
          } else {
            const newrpsembedvsmv2 = new Discord.MessageEmbed()
              .setAuthor("New RPS game", client.user.displayAvatarURL(), "https://menhera-chan.in/")
              .setDescription(getWinner())
              .addFields(
                {name: member.user.username, value: nmemberchoice, inline: true},
                {name: message.author.username, value: nauthorchoice, inline: true},
              );
              //the last embed
              return thismsg.edit(newrpsembedvsmv2)
              //when both chooses it sends and tada end (well not yet)
          }
        } else {
            message.channel.send(`**${member.user.tag}** didn't accept in time so RIP`)
            //if the member didn't accept the request
        }
      function getWinner() {
        var user1, user2;
            if(nauthorchoice ==  "Rock"){user1 = 1}
            if(nauthorchoice ==  "Paper"){user1 = 2}
            if(nauthorchoice ==  "Scissors"){user1 = 3}
            if(nmemberchoice ==  "Rock"){user2 = 1}
            if(nmemberchoice ==  "Paper"){user2 = 2}
            if(nmemberchoice ==  "Scissors"){user2 = 3}
            var winCon = user1-user2
            if(winCon == (1||-2)){return `${message.author} wins!`}
            if(winCon == 0){return `Draw, no one wins here`}
            if(winCon == (2||-1)){return `<@${member.id}> wins!`}
            //getting the winner
      }
          
      function RPSEmbed() {
        const embed = new Discord.MessageEmbed()
          .setTitle("RPS")
          .setDescription("Reply with one of the followings\n`rock`\n`paper`\n`scissors`\nyou have 30 seconds to answer");
        return embed;
        //the embed cuz i was lazy to write it twice
      } 
    }
  }
  