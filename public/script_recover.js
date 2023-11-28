let email = document.getElementById('email');
let user = document.getElementById('user');
let passNew = document.getElementById('passNew');
let passRepeat = document.getElementById('passRepeat');

let btnRecovery = document.getElementById('recovery');
btnRecovery.disabled = true; 

passNew.addEventListener('blur', () => {
    const passNewValue = passNew.value;
    const passRepeatValue = passRepeat.value;

    if (passRepeatValue === "" || passRepeatValue !== passNewValue) {
        passNew.classList.remove('sucess-border');
        passRepeat.classList.remove('sucess-border');
        passNew.classList.add('error-border');
        passRepeat.classList.add('error-border');
    } else {
        passNew.classList.remove('error-border');
        passRepeat.classList.remove('error-border');
        passNew.classList.add('sucess-border');
        passRepeat.classList.add('sucess-border');
        btnRecovery.disabled = false;
    }
});

passRepeat.addEventListener('blur', () => {
    const passNewValue = passNew.value;
    const passRepeatValue = passRepeat.value;

    if (passNewValue === "" || passNewValue !== passRepeatValue) {
        passNew.classList.remove('sucess-border');
        passRepeat.classList.remove('sucess-border');
        passNew.classList.add('error-border');
        passRepeat.classList.add('error-border');
    } else {
        passNew.classList.remove('error-border');
        passRepeat.classList.remove('error-border');
        passNew.classList.add('sucess-border');
        passRepeat.classList.add('sucess-border');
        btnRecovery.disabled = false;
    }
});
 

btnRecovery.addEventListener('click', async()=>{
    const passNewValue = passNew.value;
    const passRepeatValue = passRepeat.value;
    const emailValue = email.value; 
    const userValue = user.value;

    if(emailValue != "" && userValue != "" && passRepeatValue === passNewValue){
        try {
            const url = "recovery";
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: userValue,
                email:  emailValue, 
                newPassword: passNewValue,
              }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
          
              const data = await response.json();
              if(data.statusrecovery){
                window.location.href = '../api/';
              }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }
})