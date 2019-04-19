
class User {
  constructor(firstName, email, password, lastName) {
    this.id = 0;
    this.firstname = firstName;
    this.lastname = lastName;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }
}

export default User;
