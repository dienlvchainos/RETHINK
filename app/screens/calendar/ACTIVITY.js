export default class Activity {
    constructor(activity_id, child_id, edu_id, end_at, id, location, start_at, name, notification=1, notification_repeat='none', note, color='#000', activity_sync_id) {
        this.activity_id = activity_id || '';
        this.childId = child_id || '';
        this.edu_id = edu_id || null;
        this.end_at = end_at || '';
        this.id = id || null;
        this.location = location || '';
        this.start_at = start_at || '';
        this.name = name || '';
        this.notification = notification;
        this.notification_repeat = notification_repeat,
        this.note = note || '',
        this.color = color,
        this.activity_sync_id = activity_sync_id
    }
}