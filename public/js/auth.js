
const url = 'Http://localhost:8081/api/auth';

const formCustomAuth = document.querySelector('#formCustomAuth');

formCustomAuth.addEventListener('submit', e => {
    e.preventDefault();
    const formData = {};
    for (let element of formCustomAuth.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }
    fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(resp => resp.json())
        .then(({token, msg}) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
});

function handleCredentialResponse(response) {
    // Google token : ID_TOKEN
    const body = { id_token: response.credential };
    fetch(url + '/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById('google_sign_out');
button.onclick = () => {
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
    console.log(google.accounts.id);
};
