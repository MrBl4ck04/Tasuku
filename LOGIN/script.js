document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Registro
    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        localStorage.setItem(email, password);
        alert('Usuario registrado con éxito!');
    });

    // Inicio de sesión
    signinBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        // Verificar usuario y contraseña
        if(localStorage.getItem(email) === password) {
            alert('Inicio de sesión exitoso!');
            // Redireccionar al usuario a inicioUsuario.html
            window.location.href = '../INICIO_USUARIO/inicioUsuario.html';
        } else {
            alert('Correo electrónico o contraseña incorrectos.');
        }
    });

    var modal = document.getElementById('password-reset-modal');
    modal.style.display = 'none';
    // Obtén el botón que abre el modal
    var btn = document.getElementById('forgot-password');

    // Obtén el elemento <span> que cierra el modal
    var span = document.getElementsByClassName('close')[0];

    // Cuando el usuario haga clic en el botón, abre el modal 
    btn.onclick = function() {
        modal.style.display = 'block';
    }

    // Cuando el usuario haga clic en <span> (x), cierra el modal
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Cuando el usuario haga clic en cualquier lugar fuera del modal, cierra el modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Lógica para cambiar la contraseña
    var resetPasswordBtn = document.getElementById('reset-password-btn');
    resetPasswordBtn.addEventListener('click', function() {
        var email = document.getElementById('reset-email').value;
        var password = document.getElementById('reset-password').value;
        var passwordConfirm = document.getElementById('reset-password-confirm').value;

        if (password === passwordConfirm) {
            // Aquí deberías añadir una función de hashing a la contraseña antes de almacenarla
            localStorage.setItem(email, password);
            alert('Contraseña cambiada con éxito.');
            modal.style.display = 'none';
        } else {
            alert('Las contraseñas no coinciden.');
        }
    });
});