
import { combineReducers } from 'redux';

import user from './userReducer';
import child from './childReducer';
import location from './locationReducer';
import nav from './navReducer';

export default combineReducers({
    user,
    child,
    location,
    nav
});
