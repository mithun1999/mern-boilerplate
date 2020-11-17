const { AUTH_USER } = require("./types")

export const setAuthUser = (user) => {
    return{
        type: AUTH_USER,
        payload: user
    }
}