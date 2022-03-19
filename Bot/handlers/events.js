const fs = require('fs')
module.exports = (client) => {
  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      // If the file is not a JS file, ignore it
      if (!file.endsWith(".js")) return;
      // Load the event file itself
      const event = require(`../events/${file}`);
      // Get just the event name from the file name
      let eventName = file.split(".")[0];
      console.log(eventName)
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`../events/${file}`)];
    });
  });
}
