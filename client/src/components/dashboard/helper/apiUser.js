import {API} from "../../../backend"
import { isAuthenticated } from "../../auth/helper"

const {token,user} = isAuthenticated()

export const getCurrentUser = () => {
    return fetch(`${API}/user/${user._id}`,{
        method:"GET",
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}