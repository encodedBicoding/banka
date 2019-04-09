const validateInput = {
  name: /^[A-z]{3,20}$/,
  email: /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/,
  password: /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/,
};
const signupBtn = document.querySelector('#signupBtn');
const fn = document.querySelector('#firstname');
const ln = document.querySelector('#lastname');
const e = document.querySelector('#email');
const pw = document.querySelector('#password');
const rp = document.querySelector('#re_password');

function validateField(element) {
  const signupBtn = document.querySelector('#signupBtn');
  signupBtn.removeAttribute('disabled');
  const { name } = validateInput;
  element.addEventListener('keyup', function () {
    if (element.type === 'text') {
      const { value } = this;
      const p = this.nextElementSibling;
      if (!name.test(value)) {
        p.textContent = 'name must be greater than 2 letters and must not contain digits';
        signupBtn.setAttribute('disabled', 'disabled');
      } else {
        p.textContent = '';
        signupBtn.removeAttribute('disabled');
      }
    }
    if (element.name === 'lastname') {
      const { value } = this;
      const p = this.nextElementSibling;
      if (!name.test(value)) {
        p.textContent = 'lastname must be greater than 2 letters and must not contain digits';
        signupBtn.setAttribute('disabled', 'disabled');
      } else {
        p.textContent = '';
        signupBtn.removeAttribute('disabled');
      }
    }
    if (element.type === 'email') {
      const { email } = validateInput;
      const { value } = this;
      const p = this.nextElementSibling;
      if (!email.test(value)) {
        p.textContent = 'Invalid Email';
        signupBtn.setAttribute('disabled', 'disabled');
      } else {
        p.textContent = '';
        signupBtn.removeAttribute('disabled');
      }
    }
    if (element.type === 'password') {
      const { password } = validateInput;
      const { value } = this;
      const p = this.nextElementSibling;
      if (!password.test(value)) {
        p.textContent = 'password but be at least 8 characters';
        signupBtn.setAttribute('disabled', 'disabled');
      } else {
        p.textContent = '';
        signupBtn.removeAttribute('disabled');
      }
    }
  });
}
function getFormDetails() {
  validateField(fn);
  validateField(ln);
  validateField(e);
  validateField(pw);
  rp.addEventListener('keyup', function () {
    const pass = this.value;
    const p = this.nextElementSibling;
    if (pass !== pw.value) {
      p.textContent = 'passwords do not match';
      signupBtn.setAttribute('disabled', 'disabled');
    } else {
      p.textContent = '';
      signupBtn.removeAttribute('disabled');
    }
  });
}
getFormDetails();
