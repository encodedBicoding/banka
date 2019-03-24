class User{
    constructor(firstname, email, password, username){
        this.id = 0;
        this.firstname = firstname;
        this.email = email;
        this.password = password;
        this.username = username;
        this.displayImage = '';
        this.isAdmin = false;
    }
    uploadImage(url){
        this.displayImage = url;
    }
    resetPassword(newPassword){
        this.password = newPassword;
    }

}
module.exports = User