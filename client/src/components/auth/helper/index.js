import {API} from "../../../backend";


export const signup = (user) => {
    return fetch(`${API}/signup`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};


export const signin = (user) => {
    return fetch(`${API}/signin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const authenticate = (data,next) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("authToken", JSON.stringify(data));
        next();
    }
}

export const signout = (next) => {
    if(typeof window !== "undefined"){
        localStorage.removeItem("authToken")
        next();
    }
};

export const isAuthenticated = () =>{
    if(typeof window == "undefined"){
        return false;
    }
    if(localStorage.getItem("authToken")){
        return JSON.parse(localStorage.getItem("authToken"));
    }else{
        return false;
    }
}

export const activateAccount = (token) => {
    return fetch(`${API}/activation`,{
        method: "POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(token)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const forgotPassword = (email) => {
    return fetch(`${API}/forgotpassword`,{
        method: "PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(email)
    })
    .then(response => response.json())
    .catch(err => console.log(err))
}

export const resetPassword = (data) => {
    return fetch(`${API}/resetpassword`,{
        method: "PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(err => console.log(err))
}

export const sendGoogleToken = (tokenId) => {
    const dataToSend = {
        idToken: tokenId
    }
    console.log(dataToSend)
    return fetch(`${API}/googlelogin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const sendFacebookToken = (userId, accessToken) => {
    const dataToSend = {
        userID: userId,
        accessToken: accessToken
    }
    //console.log(dataToSend)
    return fetch(`${API}/facebooklogin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .catch(err => console.log(err))
}