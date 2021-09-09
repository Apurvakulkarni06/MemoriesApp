import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';
export const signIn = (formData, history) => async(dispatch) =>{

    try {
        // api call for login
        const { data } = await  api.signIn(formData)
        dispatch({ type: AUTH, data})
        history.push("/") // redirect the user after api call
    } catch (error) {
        console.log(error)
    }
}

export const signUp = (formData, history) => async(dispatch) =>{

    try {
        // api call for sign up 
        const { data } = await  api.signUp(formData)
        dispatch({ type: AUTH, data})
        history.push("/") // redirect the user after api call
    } catch (error) {
        console.log(error)
    }
}