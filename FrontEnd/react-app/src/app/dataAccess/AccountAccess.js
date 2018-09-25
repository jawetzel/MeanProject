import request from 'request';

import {optionsBuilder} from '../dataAccess';

const login = (model, callback) => {
    let options = optionsBuilder(model, 'account/login');
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(body);
    });
};

export default {
    login: login,
}