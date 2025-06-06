import { SHOP_SCHEDULE } from './schedule';

export function getShopStatus(): string {
    const now = new Date();
    const dayIndex = now.getDay(); // 0=Sun,...6=Sat
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];

    const todaySchedule = SHOP_SCHEDULE.find(s => s.day === currentDay);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (todaySchedule) {
        const openMinutes = timeToMinutes(todaySchedule.open);
        const closeMinutes = timeToMinutes(todaySchedule.close);

        if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
            // Shop is open: calculate time remaining to close
            const minutesLeft = closeMinutes - currentMinutes;
            const hoursLeft = (minutesLeft / 60).toFixed(2);
            return `Open, The shop will be closed within ${hoursLeft} Hrs`;
        }
    }

    // Shop is closed: find next open time
    const nextOpenInfo = findNextOpenTime(dayIndex, currentMinutes);
    if (nextOpenInfo) {
        const { totalMinutes } = nextOpenInfo;
        if (totalMinutes < 24 * 60) {
            // less than a day
            const hours = (totalMinutes / 60).toFixed(2);
            return `Shop is Currently Closed. and it will be open after ${hours} Hrs`;
        } else {
            // more than a day
            const days = Math.floor(totalMinutes / (24 * 60));
            const hours = ((totalMinutes % (24 * 60)) / 60).toFixed(2);
            return `Shop is Currently Closed. and it will be open after ${days} Day${days > 1 ? 's' : ''} and ${hours} Hrs`;
        }
    }

    return 'Closed'; // fallback
}

function timeToMinutes(timeStr: string): number {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

function findNextOpenTime(currentDayIndex: number, currentMinutes: number): { totalMinutes: number } | null {
    for (let offset = 0; offset < 7; offset++) {
        const checkDayIndex = (currentDayIndex + offset) % 7;
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][checkDayIndex];
        const schedule = SHOP_SCHEDULE.find(s => s.day === dayName);
        if (!schedule) continue;

        const openMinutes = timeToMinutes(schedule.open);
        if (offset === 0 && openMinutes <= currentMinutes) {
            continue;
        }

        // Calculate total minutes until next open
        const totalMinutes = openMinutes + offset * 24 * 60 - currentMinutes;
        return { totalMinutes };
    }
    return null;
}
