## Como usar

### 1. Baixar o projeto localmente
```js
git clone https://github.com/hlxdev/discord-invite-system.git
```

### 2. Substituir variáveis de ambiente
Acesse o arquivo `.env` e edite os valores:
```
DISCORD_BOT_TOKEN=
DISCORD_CHANNEL_ID=
DISCORD_GUILD_ID=
```

- **DISCORD_BOT_TOKEN**: Token do bot
- **DISCORD_CHANNEL_ID**: ID do canal que será gerado os convites
- **DISCORD_GUILD_ID**: ID do servidor onde o bot irá agir

### 3. Instalar as bibliotecas
```
npm install
```

### 4. Iniciar o projeto
```
npm start
```

## Rotas da API
- **GET   /invites/list**: Retorna uma lista com os membros que entraram no servidor através de um convite,  com a nome do usuário, data de entrada e o código de convite;

- **POST /invites**: Cria um código de convite e retorna-o junto com a url completa;
