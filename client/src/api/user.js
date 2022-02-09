import { apiURL } from "./url";

export const createAccount = (email, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ email, password });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    return fetch(apiURL + "/userAuth/signup", requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
};

export const loginWithFacebook = () => {
    console.log(window.open(apiURL + "/userAuth/oauth/facebook"))
    // .then((response) => response.json())
    // .catch((error) => console.log("error", error));
};

export const logIn = (email, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ email, password });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    return fetch(apiURL + "/userAuth/login", requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
};

export const getMyPolls = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
    };

    return fetch(apiURL + "/user/polls", requestOptions)
        .then((response) => response.json())
        .catch(() => alert("Failed to reach the server, Please try again later"));
};

/**
 *
 * @param {String} userId
 * @return {User} user
 */
export const getUserInfo = (userId) => {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    return fetch(apiURL + "/user/" + userId, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
};


export const updateUserInfo = (displayName, bio, color, age, gender) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
        method: 'POST',
        body: JSON.stringify({display_name: displayName, bio, color, age, gender}),
        headers: myHeaders,
        redirect: 'follow',
    };

    return fetch(apiURL + "/user/updateinfo", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}