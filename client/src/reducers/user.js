import React from "react";
import { logIn, createAccount, loginWithFacebook } from "../api/user";

export const CLEAR_USER = "CLEAR_USER";
export const SET_USER = "SET_USER";

export const clearUser = () => ({ type: CLEAR_USER });

export const setUser = (id, email) => ({
    type: SET_USER,
    user: { id, email },
});

export const handleLogOut = () => {
    return (dispatch) => {
        dispatch(clearUser());
        localStorage.removeItem("token");
    };
};

export const handleLogIn = (email, password) => async (dispatch) => {
    const res = await logIn(email, password);

    if (res) {
        if (res.error) 
            throw new Error(res.error)
    
        dispatch(setUser(res.user.id, email));
        localStorage.setItem("token", res.token);
    }

    else throw new Error('Login failed')
};

export const handleSignUp = (email, password) => async (dispatch) => {
    const res = await createAccount(email, password);
 

    if (res) {
        if (res.error) 
            throw new Error(res.error)
        dispatch(setUser(res.user.id, email));
        localStorage.setItem("token", res.token);
    }

    else throw new Error('Sign Up Failed')
};


export const handleFacebookAuth = () => async (dispatch) => {
    const res = await loginWithFacebook();
 

    if (res) {
        if (res.error) 
            throw new Error(res.error)
        dispatch(setUser(res.user.id, res.user.email));
        localStorage.setItem("token", res.token);
    }

    else throw new Error('Sign Up Failed')
};


export const userReducer = (user, action) => {
    switch (action.type) {
        case CLEAR_USER:
            return {};

        case SET_USER:
            return action.user;

        default:
            return {};
    }
};

export const UserContext = React.createContext();
