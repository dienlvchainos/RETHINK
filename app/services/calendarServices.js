import BaseService from '../libs/baseService';

export default class CalendarService extends BaseService {

    getModelName() {
        return 'calendar'
    }

    createActivity(body, userToken) {
        let url = '/activity/create';
        return this.post2(url, body, userToken);
    }

    getList(userToken) {
        let url = '/schedule/list_children_schedules';
        return this.get(url, {}, userToken);
    }

    getByRange(_from, _to, userToken) {
        let url = '/schedule/list_children_schedules_range';
        return this.get(url, { from: _from, to: _to }, userToken);
    }

    deleteActivity(activityId, userToken) {
        let url = '/activity/delete?id=' + activityId;
        return this.del(url, {}, userToken);
    }

    getListDraff(userToken) {
        let url = '/draft_event/list';
        return this.get(url, {}, userToken);
    }

    createSyncActivity(body, userToken) {
        let url = '/draft_event/create';
        return this.post2(url, body, userToken);
    }

    updateSyncActivity(body, userToken) {
        let url = '/draft_event/edit';
        return this.put(url, body, userToken);
    }

    deleteSyncActivity(syncActivityId, userToken) {
        let url = '/draft_event/delete?id=' + syncActivityId;
        return this.del(url, {}, userToken);
    }

    getListEventByRange(_from, _to, userToken) {
        let url = '/schedule/list_children_activities_range';
        return this.get(url, { from: _from, to: _to }, userToken);
    }
}