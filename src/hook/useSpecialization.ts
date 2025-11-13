import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'

const useSpecialization = () => {
    const { options, optionsGet, user, refresh, setRefresh } = useLogin()

    const getAllSpecialization = async () => {
        return await axios.get(`${apiCall.mainUrl}/specializations`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllSpecialization: ", error);
            console.log("error: ", error.response.data);
        })
    }

    const getSingleSpecialization = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/specializations/${id}`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getSingleSpecialization: ", error);
            console.log("error: ", error.response.data);
        })
    }

    const getAllPaginationSpecialization = async (limit: number) => {
        return await axios.get(`${apiCall.mainUrl}/specializations/pagination/limit?limit=${limit}`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllPaginationSpecialization: ", error);
            console.log("error: ", error.response.data);
        })
    }


    return { getAllSpecialization, getSingleSpecialization, getAllPaginationSpecialization }
}

export default useSpecialization
