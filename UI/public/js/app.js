function startApp(){
    let session = false;
    let endpoint = window.location.href.split("/")[5];
    if(endpoint !== "/" || endpoint !== "signup.html" || endpoint !== "login.html" && session === false){
        window.location.href = "https://encodedbicoding.github.io/banka/UI/login.html";
    }
}
startApp();