// Selecionar elementos do DOM
const loadUsersBtn = document.getElementById('load-users-btn');
const userList = document.getElementById('user-list');
const createUserForm = document.getElementById('create-user-form');
const updateUserForm = document.getElementById('update-user-form');
const deleteUserForm = document.getElementById('delete-user-form');
const messageDiv = document.getElementById('message');

// Variável global para armazenar os usuários carregados
let usersData = [];

// Função para exibir mensagens ao usuário
function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Função para carregar e exibir a lista de usuários
function loadUsers() {
    fetch('https://reqres.in/api/users?page=1')
        .then(response => response.json()) //transorma em objeto javascript
        .then(apiResponse => {
            userList.innerHTML = '';
            usersData = apiResponse.data; // Armazenar os usuários na variável global
            usersData.forEach(user => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${user.avatar}" alt="${user.first_name}">
                    <div>
                        <strong>${user.first_name} ${user.last_name}</strong><br>
                        Email: ${user.email}
                    </div>
                `;
                userList.appendChild(listItem);
            });
            showMessage('Usuários carregados com sucesso!', 'success');
        })
        .catch(error => {
            showMessage('Erro ao carregar usuários.', 'error');
            console.error('Erro:', error);
        });
}

// 1. GET - Listar usuários ao clicar no botão
loadUsersBtn.addEventListener('click', loadUsers);
