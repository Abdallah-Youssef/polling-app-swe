import { apiURL } from "./url"

export const createAccount = (email, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ email, password });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(apiURL + "/userAuth/signup", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}


export const logIn = (email, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({email, password});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(apiURL + "/userAuth/login", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}



