import moment from 'moment';

const TimeFormate = (time: string) => {
    return moment(time, "HH:mm").format("hh:mm A") // Convert to 12-hour format};
}

export default TimeFormate