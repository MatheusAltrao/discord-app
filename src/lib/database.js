const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log('Banco de dados conectado!');
});
