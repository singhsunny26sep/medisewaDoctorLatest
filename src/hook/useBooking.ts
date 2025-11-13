import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useBooking = () => {
    const { options, optionsGet, user, } = useLogin()

    const getDoctorBookings = async (id: string, date: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/doctorBookings/${id}?date=${date}`, { headers: optionsGet }).then((response) => {
            // console.log("response: ", response.data);

            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);

            console.error(error);
        });
    }

    const getPatientBookings = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/patientBooking/patient/${id}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    }

    const addBooking = async (bookingData: any, id: any) => {
        return await axios.post(`${apiCall.mainUrl}/bookings/book/appointment/${id}`, bookingData, { headers: optionsGet }).then((response) => {
            // console.log("response: ", response?.data);
            showToast(response?.data?.msg || "Booking added successfully")
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            showToast(error?.response?.data?.msg || "Something went wrong")
            console.error(error);
        });
    }

    const cancleBooking = async (id: string | any) => {
        return await axios.put(`${apiCall.mainUrl}/bookings/cancel/booking/${id}`, {}, { headers: optionsGet }).then((response) => {
            showToast(response.data?.msg || "booking cancelled successfully")
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            showToast(error?.response?.data?.msg || "Something went wrong")
            console.error(error);
        });
    }

    const getBookingHistorybyDoctorId = async (patientId: string | any, doctorId: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/booking/history/${patientId}/${doctorId}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    }

    /* const getBookingByDoctorId = async () => {
        return await axios.get(`${apiCall.mainUrl}/bookings/doctor/allBooking`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    } */
    const getBookingByDoctorId = async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${apiCall.mainUrl}/bookings/doctor/allBooking?page=${page}&limit=${limit}`, {
                headers: optionsGet
            });
            return response.data;
        } catch (error: any) {
            console.log("error: ", error?.response?.data);
            console.error(error);
        }
    };
    return { getDoctorBookings, addBooking, getPatientBookings, cancleBooking, getBookingHistorybyDoctorId, getBookingByDoctorId }
}

export default useBooking