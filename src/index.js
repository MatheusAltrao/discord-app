require('dotenv').config();

const { discordApi } = require('./lib/discord-api');
const { User } = require('./models/user');
const { createInvite } = require('./functions/createInvite');
const { sendUserInviteMail } = require('./functions/sendUserInviteMail');
const { removeUserFromGuild } = require('../src/functions/removeUserFromGuild');

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('../src/lib/database');

app.all('/webhook/xgrow', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send({ status: 'ok' });
  }

  const body = req.body;

  if (!body) {
    return res.status(400).send({ message: 'Sem dados retornados' });
  }

  const { subscriber_email, payment_status } = body;

  try {
    if (payment_status === 'paid') {
      const invite = await createInvite();
      await User.create({ email: subscriber_email, invite });
      await sendUserInviteMail(subscriber_email, invite.url);

      return res.status(200).send({ status: 'ok' });
    } else {
      await removeUserFromGuild(subscriber_email);
      await User.deleteOne({ email: subscriber_email });

      return res.status(200).send({ status: 'ok' });
    }
  } catch (error) {
    console.log('Erro na rota ALL /webhook/xgrow:', error);
    res.status(500).json({ message: 'Ocorreu um erro, verifique o console' });
  }
});

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

app.listen(4040, () => {
  console.log('Servidor iniciado!');
});
