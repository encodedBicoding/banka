class DummyData {
  constructor() {
    this.users = [{
      id: 1,
      firstname: 'john',
      lastname: 'doe',
      username: 'jonny',
      email: 'johndoe@gmail.com',
      password: '123456789',
      imageUrl: '',
      type: 'client',
      isAdmin: false,
      noOfAccounts: 1,
      accounts: [{
        id: 1,
        accountNumber: 92039433,
        createdOn: new Date(Date.now()),
        type: 'savings',
        owner: 1,
        status: 'active',
        balance: 100000.00,
        lastWithdrawal: new Date(Date.now()),
        lastDeposit: new Date(Date.now()),
        ownerCategory: 'personal',
      }],
    }];
    this.accounts = [{
      id: 1,
      accountNumber: 92039433,
      createdOn: new Date(Date.now()),
      type: 'savings',
      owner: 1,
      status: 'active',
      balance: 100000.00,
      lastWithdrawal: new Date(Date.now()),
      lastDeposit: new Date(Date.now()),
      ownerCategory: 'personal',
    }];
    this.staffs = [{
      id: 1,
      firstname: 'dominic',
      lastname: 'isioma',
      email: 'dominic@gmail.com',
      password: '123456789',
      imageUrl: '',
      type: 'staff',
      isAdmin: true,
    }, {
      id: 2,
      firstname: 'john',
      lastname: 'doe',
      email: 'johndoe@gmail.com',
      password: '123456789',
      imageUrl: '',
      type: 'admin',
      isAdmin: true,
    }];
  }
}
const Database = new DummyData();

export default Database;
