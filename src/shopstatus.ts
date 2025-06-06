import { SHOP_SCHEDULE } from './schedule';

export function getShopStatus(): string {
    const now = new Date();
    const dayIndex = now.getDay(); // 0=Sun,...6=Sat
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];

    const todaySchedule = SHOP_SCHEDULE.find(s => s.day === currentDay);
    if (!todaySchedule) return 'Closed';

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openMinutes = timeToMinutes(todaySchedule.open);
    const closeMinutes = timeToMinutes(todaySchedule.close);

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return 'Open';
    } else {
        return 'Closed';
    }
}

function timeToMinutes(timeStr: string): number {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
}
