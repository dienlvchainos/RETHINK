import BaseService from '../libs/baseService';

export default class ScheduleService extends BaseService {

    getModelName() {
        return 'schedule'
    }

    getByChild(childId, userToken) {
        let url = '/schedule/list_child_schedule?child_id=' + childId;
        return this.get(url, {}, userToken);
    }

    getByRange(childId, _from, _to, userToken) {
        let url = '/schedule/list_child_schedule_range';
        return this.get(url, {child_id: childId, from: _from, to: _to}, userToken);
    }

    getAllByDate(_from, _to, userToken) {
        let url = '/schedule/list_children_schedules_range';
        return this.get(url, {from: _from, to: _to}, userToken);
    }

    create(body, userToken) {
        let url = '/schedule/create_edu_schedule';
        return this.post2(url, body, userToken);
    }

    update(body, userToken) {
        let url = '/timetable/setting/edit';
        return this.put(url, body, userToken);
    }

    updateSchedule(body, userToken) {
        let url = '/schedule/edit_edu_schedule';
        return this.put(url, body, userToken);
    }

    deleteSchedule(scheduleId, userToken) {
        let url = '/schedule/delete?id=' + scheduleId;
        return this.del(url, {}, userToken);
    }
}