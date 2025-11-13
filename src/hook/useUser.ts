import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useUser = () => {
    const { options, optionsGet, user, refresh, setRefresh } = useLogin()

    const getAllPatients = async () => {
        try {
            console.log("🌐 API Call: GET /users/patients")
            console.log("🔗 URL:", `${apiCall.mainUrl}/users/patients`)
            console.log("🔑 Headers:", optionsGet)
            
            const response = await axios.get(`${apiCall.mainUrl}/users/patients`, { headers: optionsGet })
            
            console.log("✅ API Response Status:", response.status)
            console.log("📦 Full Response Data:", JSON.stringify(response.data, null, 2))
            console.log("🎯 Result Data:", JSON.stringify(response?.data?.result, null, 2))
            
            return response?.data?.result || []
        } catch (error: any) {
            console.log("❌ API Error Details:")
            console.log("Status:", error?.response?.status)
            console.log("Error Data:", JSON.stringify(error?.response?.data, null, 2))
            console.log("Error Message:", error?.message)
            
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            showToast(backendMsg || "Unable to load patients")
            return []
        }
    }

    const getUserProfile = async () => {
        return await axios.get(`${apiCall.mainUrl}/users/profile/${user?._id}`, { headers: optionsGet }).then((response) => {
            // console.log("============================ response ============================");
            console.log("response: ", response.data);
            return response.data.result
        }).catch((error) => {
            console.log("error on getUserProfile: ", error);
            console.log("error: ", error.response.data);
            // role == "student" && showToast(error?.response?.data?.message || "Something went wrong!")
        })
    }

    const getDoctorDetails = async () => {
        try {
            const response = await axios.get(`${apiCall.mainUrl}/doctors/getProfile`, { headers: optionsGet })
            return response?.data?.result || null
        } catch (error: any) {
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            const statusCode = error?.response?.status
            if (statusCode === 404) {
                showToast(backendMsg || "Doctor not found!")
            } else {
                showToast(backendMsg || "Something went wrong!")
            }
            return null
        }
    }


    const getCenterUserProfile = async () => {
        return await axios.get(`${apiCall.mainUrl}/center/profile?centerId=${user?._id}`,).then((response) => {
            return response.data
        }).catch((error) => {
            console.log("error on getCenterUserProfile: ", error);
        })
    }

    const profileImageUpdate = async (image: any) => {
        const formData = new FormData();
        formData.append('image', { uri: image.path, type: image.mime, name: `${user?.name}.png`, });
        formData.append('id', user.id);
        return await axios.put(`${apiCall.mainUrl}/users/profile/update/${user?._id}`, formData, { headers: options }).then((response) => {
            setRefresh(!refresh)
            // console.log("============================ response ============================");
            // console.log("response: ", response.data);
            showToast(response?.data?.msg || "Profile image updated successfully!");
            return response.data
        }).catch((error: any) => {
            showToast(error.response?.data?.msg);
            console.log("error on profileImageUpload: ", error);
        })
    }

    const doctorProfileImageUpload = async (image: any) => {
        const formData = new FormData();
        formData.append('image', { uri: image.path, type: image.mime, name: `${user?.name}.png`, });
        formData.append('id', user.id);
        return await axios.put(`${apiCall.mainUrl}/users/profile/update/${user?._id}`, formData, { headers: options }).then((response) => {
            setRefresh(!refresh)
            // console.log("============================ response ============================");
            // console.log("response: ", response.data);
            showToast(response?.data?.msg || "Profile image updated successfully!");
            return response.data
        }).catch((error: any) => {
            showToast(error.response?.data?.msg);
            console.log("error on profileImageUpload: ", error);
        })
    }

    const updateProfile = async (name: string, email: string, address: string, mobile: any) => {
        return await axios.put(`${apiCall.mainUrl}/users/profile/${user?._id}`, { name, email, address, mobile }, { headers: optionsGet }).then((response) => {
            setRefresh(!refresh)
            // console.log("============================ response ============================");
            // console.log("response: ", response.data);
            showToast(response?.data?.msg || "Profile updated successfully!");
            return response.data
        }).catch((error: any) => {
            showToast(error.response?.data?.msg);
            console.log("error on updateProfile: ", error);
        })
    }

    return { getUserProfile, getCenterUserProfile, profileImageUpdate, updateProfile, getDoctorDetails, doctorProfileImageUpload, getAllPatients }
}

export default useUser