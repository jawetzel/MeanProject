import request from 'request';

import {optionsBuilder} from '../dataAccess';

const login = (model, callback) => {
    let options = optionsBuilder(model, 'account/login');
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(body);
    });
};

const register = (model, callback) => {
    let options = optionsBuilder(model, 'account/register');
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(body);
    });
};
const lostPassword = (model, callback) => {
    let options = optionsBuilder(model, 'account/lostPassword');
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(body);
    });
};
export default {
    login: login,
    register: register,
    lostPassword: lostPassword
}