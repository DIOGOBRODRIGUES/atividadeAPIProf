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


// 2. POST - Criar novo usuário
createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validar campos de entrada
    if (!firstName || !lastName || !email) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                showMessage(`Usuário criado com ID ${data.id}`, 'success');
                createUserForm.reset();

                // Adicionar o novo usuário à lista localmente
                const newUser = {
                    id: data.id,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    avatar: 'https://reqres.in/img/faces/placeholder-user.png' // Placeholder de avatar
                };
                usersData.push(newUser);
                displayUsers(usersData);
            } else {
                showMessage('Erro ao criar usuário.', 'error');
            }
        })
        .catch(error => {
            showMessage('Erro ao criar usuário.', 'error');
            console.error('Erro:', error);
        });
});


// Função para exibir a lista de usuários
function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
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
}