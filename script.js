const container = document.querySelector('.container')
const registerBtn = document.querySelector('.register-btn')
const loginBtn = document.querySelector('.login-btn')

registerBtn.addEventlistener('click', () => {
    container.classList.add('active')
});

loginBtn.addEventlistener('click', () => {
    container.classList.remove('active')
});