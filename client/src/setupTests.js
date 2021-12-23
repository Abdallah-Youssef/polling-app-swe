// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import { useReducer } from 'react';
import { userReducer } from './reducers/user';
import { UserContext } from './reducers/user';

var localStorageMock = (function () {
    let store = {};

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key]
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});


export let mockUserState = {}
export const mockUserDispatch = (action) => mockUserState = userReducer(mockUserState, action)

export const Enviroment = ({element}) => {
    return (
        <BrowserRouter>
            <UserContext.Provider value={{ user: mockUserState, dispatch: mockUserDispatch }}>
                {element}
            </UserContext.Provider>
        </BrowserRouter>
    )
}