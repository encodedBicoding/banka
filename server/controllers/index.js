module.exports = {
    login: (req, res)=>{
        res.status(200).json({
            status: 200,
            message: 'Welcome to the login page'
        })
    }
}