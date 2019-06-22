import BaseService from '../libs/baseService';

export default class UserServices extends BaseService {

    getModelName() {
        return 'tuition'
    }

    getByMonth(_params, userToken) {
        let url = '/statistic/monthly_cost';
        return this.get(url, _params, userToken);
    }

    getByRange(_params, userToken) {
        let url = '/statistic/cost_between_dates';
        return this.get(url, _params, userToken);
    }

    getToPercentage(_params, userToken) {
        let url = '/statistic/child_schedule_percentage';
        return this.get(url, _params, userToken);
    }

}