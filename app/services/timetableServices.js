import BaseService from '../libs/baseService';

export default class TimetableService extends BaseService {

    getModelName() {
        return 'timatable'
    }

    getSetting(userToken) {
        let url = '/timetable/setting/details';
        return this.get(url, {}, userToken);
    }

    create(body, userToken) {
        let url = '/timetable/setting/create';
        return this.post2(url, body, userToken);
    }

    update(body, userToken) {
        let url = '/timetable/setting/edit';
        return this.put(url, body, userToken);
    }

    getEvent(childId, userToken) {
        let url = '/activity/list?child_id=' + childId;
        return this.get(url, {}, userToken);
    }
}