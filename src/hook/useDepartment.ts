import { View, Text } from 'react-native'
import React from 'react'
import { useLogin } from '../context/LoginProvider'
import { apiCall } from '../const/api'
import axios from 'axios'

const useDepartment = () => {
    const { options, optionsGet, user, refresh, setRefresh } = useLogin()
    const getAllDepartments = async () => {
        return await axios.get(`${apiCall.mainUrl}/departments`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllDepartments: ", error);
            console.log("error: ", error.response.data);
        })
    }

    const getSingleDeprtment = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/departments/${id}`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getSingleDeprtment: ", error);
            console.log("error: ", error.response.data);
        })
    }

    const getAllPagination = async (limit: number) => {
        return await axios.get(`${apiCall.mainUrl}/departments/pagination/limit?limit=${limit}`, { headers: optionsGet }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllPagination: ", error);
            console.log("error: ", error.response.data);
        })
    }


    return { getAllDepartments, getSingleDeprtment, getAllPagination }
}

export default useDepartment