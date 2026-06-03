import axios from 'axios'
import { apiCall } from '../const/api'

const useSpecialization = () => {
    const headers = { "Content-Type": "application/json" }
    
    const getAllSpecialization = async () => {
        return await axios.get(`${apiCall.mainUrl}/specializations/getAll`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllSpecialization: ", error);
            console.log("error: ", error.response?.data);
        })
    }

    const getSingleSpecialization = async (id: string) => {
        return await axios.get(`${apiCall.mainUrl}/specializations/${id}`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getSingleSpecialization: ", error);
            console.log("error: ", error.response?.data);
        })
    }

    const getAllPaginationSpecialization = async (limit: number) => {
        return await axios.get(`${apiCall.mainUrl}/specializations/pagination/limit?limit=${limit}`, { headers }).then((response) => {
            return response.data.result
        }).catch((error) => {
            console.log("error on getAllPaginationSpecialization: ", error);
            console.log("error: ", error.response?.data);
        })
    }


    return { getAllSpecialization, getSingleSpecialization, getAllPaginationSpecialization }
}

export default useSpecialization
