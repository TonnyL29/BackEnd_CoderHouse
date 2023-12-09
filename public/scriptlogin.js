//Ejecutando funciones
document
  .getElementById("btn__iniciar-sesion")
  .addEventListener("click", iniciarSesion);
document
  .getElementById("btn__registrarse")
  .addEventListener("click", registrarse);
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", async () => {

      let email = document.getElementById("email_login").value;
      let pass = document.getElementById("pass_login").value;
      try {
        const url = "api/login";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: pass
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // No necesitas parsear la respuesta porque el backend está redirigiendo

        if (response.redirected) {
            // El backend redirigió al frontend, obtén la URL de redirección desde la respuesta
            const redirectUrl = response.url;

            // Realiza la redirección en el frontend
            window.location.href = redirectUrl;
        } else {
            // El backend no redirigió, maneja la respuesta como sea necesario
            const data = await response.json();

            if (data.status) {
                Toast.fire({
                    icon: "success",
                    title: "Login correcto, estas siendo redireccionado"
                });

                // Redirigir al usuario al frontend usando la URL proporcionada por el backend
                window.location.href = data.redirect;
            } else {
                Toast.fire({
                    icon: "error",
                    title: "⚠️ Error al logearte:  contacta al administrador"
                });
            }
        }
    } catch (error) {
        console.error(error);

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        Toast.fire({
            icon: "error",
            title: "⚠️ Error al logearte, contacta al administrador"
        });
    }
  });
  




const registerButton = document.getElementById("register");
let msn = document.getElementById("msn");
registerButton.addEventListener("click", async () => {
  try {
    let inombre = document.getElementById("inombre").value;
    let iapellido = document.getElementById("iapellido").value;
    let iemail = document.getElementById("iemail").value;
    let iuser = document.getElementById("iuser").value;
    let ipass = document.getElementById("ipass").value;

    const url = "register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(  {
        username: iuser,
        password: ipass,
        email: iemail,
        name: inombre,
        lastname: iapellido
    }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if(data.statusRegister){
      
      document.getElementById("inombre").value = "";
      document.getElementById("iapellido").value = "";
      document.getElementById("iemail").value = "";
      document.getElementById("iuser").value = "";
      document.getElementById("ipass").value = "";
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        willClose: () => {
          iniciarSesion();
        }
      });
      Toast.fire({
        icon: "success",
        title: "Usuario registrado correctamente"
      });
    }else{
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Error al crear el usuario"
      });
      msn.innerHTML = '<h5 style="color:red">Error al crear el usuario</h5>';
      console.log(`Registro incorrecto: ${data}`)
    }

  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
});

window.addEventListener("resize", anchoPage);

//Declarando variables
let formulario_login = document.querySelector(".formulario__login");
let formulario_register = document.querySelector(".formulario__register");
let contenedor_login_register = document.querySelector(
  ".contenedor__login-register"
);
let caja_trasera_login = document.querySelector(".caja__trasera-login");
let caja_trasera_register = document.querySelector(".caja__trasera-register");

//FUNCIONES

function anchoPage() {
  if (window.innerWidth > 850) {
    caja_trasera_register.style.display = "block";
    caja_trasera_login.style.display = "block";
  } else {
    caja_trasera_register.style.display = "block";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.display = "none";
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_register.style.display = "none";
  }
}

anchoPage();

function iniciarSesion() {
  if (window.innerWidth > 850) {
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "10px";
    formulario_register.style.display = "none";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.opacity = "0";
  } else {
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_register.style.display = "none";
    caja_trasera_register.style.display = "block";
    caja_trasera_login.style.display = "none";
  }
}

function registrarse() {
  if (window.innerWidth > 850) {
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "410px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.opacity = "0";
    caja_trasera_login.style.opacity = "1";
  } else {
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.display = "none";
    caja_trasera_login.style.display = "block";
    caja_trasera_login.style.opacity = "1";
  }
}
