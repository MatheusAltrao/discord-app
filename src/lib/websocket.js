const { REST } = require('@discordjs/rest');
const { WebSocketManager, WebSocketShardEvents } = require('@discordjs/ws');

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

const manager = new WebSocketManager({
	token: process.env.DISCORD_BOT_TOKEN,
	intents: 1 << 1,
	rest,
});

manager.on(WebSocketShardEvents.Dispatch, (event) => {
	if(event.t === 'GUILD_MEMBER_ADD') {
    console.log(`O usuário ${event.d.user.username} entrou no servidor!`)
  }
});

manager.connect().then(() => console.log('Websocket conectado!'));