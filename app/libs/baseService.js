import axios from 'axios';
import AppConfig from '../config.js';
import noticeUtils from '../utils/noticeUtils.js';

export default class BaseService {
    async get(url, params = {}, userToken) {
        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        let fullUrl = this._getFullUrl(url) + '?' + query;
        let response = await fetch(fullUrl, {
            method: 'GET',
            headers: this._getHeader(userToken)
        });
        this._logRequest('GET', url, params);
        return await this._processResponse(response);
    }

    async post(url, params = {}) {
        let response = await fetch(this._getFullUrl(url), {
            method: 'POST',
            headers: this._getHeader(),
            body: JSON.stringify(params)
        });
        this._logRequest('POST', url, params);
        return await this._processResponse(response);
    }

    async post2(url, params = {}, userToken) {
        let formdata = new FormData();
        Object.keys(params).map((keyName) => {
            formdata.append(keyName, params[keyName]);
        }).join('&');
        let response = await fetch(this._getFullUrl(url), {
            method: 'POST',
            headers: this._getHeader2(userToken),
            body: formdata
        });
        this._logRequest('POST', url, params);
        return await this._processResponse(response);
    }

    async put(url, params = {}, userToken) {
        let formdata = new FormData();
        Object.keys(params).map((keyName) => {
            formdata.append(keyName, params[keyName]);
        }).join('&');
        let response = await fetch(this._getFullUrl(url), {
            method: 'PUT',
            headers: this._getHeader(userToken),
            body: JSON.stringify(params)
        });
        this._logRequest('PUT', url, params);
        return await this._processResponse(response, url);
    }

    async del(url, params = {}, userToken) {
        let response = await fetch(this._getFullUrl(url), {
            method: 'DELETE',
            headers: this._getHeader(userToken),
            body: JSON.stringify(params)
        });
        this._logRequest('DELETE', url, params);
        return await this._processResponse(response);
    }

    _getFullUrl(url) {
        return AppConfig.getApiUrl() + url
    }

    _logRequest(method, url, params) {
        if (__DEV__) {
            console.log(method + ': ' + url, params);
        }
    }

    _logResponse(responseCode, data) {
        if (__DEV__) {
            console.log(responseCode, data);
        }
    }

    async _processResponse(response) {
        const content = await response.text();
        const status = response.status;
        let data = {};
        try {
            data.status = status;
            data.data = content ? JSON.parse(content) : {};
            this._logResponse(response.status, data);
        } catch (error) {
            this._logResponse(response.status, content);
            // throw error;
            // noticeUtils.inform(noticeUtils.message.errorServer);
            return { error: 1 }
        }
        return data;
    }

    _getHeader(userToken) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': userToken
        }
    }

    _getHeader2(userToken) {
        return {
            'Content-Type': 'multipart/form-data',
            'Authorization': userToken
        }
    }

    _getHeader3(userToken) {
        return {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
}