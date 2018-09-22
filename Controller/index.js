var express = require('express');



module.exports = function (router, database){


    const AccountRouter = express.Router();
    router.use('/account', AccountRouter);
    require('./Account')(AccountRouter, database);

};