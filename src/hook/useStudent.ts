import { View, Text } from 'react-native'
import React from 'react'
import { useLogin } from '../context/LoginProvider'
import axios from 'axios'
import { apiCall } from '../const/api'
import showToast from '../utils/ShowToast'

const useStudent = () => {
    const { options, optionsGet, studentId } = useLogin()

    const getCertificate = async () => {
        return await axios.get(`${apiCall.mainUrl}/student/Certificate?studentId=${studentId}`).then((response) => {
            // return await axios.get(`${apiCall.mainUrl}/student/Certificate?studentId=12952`).then((response) => {
            // console.log("response: ", response?.data);
            return response.data
        }).catch((error: any) => {
            console.log("error: ", error);
            // console.log("error: ", error?.response?.data);
            // showToast(error?.response?.data?.Message || "Error getting certificate. Please try again later.")
        })
    }

    const getResult = async () => {
        return await axios.get(`${apiCall.mainUrl}/student/Marksheets?studentId=${studentId}`).then((response) => {
            // return await axios.get(`${apiCall.mainUrl}/student/Marksheets?studentId=18404`).then((response) => {
            // console.log("response: ", response?.data);
            return response.data
        }).catch((error: any) => {
            console.log("error: ", error);
            // console.log("error: ", error?.response?.data);
            // showToast(error?.response?.data?.Message || "Error getting certificate. Please try again later.")
        })
    }


    const getExam = async () => {
        return await axios.get(`${apiCall.mainUrl}/student/exam-status?studentId=${studentId}`).then((response) => {
            // return await axios.get(`${apiCall.mainUrl}/student/exam-status?studentId=8007`).then((response) => {
            // console.log("response: ", response?.data);
            return response.data
        }).catch((error: any) => {
            console.log("error: ", error);
            // console.log("error: ", error?.response?.data);
            // showToast(error?.response?.data?.Message || "Error getting exam. Please try again later.")
        })
    }

    const getStudentResults = async () => {
        // console.log("student: ", studentId);
        // console.log("========================= calling getStudentResults =====================");
        return await axios.get(`${apiCall.mainUrl}/student/GetStudentResults?studentId=${studentId}`).then((response) => {
            // return await axios.get(`${apiCall.mainUrl}/student/GetStudentResults?studentId=14902`).then((response) => {
            // console.log("response: ", response?.data);
            return response.data
        }).catch((error: any) => {
            console.log("error: ", error);
            // console.log("error: ", error?.response?.data);
            // showToast(error?.response?.data?.Message || "Error getting student result. Please try again later.")
        })
    }

    return { getCertificate, getResult, getExam, getStudentResults }
}

export default useStudent