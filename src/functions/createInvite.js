const { discordApi } = require('../lib/discord-api');

async function createInvite() {
  const response = await discordApi.post(`/channels/${process.env.DISCORD_CHANNEL_ID}/invites`, {
    unique: true,
    max_uses: 1,
    max_age: 0,
  });

  const { code } = response.data;
  const url = `https://discord.gg/${code}`;

  return { code, url };
}

module.exports = { createInvite };
