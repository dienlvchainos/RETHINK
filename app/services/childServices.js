import BaseService from '../libs/baseService';

export default class ChildServices extends BaseService {

    getModelName() {
        return 'auth'
    }

    create(body, userToken) {
        let url = '/child/create';
        return this.post2(url, body, userToken);
    }

    update(body, userToken) {
        let url = '/child/edit';
        return this.post2(url, body, userToken);
    }

    delete(childId, userToken) {
        let url = '/child/delete/' + childId;
        return this.del(url, {}, userToken);
    }

    getOne(id, userToken) {
        let url = '/child/details/' + id;
        return this.get(url, {}, userToken);
    }

    getList(userToken) {
        let url = '/child/list';
        return this.get(url, {}, userToken);
    }

    getImages(userToken) {
        let url = '/children/avatars';
        return this.get(url, {}, userToken);
    }

    sharePermission(body, userToken) {
        let url = '/child/share_permission';
        return this.post2(url, body, userToken);
    }

    getSharedChilds(userToken) {
        let url = '/child/list_shared_children'
        return this.get(url, {}, userToken);
    }

    checkImage(body, userToken) {
        let url = '/check_image';
        return this.post2(url, body, userToken);
    }
}