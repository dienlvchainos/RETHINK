import BaseService from '../libs/baseService';

export default class AuthServices extends BaseService {

    getModelName() {
        return 'auth'
    }

    register(body) {
        let url = '/user/register';
        return this.post(url, body);
    }

    socialLogin(body) {
        let url = '/user/social/login';
        return this.post(url, body);
    }

    emailLogin(body) {
        let url = '/user/email/login';
        return this.post(url, body);
    }
}