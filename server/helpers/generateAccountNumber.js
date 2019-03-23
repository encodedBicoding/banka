const generateAccountNumber = ()=>{
    return Math.floor(Math.random()*124323432/60*60*60);
}
module.exports = generateAccountNumber;