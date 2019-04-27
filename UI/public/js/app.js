const start = () => {
  // Function to show error message on signup and login
  const showError = (msg) => {
    const formError = document.querySelector('#formError');
    formError.innerHTML = msg;
    formError.style.display = 'block';
    setTimeout(() => {
      formError.style.display = 'none';
    }, 7000);
  };

  // Function to change text content of form action
  const changeContent = (e, msg) => {
    e.textContent = msg;
  };
  // Function to set location
  const setLocation = (location) => {
    window.location.href = `http://localhost:63342/banka/UI/${location}.html`;
  };


  let userLocation = window.location.href.split('/');
  // eslint-disable-next-line prefer-destructuring
  userLocation = userLocation[userLocation.length - 1].split('.')[0];

  if (userLocation !== 'signup'
    && userLocation !== 'login'
    && userLocation !== 'index') {
    const token = window.sessionStorage.access_banka_token;
    if (!token) {
      setLocation('login');
    }
  }

  if (userLocation === 'signup') {
    // signup form
    const signupForm = document.querySelector('#signup_form');
    signupForm.addEventListener('submit', (e) => {
      const signupBtn = document.querySelector('#signupBtn');
      changeContent(signupBtn, 'Loading...');
      e.preventDefault();
      const api = 'https://dominic-banka.herokuapp.com/api/v1/auth/signup';
      const user = {
        firstname: document.querySelector('#firstname').value,
        lastname: document.querySelector('#lastname').value,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
      };
      fetch(api, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then(resp => resp.json())
        .then((res) => {
          if (res.status !== 201) {
            changeContent(signupBtn, 'CREATE ACCOUNT');
            showError(res.message);
          } else {
            window.sessionStorage.access_banka_token = res.data.token;
            setLocation('dashboard');
          }
        }).catch((err) => {
          console.log(err);
        });
    });
  } if (userLocation === 'login') {
    const loginForm = document.querySelector('#login_form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginBtn = document.querySelector('#loginBtn');
      changeContent(loginBtn, 'Loading...');
      const api = 'https://dominic-banka.herokuapp.com/api/v1/auth/login';
      const user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
      };
      fetch(api, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then(resp => resp.json())
        .then((res) => {
          if (res.status !== 200) {
            changeContent(loginBtn, 'LOG IN');
            showError(res.message);
          } else {
            window.sessionStorage.access_banka_token = res.data.token;
            window.sessionStorage.user_name = res.data.userObj.firstname;
            setLocation('dashboard');
          }
        }).catch((err) => {
          console.log(err.message);
          showError('Internet Disconnected');
          changeContent(loginBtn, 'LOG IN');
        });
    });
  } if (userLocation === 'dashboard') {
    const { user_name } = window.sessionStorage;
    const welcome = document.querySelector('#welcome');
    changeContent(welcome, `Welcome: ${user_name.toUpperCase()}`);
  }
};
start();
