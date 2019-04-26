class Index {
  static home(req, res) {
    res.status(200).json({
      status: 200,
      message: 'Welcome to api version 1 of Banka',
    });
  }

  static docs(req, res) {
    res.redirect('https://bankaapi.docs.apiary.io')
  }
}

export default Index;

