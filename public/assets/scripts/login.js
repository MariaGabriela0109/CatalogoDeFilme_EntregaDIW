
function cadastrar() {
    let user = document.getElementById("newUser").value.trim();
    let pass = document.getElementById("newPass").value.trim();

    const msg = document.getElementById("cadastroMessage");
    msg.style.color = "red"; 
    if (user === "" || pass === "") {
        msg.innerText = "Preencha todos os campos!"; 
        return; 
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let userExists = users.find(u => u.user === user);
    if (userExists) {
        msg.innerText = "Usuário já existe!";
        return; 
    }
    users.push({ user: user, pass: pass });
    localStorage.setItem("users", JSON.stringify(users));

    msg.style.color = "green"; 
    msg.innerText = "Usuário cadastrado com sucesso! Você pode voltar e fazer o login."; 
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
}

function login() {
    let user = document.getElementById("loginUser").value.trim();
    let pass = document.getElementById("loginPass").value.trim();

    const msg = document.getElementById("loginMessage");
    msg.style.color = "red"; 

    if (user === "" || pass === "") {
        msg.innerText = "Preencha todos os campos!"; 
        return; 
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(u => u.user === user && u.pass === pass);

    if (validUser) {
        localStorage.setItem("loggedUser", user);

        window.location.href = "index.html"; 
        
       

    } else {
        msg.innerText = "Usuário ou senha inválidos.";
    }
}

function verificarLogin(pageType = 'index') {
    const loggedUser = localStorage.getItem("loggedUser");
    
    if (pageType === 'index') { 
        const loginPanel = document.getElementById("login-panel");
        const loggedInInfo = document.getElementById("logged-in-info");
        
        if (!loggedUser) {
            if (loginPanel) loginPanel.classList.add("login-panel-visible");
            if (document.body) document.body.classList.add("body-login-active");
            if (loggedInInfo) loggedInInfo.classList.add("hidden-element"); 
        } else {
            if (loginPanel) loginPanel.classList.remove("login-panel-visible");
            if (document.body) document.body.classList.remove("body-login-active");
            if (loggedInInfo) {
                loggedInInfo.classList.remove("hidden-element"); 
                document.getElementById("welcomeMessage").innerText = `Bem-vindo, ${loggedUser}!`;
            }
            if (typeof loadMovies === 'function') {
                loadMovies();
            }
        }
    } else if (pageType === 'detalhe') { 
        if (!loggedUser) {
            window.location.href = "index.html";
        } else {
            const welcomeElementDetail = document.getElementById("welcomeMessageDetail");
            const btnLogoutDetail = document.getElementById("btn_logout_detail");
            const loggedInInfoDetail = document.getElementById("logged-in-info-detail");
            
            if (welcomeElementDetail) welcomeElementDetail.innerText = `Bem-vindo, ${loggedUser}!`;
            if (loggedInInfoDetail) loggedInInfoDetail.classList.remove("hidden-element");
        }
    }
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html"; 
}

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        verificarLogin('index');
    }
});