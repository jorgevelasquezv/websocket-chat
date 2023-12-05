let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessage = document.querySelector('#ulMessage');
const btnLogout = document.querySelector('#btnLogout');
const sectionPrivateMessage = document.querySelector('#sectionPrivateMessage');
const ulPrivateMessage = document.querySelector('#ulPrivateMessage');


sectionPrivateMessage.style.display = 'none';


const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('Invalid Token');
    }

    const resp = await fetch('http://localhost:8081/api/auth', {
        headers: { 'x-token': token },
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);

    user = userDB;

    document.title = user.name;

    await connectSocket();
};

const connectSocket = async () => {
    socket = io({
        extraHeaders: {
            'x-token': localStorage.getItem('token'),
        },
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('message-received', drawMessages);

    socket.on('active-users', drawUsers);

    socket.on('private-message', drawPrivateMessage);
};

const drawUsers = (users = []) => {
    let usersHTML = '';
    users.forEach(({ name, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsers.innerHTML = usersHTML;
};

btnLogout.addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location = 'index.html';
});

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if (keyCode !== 13) return;

    if (message.length === 0) return;

    socket.emit('send-message', { message, uid });

    txtMessage.value = '';
});

const drawMessages = (messages = []) => {
    ulMessage.innerHTML = '';
    messages.forEach(({ name, message }) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>
                <span class="text-primary">${name}:</span>
                <span>${message}</span>
            </p>
        `;

        ulMessage.append(li);
    });
};

const drawPrivateMessage = ({ from, message }) => {
    ulPrivateMessage.innerHTML = '';
    const li = document.createElement('li');
    li.innerHTML = `
            <p>
                <span class="text-primary">${from}:</span>
                <span>${message}</span>
            </p>
        `;

    ulPrivateMessage.append(li);
};

const main = async () => {
    validateJWT();
};

main();
