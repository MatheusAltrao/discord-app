const { default: axios } = require('axios');

const discordApi = axios.create({
  baseURL: 'https://discord.com/api/v10',
  headers: {
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
  },
});

module.exports = { discordApi };
