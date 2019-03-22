class User{
    constructor(firstname, email, password){
        this.firstname = firstname;
        this.email = email;
        this.password = password;
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
export default User