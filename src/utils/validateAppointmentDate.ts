import moment from 'moment';

const validateAppointmentDate = (appointmentDate: string) => {
    const appointment = moment(appointmentDate).startOf("day"); // Remove time part
    const today = moment().startOf("day"); // Get today's date without time

    if (appointment.isSameOrAfter(today)) {
        return true
    } else {
        return false
    }
}

export default validateAppointmentDate