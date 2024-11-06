const { User } = require('../models/user.js');
const { discordApi } = require('../lib/discord-api.js');

async function removeUserFromGuild(email) {
  const user = await User.findOne({ email });

  if (!user) return;

  const inviteCode = user.invite.code;

  console.log(`Removing user ${email} from guild`);

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

  if (!inviteResponse.data?.members?.length) return;

  const inviteUserId = inviteResponse.data.members[0].member.user.id;

  console.log(`Removing user ${email} with id ${inviteUserId}`);

  await discordApi.delete(`/guilds/${process.env.DISCORD_GUILD_ID}/members/${inviteUserId}`);
}

module.exports = { removeUserFromGuild };
