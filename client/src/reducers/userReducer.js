import { AUTH_USER, SIGNIN_USER } from "../actions/types"

const userReducer = (state={}, action) => {
    switch(action.type){
        case SIGNIN_USER:
            return {...state, loginSucess: action.payload}
        case AUTH_USER:
            return {...state, authUser: action.payload}
        default:
            return state
    }
}

export default userReducer