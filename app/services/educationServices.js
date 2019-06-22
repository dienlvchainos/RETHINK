import BaseService from '../libs/baseService';

export default class EducationService extends BaseService {

    getModelName() {
        return 'education'
    }

    getList(userToken) {
        let url = '/edu/list_all';
        return this.get(url, {}, userToken);
    }

    findByName(_name, userToken) {
        let url = '/edu/find_by_name';
        return this.get(url, {name: _name}, userToken);
    }

    create(body, userToken) {
        let url = '/edu/create';
        return this.post2(url, body, userToken);
    }

    delete(eduId, userToken) {
        let url = '/edu/delete?id=' + eduId;
        return this.del(url, {}, userToken);
    }
}