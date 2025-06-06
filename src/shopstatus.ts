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
        const { daysUntil, minutesUntil } = nextOpenInfo;
        const totalHours = (daysUntil * 24) + (minutesUntil / 60);
        const hoursFormatted = totalHours.toFixed(2);
        return `Closed. The shop will be open after ${hoursFormatted} Hrs`;
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

function findNextOpenTime(currentDayIndex: number, currentMinutes: number): { daysUntil: number; minutesUntil: number } | null {
    // Check next 7 days for shop open
    for (let offset = 0; offset < 7; offset++) {
        const checkDayIndex = (currentDayIndex + offset) % 7;
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][checkDayIndex];
        const schedule = SHOP_SCHEDULE.find(s => s.day === dayName);
        if (!schedule) continue;

        const openMinutes = timeToMinutes(schedule.open);
        if (offset === 0 && openMinutes <= currentMinutes) {
            // If today but open time already passed, ignore today
            continue;
        }

        // Found next open day
        const daysUntil = offset;
        let minutesUntil = openMinutes - currentMinutes;
        if (offset > 0) {
            minutesUntil = openMinutes + (24 * 60 * offset) - currentMinutes;
        }
        return { daysUntil, minutesUntil };
    }
    return null; // No schedule found in next 7 days
}
