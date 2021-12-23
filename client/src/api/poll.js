import { apiURL } from "./url";

export const getAllPolls = () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    return fetch(apiURL, requestOptions)
        .then((response) => response.json())
        .then(res => res.polls)
        .catch(() => alert("Failed to reach the server, Please try again later"));
};

export const createPoll = (title, Private, options) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "question": title,
        "public": !Private,
        "choices": options
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(apiURL + "/poll/createPoll", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
