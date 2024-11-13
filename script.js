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


// 3. PUT/PATCH - Atualizar usuário existente
updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('update_id').value.trim();
    const firstName = document.getElementById('update_first_name').value.trim();
    const lastName = document.getElementById('update_last_name').value.trim();
    const email = document.getElementById('update_email').value.trim();

    if (!id) {
        showMessage('Por favor, insira o ID do usuário.', 'error');
        return;
    }

    // Preparar os dados para atualização
    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
        showMessage('Por favor, preencha ao menos um campo para atualizar.', 'error');
        return;
    }

    fetch(`https://reqres.in/api/users/${id}`, {
        method: 'PUT', // ou 'PATCH'
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.updatedAt) {
                showMessage(`Usuário ${id} atualizado com sucesso!`, 'success');
                updateUserForm.reset();

                // Atualizar o usuário na lista localmente
                const userIndex = usersData.findIndex(user => user.id == id);
                if (userIndex !== -1) {
                    if (firstName) usersData[userIndex].first_name = firstName;
                    if (lastName) usersData[userIndex].last_name = lastName;
                    if (email) usersData[userIndex].email = email;
                    displayUsers(usersData);
                }
            } else {
                showMessage('Erro ao atualizar usuário.', 'error');
            }
        })
        .catch(error => {
            showMessage('Erro ao atualizar usuário.', 'error');
            console.error('Erro:', error);
        });
});

// 4. DELETE - Deletar usuário
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('delete_id').value.trim();

    if (!id) {
        showMessage('Por favor, insira o ID do usuário.', 'error');
        return;
    }

    fetch(`https://reqres.in/api/users/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.status === 204) {
                showMessage(`Usuário ${id} deletado com sucesso!`, 'success');
                deleteUserForm.reset();

                // Remover o usuário da lista localmente
                usersData = usersData.filter(user => user.id != id);
                displayUsers(usersData);
            } else {
                showMessage('Erro ao deletar usuário.', 'error');
            }
        })
        .catch(error => {
            showMessage('Erro ao deletar usuário.', 'error');
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