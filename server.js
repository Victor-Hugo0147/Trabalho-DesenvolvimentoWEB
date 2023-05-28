const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = []; // Array para armazenar os usuários (simulação de um banco de dados)

// Rota para adicionar um usuário
app.post('/users', (req, res) => {
    console.log('kkkk')
    const { name, email } = req.body;
    const newUser = {
      name,
      email
    };
    users.push(newUser);
    res.json({ message: 'Usuário adicionado com sucesso!' });
  });


// Rota para exibir todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para editar um usuário
app.put('/users/:email', (req, res)=> {
    console.log('Rota de edição funcionando');
    const { email } = req.params;
    const { nome, senha } = req.body;
  
    // Verifica se o usuário existe
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  
    // Atualiza os atributos do usuário
    users[userIndex].nome = nome;
    users[userIndex].senha = senha;
  
    res.json({ message: 'Usuário atualizado com sucesso.', user: users[userIndex] });
  });

// Rota para excluir um usuário
app.delete('/users/:email', (req, res) => {
    const { email } = req.params;
  
    // Verifica se o usuário existe
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  
    // Remove o usuário do array
    const deletedUser = users.splice(userIndex, 1)[0];
  
    res.json({ message: 'Usuário excluído com sucesso.', user: deletedUser });
  });
  
// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
