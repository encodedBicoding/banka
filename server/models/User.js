
class User {
  constructor(firstName, email, password, lastName) {
    this.id = 0;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }
}

export default User;
