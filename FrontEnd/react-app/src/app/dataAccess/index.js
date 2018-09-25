import AccountAccess from "./AccountAccess";
import env from '../env.json';

export const optionsBuilder = (model, path) => {
    const baseUrl = env.apiUrl;
    return( { method: 'POST',
        url: baseUrl + path,
        headers: { 'Content-Type': 'application/json' },
        body: model,
        json: true });
};

export default {
    Account: AccountAccess
}