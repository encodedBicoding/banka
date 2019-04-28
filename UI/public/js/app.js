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
    window.location.href = `https://encodedBicoding.github.io/banka/UI/${location}.html`;
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
    let userType;
    document.getElementsByName('user_type').forEach((name) => {
      name.addEventListener('click', () => {
        userType = name.value;
      });
    });
    const { user_name } = window.sessionStorage;
    const welcome = document.querySelector('#welcome');

    changeContent(welcome, `Welcome: ${user_name.toUpperCase()}`);
    const createBankForm = document.querySelector('#create_bank_account');
    const createBankBtn = document.querySelector('#createBankBtn');
    createBankForm.addEventListener('submit', (e) => {
      e.preventDefault();
      changeContent(createBankBtn, 'Creating...');
      const token = window.sessionStorage.access_banka_token;
      const data = {
        accType: document.querySelector('#acc_type').value,
        userType,
      };
      const api = 'https://dominic-banka.herokuapp.com/api/v1/accounts';
      fetch(api, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(resp => resp.json())
        .then((res) => {
          if (res.status !== 201) {
            showError(res.message);
            changeContent(createBankBtn, 'Create Bank Account');
          } else {
            const modal = document.querySelector('#modal');
            const modalOverLay = document.querySelector('#modal_overlay');
            modal.innerHTML = `
            <h3>New Bank Account Created</h3>
            <p>Account Details: </p>
            Account Number: ${res.data.accountnumber} <br/>
            Account Balance: ${res.data.balance} <br />
            Status: ${res.data.status} <br />
            Type: ${res.data.type} <br />
            Date Created: ${res.data.createdon}
            
            <button id="okBtn">OK</button>
            `;
            changeContent(createBankBtn, 'Create Bank Account')
            modalOverLay.style.display = 'block';
            const okBtn = document.querySelector('#okBtn');
            okBtn.addEventListener('click', () => {
              modalOverLay.style.display = 'none';
            });
          }
        }).catch(err => console.log(err));
    });
  }
  if (userLocation === 'create_acc') {
    console.log('create_acc');
  }
};
start();
