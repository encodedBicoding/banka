
class User {
  constructor(firstname, email, password, lastname) {
    this.id = 0;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }
}

export default User;
