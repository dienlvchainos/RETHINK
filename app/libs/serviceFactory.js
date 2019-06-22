import UserService from '../services/userServices';
import AuthService from '../services/authServices';
import ChildService from '../services/childServices';
import EducationService from '../services/educationServices';
import TimetableService from '../services/timetableServices';
import ScheduleService from '../services/scheduleServices';
import CalendarService from '../services/calendarServices';
import TuitionService from '../services/tuitionServices';

const SERVICES = {
    UserService,
    AuthService,
    ChildService,
    EducationService,
    TimetableService,
    ScheduleService,
    CalendarService,
    TuitionService
};

const instances = {};

export default class ServiceFactory {

    static getServices(classname) {
        let ServiceClass = SERVICES[classname];
        if (!ServiceClass) {
            throw new Error('Invalid request class name: ' + classname);
        }

        let serviceInstance = instances[classname];
        if (!serviceInstance) {
            serviceInstance = new ServiceClass();
            instances[classname] = serviceInstance;
        }

        return serviceInstance;
    }

}
