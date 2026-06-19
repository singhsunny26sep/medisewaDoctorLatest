import { useCallback } from 'react'
import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useBooking = () => {
    const { optionsGet } = useLogin()

    const getDoctorBookings = useCallback(async (id: string, date: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/doctorBookings/${id}?date=${date}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    }, [optionsGet])

    const getPatientBookings = useCallback(async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/patientBooking/patient/${id}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    }, [optionsGet])

    const addBooking = useCallback(async (bookingData: any, id: any) => {
        return await axios.post(`${apiCall.mainUrl}/bookings/book/appointment/${id}`, bookingData, { headers: optionsGet }).then((response) => {
            showToast(response?.data?.msg || "Booking added successfully")
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            showToast(error?.response?.data?.msg || "Something went wrong")
            console.error(error);
        });
    }, [optionsGet])

    const cancleBooking = useCallback(async (id: string | any) => {
        return await axios.put(`${apiCall.mainUrl}/bookings/cancel/booking/${id}`, {}, { headers: optionsGet }).then((response) => {
            showToast(response.data?.msg || "booking cancelled successfully")
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            showToast(error?.response?.data?.msg || "Something went wrong")
            console.error(error);
        });
    }, [optionsGet])

    const getBookingHistorybyDoctorId = useCallback(async (patientId: string | any, doctorId: string) => {
        return await axios.get(`${apiCall.mainUrl}/bookings/booking/history/${patientId}/${doctorId}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error: ", error?.response?.data);
            console.error(error);
        });
    }, [optionsGet])

    const getBookingByDoctorId = useCallback(async (page = 1, limit = 10, doctorId?: string) => {
        const url = doctorId
            ? `${apiCall.mainUrl}/bookings/booking/doctor/${doctorId}?page=${page}&limit=${limit}`
            : `${apiCall.mainUrl}/bookings/booking/doctor/allBooking?page=${page}&limit=${limit}`;
        try {
            const response = await axios.get(url, {
                headers: optionsGet
            });
            if (__DEV__) {
                console.warn("📡 getBookingByDoctorId URL:", url);
                console.warn("📡 getBookingByDoctorId Response:", JSON.stringify(response.data, null, 2));
            }
            return response.data;
        } catch (error: any) {
            if (__DEV__) {
                console.warn("❌ getBookingByDoctorId URL:", url);
                console.warn("❌ getBookingByDoctorId Error:", error?.response?.data);
            }
            console.error(error);
        }
    }, [optionsGet])

    const getLabTestsByAppointmentId = useCallback(async (appointmentId: string) => {
        try {
            const url = `${apiCall.mainUrl}/labs/getByAppoinmentId/${appointmentId}`;
            const response = await axios.get(url, {
                headers: optionsGet
            });
            if (__DEV__) {
                console.warn("📡 getLabTestsByAppointmentId Response for", appointmentId, ":", JSON.stringify(response.data, null, 2));
            }
            return response.data;
        } catch (error: any) {
            if (__DEV__) {
                console.warn("❌ getLabTestsByAppointmentId Error:", error?.response?.data);
            }
            console.error(error);
            throw error;
        }
    }, [optionsGet])

    return { getDoctorBookings, addBooking, getPatientBookings, cancleBooking, getBookingHistorybyDoctorId, getBookingByDoctorId, getLabTestsByAppointmentId }
}

export default useBooking
