require('dotenv').config();

const { discordApi } = require('./lib/discord-api');
const express = require('express');
const app = express();

require('./lib/websocket');

app.get('/invites/list', async (req, res) => {
  try {
    const response = await discordApi.post(
      `/guilds/${process.env.DISCORD_GUILD_ID}/members-search`,
      {
        or_query: {},
        and_query: {
          join_source_type: {
            or_query: [5],
          },
        },
        limit: 250,
      }
    );

    const members = response.data.members;

    const data = members.map((member) => ({
      invite_code: member.source_invite_code,
      joined_at: member.member.joined_at,
      user: {
        id: member.member.user.id,
        username: member.member.user.username,
        avatar: member.member.user.avatar,
      },
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log('Erro na rota GET /invites/all:', error);
    res.status(500).json({ message: 'Ocorreu um erro, verifique o console' });
  }
});

app.post('/invites', async (req, res) => {
  try {
    const response = await discordApi.post(`/channels/${process.env.DISCORD_CHANNEL_ID}/invites`, {
      unique: true,
      max_uses: 1,
      max_age: 0,
    });

    const { code } = response.data;
    const url = `https://discord.gg/${code}`;

    return res.status(201).json({
      code,
      url,
    });
  } catch (error) {
    console.log('Erro na rota POST /invites:', error);
    res.status(500).json({ message: 'Ocorreu um erro, verifique o console' });
  }
});

app.listen(4040, () => {
  console.log('Servidor iniciado!');
});
