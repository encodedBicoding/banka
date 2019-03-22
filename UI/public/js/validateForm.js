function validateInput(){
    let name = /^[A-z]{3,20}$/;
    let email = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    let password = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/
    return {name, email, password};
}
function validateField(element){
    let signupBtn = document.querySelector('#signupBtn');
    if(element.type == 'text'){
        const {name} = validateInput();
        element.addEventListener('keyup',function(){
            let value = this.value;
            let p = this.nextElementSibling;
            if(!name.test(value)){
                p.textContent = 'name must be greater than 2 letters and must not contain digits';
                signupBtn.setAttribute('disabled','disabled');
            } else{
                p.textContent = '';
                signupBtn.removeAttribute('disabled');
            }

        })
    }
    if(element.type == 'text' && element.name == 'surname'){
        const {name} = validateInput();
        element.addEventListener('keyup',function(){
            let value = this.value;
            let p = this.nextElementSibling;
            if(!name.test(value)){
                p.textContent = 'surname must be greater than 2 letters and must not contain digits';
                signupBtn.setAttribute('disabled','disabled');
            } else{
                p.textContent = '';
                signupBtn.removeAttribute('disabled');
            }

        })
    }
    if(element.type == 'email'){
        const {email} = validateInput();
        element.addEventListener('keyup',function(){
            let value = this.value;
            let p = this.nextElementSibling;
            if(!email.test(value)){
                p.textContent = 'invalid email';
                signupBtn.setAttribute('disabled','disabled');
            } else{
                p.textContent = '';
                signupBtn.removeAttribute('disabled');
            }

        })
    }
    if(element.type == 'password'){
        const {password} = validateInput();
        element.addEventListener('keyup',function(){
            let value = this.value;
            let p = this.nextElementSibling;
            if(!password.test(value)){
                p.textContent = 'password but be at least 8 characters';
                signupBtn.setAttribute('disabled','disabled');
            } else{
                p.textContent = '';
                signupBtn.removeAttribute('disabled');
            }

        })
    }
}
function getFormDetails(){
    let signupBtn = document.querySelector('#signupBtn');
    let fn = document.querySelector('#firstname');
    let sn = document.querySelector('#surname');
    let un = document.querySelector('#username');
    let e = document.querySelector('#email');
    let pw = document.querySelector('#password');
    let rp = document.querySelector('#re_password');
    const firstname = validateField(fn),
          surname = validateField(sn),
          email = validateField(e),
          password = validateField(pw);
    rp.addEventListener('keyup', function(){
        let pass = this.value,
            p = this.nextElementSibling;
        if(pass!== pw.value){
            p.textContent = 'passwords do not match';
            signupBtn.setAttribute('disabled','disabled');
        } else{
            p.textContent = '';
            signupBtn.removeAttribute('disabled');
        }
    })
   }
getFormDetails();