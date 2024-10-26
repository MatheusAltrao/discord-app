require('dotenv').config();

const { discordApi } = require('./lib/discord-api');
const { User } = require('./models/user');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./lib/websocket');
require('./lib/database');

// LISTAR USUÁRIOS

app.get('/users/list', async (req, res) => {
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
      id: member.member.user.id,
      username: member.member.user.username,
      joined_at: member.member.joined_at,
      invite_code: member.source_invite_code,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log('Erro na rota GET /users/list:', error);
    res.status(500).json({ message: 'Ocorreu um erro, verifique o console' });
  }
});

// REMOVER USUÁRIO

app.delete('/users/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Nenhum email foi fornecido' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Nenhum usuário foi encontrado com esse email' });
    }

    const inviteCode = user.invite.code;

    const inviteResponse = await discordApi.post(
      `/guilds/${process.env.DISCORD_GUILD_ID}/members-search`,
      {
        or_query: {},
        and_query: {
          join_source_type: { or_query: [5] },
          source_invite_code: { or_query: [inviteCode] },
        },
        limit: 1,
      }
    );

    if (!inviteResponse.data?.members?.length) {
      return res
        .status(400)
        .json({
          message: `Nenhum usuário no Discord foi encontrado com o convite '${inviteCode}'`,
        });
    }

    const inviteUserId = inviteResponse.data.members[0].member.user.id;

    await User.deleteOne({ email });
    await discordApi.delete(`/guilds/${process.env.DISCORD_GUILD_ID}/members/${inviteUserId}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('Erro na rota DELETE /users/:email:', error);
    res.status(500).json({ message: 'Ocorreu um erro, verifique o console' });
  }
});

// CRIAR CONVITE E SALVAR

app.post('/invites', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Nenhum email foi fornecido' });
  }

  try {
    const response = await discordApi.post(`/channels/${process.env.DISCORD_CHANNEL_ID}/invites`, {
      unique: true,
      max_uses: 1,
      max_age: 0,
    });

    const { code } = response.data;
    const url = `https://discord.gg/${code}`;

    await User.create({
      email,
      invite: {
        code,
        url,
      },
    });

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
