const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((request, response, next) =>{
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,DELETE");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})
// Rota para servir o arquivo HTML estático
app.use(express.static('public'));

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://leo9aec:unifor239@cluster0.q6au30c.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o MongoDB:', error);
  });

// Definição do modelo do usuário
const User = mongoose.model('User', {
  name: String,
  email: String
});

// Rota para adicionar um usuário
app.post('/user', (req, res) => {
  const { name, email } = req.body;

  // Cria uma nova instância do modelo User com os dados recebidos
  const newUser = new User({
    name,
    email
  });

  // Salva o usuário no MongoDB
  newUser.save()
    .then(() => {
      res.json({ message: 'Usuário adicionado com sucesso!' });
    })
    .catch((error) => {
      console.error('Erro ao adicionar usuário:', error);
      res.status(500).json({ message: 'Erro ao adicionar usuário.' });
    });
});

// Rota para exibir todos os usuários
app.get('/users', (req, res) => {
  // Busca todos os usuários no MongoDB
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários.' });
    });
});

// Rota para editar um usuário
app.put('/users/:email', (req, res) => {
  const { email } = req.params;
  const { name, password } = req.body;

  // Busca e atualiza o usuário no MongoDB
  User.findOneAndUpdate({ email }, { name, password }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      res.json({ message: 'Usuário atualizado com sucesso.', user });
    })
    .catch((error) => {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    });
});

// Rota para excluir um usuário
app.delete('/users/:email', (req, res) => {
  const { email } = req.params;

  // Remove o usuário do MongoDB
  User.findOneAndDelete({ email })
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      res.json({ message: 'Usuário excluído com sucesso.', user: deletedUser });
    })
    .catch((error) => {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ message: 'Erro ao excluir usuário.' });
    });
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
