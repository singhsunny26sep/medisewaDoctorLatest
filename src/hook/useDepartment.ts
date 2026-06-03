import { apiCall } from '../const/api'
import axios from 'axios'

const useDepartment = () => {
    const headers = { "Content-Type": "application/json" }
    
    const getAllDepartments = async () => {
        return await axios.get(`${apiCall.mainUrl}/departments/pagination`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllDepartments: ", error);
            console.log("error: ", error.response?.data);
        })
    }

    const getSingleDeprtment = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/departments/${id}`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getSingleDeprtment: ", error);
            console.log("error: ", error.response?.data);
        })
    }

    const getAllPagination = async (limit: number) => {
        return await axios.get(`${apiCall.mainUrl}/departments/pagination/limit?limit=${limit}`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllPagination: ", error);
            console.log("error: ", error.response?.data);
        })
    }


    return { getAllDepartments, getSingleDeprtment, getAllPagination }
}

export default useDepartment