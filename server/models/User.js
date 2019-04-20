
class User {
  constructor(firstName, email, password, lastName) {
    this.firstname = firstName;
    this.lastname = lastName;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }
}

export default User;
