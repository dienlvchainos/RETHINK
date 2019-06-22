import BaseService from '../libs/baseService';

export default class UserServices extends BaseService {

    getModelName() {
        return 'user'
    }

    getList() {
        let url = '/users';
        return this.get(url);
    }

    updateProfile(body, userToken) {
        let url = '/user/update_info';
        return this.post2(url, body, userToken);
    }

    deleteUser(body, userToken) {
        let url = '/user/delete';
        return this.del(url, body, userToken);
    }

    resetPassword(body, userToken) {
        let url = '/user/reset_password_email';
        return this.put(url, body, userToken);
    }

    updatePassword(body, userToken) {
        let url = '/user/reset_password';
        return this.put(url, body, userToken);
    }

    changePassword(body, userToken) {
        let url = '/user/change_password';
        return this.put(url, body, userToken);
    }

    changeEmail(body, userToken) {
        let url = '/user/change_email';
        return this.put(url, body, userToken);
    }

    logout(body, userToken) {
        let url = '/user/logout';
        return this.post2(url, body, userToken);
    }

    async _naverSearchAddress(_text, coordinate) {
        let fullUrl = "https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=" + _text + "&coordinate=" + coordinate;
        let response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                "X-NCP-APIGW-API-KEY-ID": "qx3jb834p8",
                "X-NCP-APIGW-API-KEY": "C5Zn5bMJnNphholw0AJcpqLd8YiF8Hgud8lVMna9"
            }
        });
        return await this._cbSearchAddress(response);
    }

    async _cbSearchAddress(response) {
        const content = await response.text();
        const status = response.status;
        let data = {};
        try {
            data.status = status;
            data.data = content ? JSON.parse(content) : {};
            this._logResponse(response.status, data);
        } catch (error) {
            this._logResponse(response.status, content);
            return { error: 1 }
        }
        return data;
    }

}