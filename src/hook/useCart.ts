import { View, Text } from 'react-native'
import React from 'react'
import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useCart = () => {
    const { options, optionsGet, user, } = useLogin()

    const getCartDoctors = async () => {
        return await axios.get(`${apiCall.mainUrl}/carts`, { headers: optionsGet }).then((response) => {
            // console.log("doctor data: ", response.data);
            return response.data.result
        }).catch((error) => {
            console.error(error);
        });
    }

    const addCartDoctor = async (id: string) => {
        //doctor id
        return await axios.post(`${apiCall.mainUrl}/carts/${id}`, { doctorId: id }, { headers: optionsGet }).then((response) => {
            // console.log("doctor data: ", response.data);
            showToast(response?.data?.msg || "Doctor added successfully")
            return response.data.result
        }).catch((error) => {
            // console.error(error);
            showToast(error?.response?.data?.msg || "Something went wrong")
        });
    }

    const removeCartDoctor = async (id: string) => {
        //id of cart
        return await axios.delete(`${apiCall.mainUrl}/carts/${id}`, { headers: optionsGet }).then((response) => {
            // console.log("doctor data: ", response.data);
            showToast(response?.data?.msg || "Doctor removed successfully")
            return response.data.result
        }).catch((error) => {
            console.error("removeCartDoctor: ", error);
            showToast(error?.response?.data?.msg || "Something went wrong")
        });
    }

    return { getCartDoctors, addCartDoctor, removeCartDoctor }
}

export default useCart