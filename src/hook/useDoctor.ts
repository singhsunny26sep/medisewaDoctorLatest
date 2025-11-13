import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useDoctor = () => {
    const { options, optionsGet, user, getAuthHeaders} = useLogin()

    const getAllDoctors = async (id: string, type: string) => {
        // return await axios.get(`${apiCall.mainUrl}/doctors`, { headers: optionsGet }).then((response) => {
        return await axios.get(`${apiCall.mainUrl}/doctors/search/${id}?type=${type}`, { headers: optionsGet }).then((response) => {
            // console.log("doctor data: ", response.data);
            return response.data.result
        }).catch((error) => {
            console.error(error);
        });
    }

    const getSingleDoctor = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/doctors/${id}`, { headers: optionsGet }).then((response) => {
            return response.data
        }).catch((error) => {
            console.error(error);
        });
    }

    const updateDoctorProfile = async (doctor: any) => {
        // console.log("=============================== updateDoctorProfile ==========================================");
        // console.log("user: ", doctor);
        // console.log("address: ", doctor?.clinicaddress);
        // _id will be user id not doctor id
        // image, name, email, mobile, clinicMobile, gender, specialization, deparment, address, clinicaddress, dob, startTime, endTime, fee, oldFee, experience, before

        const formData = new FormData();
        if (doctor.image?.mime) formData.append('image', { uri: doctor?.image?.path, type: doctor?.image?.mime, name: `${doctor?.name}.png`, });
        formData.append('name', doctor?.name);
        formData.append('email', doctor?.email);
        formData.append('specialization', doctor?.specialization);
        formData.append('experience', doctor?.experience);
        formData.append('department', doctor?.deparment);
        formData.append('startTime', doctor?.startTime);
        formData.append('endTime', doctor?.endTime);
        formData.append('clinicAddress', doctor?.clinicaddress);
        formData.append('address', doctor?.address);
        formData.append('contactNumber', doctor?.mobile);
        formData.append('clinicContactNumber', doctor?.clinicMobile);
        formData.append('dob', doctor?.dob);
        formData.append('gender', doctor?.gender);
        formData.append('fee', doctor?.fee);
        formData.append('oldFee', doctor?.oldFee);
        formData.append('bookingBeforeTime', doctor?.before);
        // Backend expects `symptom`
        if (doctor?.symptoms) {
            // send as JSON array string; backend can parse or split as needed
            formData.append('symptom', JSON.stringify(doctor?.symptoms));
        }

        // console.log("formData: ", formData);

        // formData.append('id', doctor.id);
        return await axios.post(`${apiCall.mainUrl}/doctors/addProfile/${user?._id}`, formData, { headers: options }).then((response) => {

            showToast(response?.data?.msg || "Profile image updated successfully!");
            return response.data
        }).catch((error: any) => {
            showToast(error.response?.data?.msg);
            console.log("error on profileImageUpload: ", error);
            console.log("error on profileImageUpload: ", error?.response);
        })
    }

    const createLeave = async (doctorId: string, leaveData: any) => {
        console.log("Creating leave for doctor ID:", doctorId);
        console.log("Leave data:", leaveData);
        
        try {
            // ✅ Ab yeh properly kaam karega
            const headers = await getAuthHeaders();
            
            console.log("Request headers:", headers);
            console.log("API URL:", `${apiCall.mainUrl}/leaves/create/${doctorId}`);
            
            const response = await axios.post(
                `${apiCall.mainUrl}/leaves/create/${doctorId}`, 
                leaveData, 
                { headers }
            );
            
            console.log("Leave API response:", response.data);
            showToast(response?.data?.msg || "Leave created successfully!");
            return response.data;
        } catch (error: any) {
            console.error("Error creating leave:", error);
            console.error("Error response:", error?.response);
            
            const errorMessage = error.response?.data?.msg || 
                               error.response?.data?.message || 
                               "Failed to create leave";
            showToast(errorMessage);
            throw error;
        }
    }

    const createTimeSlot = async (doctorId: string, timeSlotData: any) => {
        console.log("Creating time slots for doctor ID:", doctorId);
        console.log("Time slot data:", timeSlotData);
        
        try {
            const headers = await getAuthHeaders();
            
            console.log("Request headers:", headers);
            console.log("API URL:", `${apiCall.mainUrl}/time-slots/create/${doctorId}`);
            
            const response = await axios.post(
                `${apiCall.mainUrl}/time-slots/create/${doctorId}`, 
                timeSlotData, 
                { headers }
            );
            
            console.log("Time Slot API response:", response.data);
            showToast(response?.data?.msg || "Time slots created successfully!");
            return response.data;
        } catch (error: any) {
            console.error("Error creating time slots:", error);
            console.error("Error response:", error?.response);
            
            const errorMessage = error.response?.data?.msg || 
                               error.response?.data?.message || 
                               "Failed to create time slots";
            showToast(errorMessage);
            throw error;
        }
    }


    return { getAllDoctors, getSingleDoctor, updateDoctorProfile,createLeave,createTimeSlot    }
}

export default useDoctor