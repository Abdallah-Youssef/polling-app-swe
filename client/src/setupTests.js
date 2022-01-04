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

// Mock localStorage
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


// Mock naviagtor
Object.assign(navigator, {
    clipboard: {
        writeText: () => { },
    },
});


// Mock user store and reducer
export let mockUserState = {}
export const mockUserDispatch = (action) => mockUserState = userReducer(mockUserState, action)

export const Enviroment = ({ element }) => {
    return (
        <BrowserRouter>
            <UserContext.Provider value={{ user: mockUserState, dispatch: mockUserDispatch }}>
                {element}
            </UserContext.Provider>
        </BrowserRouter>
    )
}



export const mockPollData = {
    "polls": [
        {
            "public": true,
            "choices": [
                "Yes",
                "No"
            ],
            "_id": "61c39a59aee6623b60ddd68a",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-22T21:36:25.310Z",
            "question": "How is it?",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "Option 1",
                "Option 2"
            ],
            "_id": "61c4bbfe4e3b9f4b14fc6212",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-23T18:12:14.216Z",
            "question": "Poll",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "Option 1",
                "Option 2"
            ],
            "_id": "61c4be97db8b674ec4394715",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-23T18:23:19.385Z",
            "question": "New Poll",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "First",
                "Second"
            ],
            "_id": "61c4bee7db8b674ec439471e",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-23T18:24:39.149Z",
            "question": "Please work",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "Second",
                "Sceond",
                "",
                ""
            ],
            "_id": "61c4c1e7db8b674ec4394729",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-23T18:37:27.785Z",
            "question": "Lol",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "Option 1",
                "Option 2"
            ],
            "_id": "61c4cd0f1227864bb8b6a478",
            "postedBy": {
                "local": {
                    "email": "adel@shakal.com"
                },
                "_id": "61c212e078743f401426e042"
            },
            "createdOn": "2021-12-23T19:25:03.537Z",
            "question": "Private test",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "ob7",
                "tt7"
            ],
            "_id": "61c51768ee3cd68ce7c6c59f",
            "postedBy": {
                "local": {
                    "email": "omar@shakal.com"
                },
                "_id": "61c4f56332afee581cf6e37e"
            },
            "createdOn": "2021-12-24T00:42:16.794Z",
            "question": "some Poll",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "1",
                "2",
                "3"
            ],
            "_id": "61c517bd9141618d9cb31003",
            "postedBy": {
                "local": {
                    "email": "moaz@shakal.com"
                },
                "_id": "61c39e8b3bd1ad5f1a79831c"
            },
            "createdOn": "2021-12-24T00:43:41.138Z",
            "question": "new question?",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "1",
                "2",
                "3"
            ],
            "_id": "61c517db9141618d9cb31006",
            "postedBy": {
                "local": {
                    "email": "moaz@shakal.com"
                },
                "_id": "61c39e8b3bd1ad5f1a79831c"
            },
            "createdOn": "2021-12-24T00:44:11.962Z",
            "question": "extra q",
            "__v": 0
        },
        {
            "public": true,
            "choices": [
                "Yes",
                "No"
            ],
            "_id": "61c51ef37bcb9ca1f4667567",
            "postedBy": {
                "local": {
                    "email": "moaz@shakal.com"
                },
                "_id": "61c39e8b3bd1ad5f1a79831c"
            },
            "createdOn": "2021-12-24T01:14:27.638Z",
            "question": "ok?",
            "__v": 0
        }
    ],
    "count": 18
}