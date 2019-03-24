module.exports = {
    home: (req, res)=>{
        res.status(200).json({
            status: 200,
            message: 'Welcome to api version 1 of Banka'
        })
    }

}