import { apiURL } from "./url";

export const getAllPolls = () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    // localhost:5000?page=2&searchBy=title/author&searchText=example


    return fetch(apiURL + '/pollFeed', requestOptions)
        .then((response) => response.json())
        .then(res => res.polls)
        .catch(() => alert("Failed to reach the server, Please try again later"));
};

/**
 * @param {number} pageNumber if not provided: default is page no 1
 * @param {string} searchBy accepted strings: title or author
 * @param {string} searchAttribute Text to be searched for
 * @return {Object} List of public polls that match the query, and total number of polls that match 
 */
export const getPolls = (searchBy, searchAttribute="", pageNumber = 1) => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };


    let url = apiURL + '/pollFeed' + `?pageNumber=${pageNumber}`

    if (searchBy)
        url += `&searchBy=${searchBy}&searchAttribute=${searchAttribute}`

    return fetch(url, requestOptions)
        .then((response) => response.json())
    .catch(() => alert("Failed to reach the server, Please try again later"));
};