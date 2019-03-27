const  validateInput = {
    name:/^[A-z]{3,20}$/,
    email: /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/,
    password: /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/
};
let signupBtn = document.querySelector('#signupBtn');
let fn = document.querySelector('#firstname');
let ln = document.querySelector('#lastname');
let e = document.querySelector('#email');
let pw = document.querySelector('#password');
let rp = document.querySelector('#re_password');

function validateField(element){
    let signupBtn = document.querySelector('#signupBtn');
    signupBtn.removeAttribute("disabled");
        const {name} = validateInput;
        element.addEventListener('keyup', function(){
            if(element.type === "text"){
                let value = this.value;
                let p = this.nextElementSibling;
                if(!name.test(value)) {
                    p.textContent = 'name must be greater than 2 letters and must not contain digits'
                    signupBtn.setAttribute("disabled", "disabled")
                }
            }
            if(element.name === "lastname"){
                let value = this.value;
                let p = this.nextElementSibling;
                if(!name.test(value)) {
                    p.textContent = 'lastname must be greater than 2 letters and must not contain digits'
                    signupBtn.setAttribute("disabled", "disabled")
                }
            }
            if(element.type === "email"){
                const { email } = validateInput;
                let value = this.value;
                let p = this.nextElementSibling;
                if(!email.test(value)) {
                    p.textContent = 'Invalid Email';
                    signupBtn.setAttribute("disabled", "disabled");
                }
            }
            if(element.type === "password"){
                const { password } = validateInput;
                let value = this.value;
                let p = this.nextElementSibling;
                if(!password.test(value)) {
                    p.textContent = 'password but be at least 8 characters';
                    signupBtn.setAttribute("disabled", "disabled");
                }
            }
            return this.value;
    });
}
function getFormDetails(){
    validateField(fn);
    validateField(ln);
    validateField(e);
    validateField(pw);
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
