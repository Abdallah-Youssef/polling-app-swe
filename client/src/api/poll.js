import { apiURL } from "./url";


export const getPoll = (pollId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"))

    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders
    };

    return fetch(apiURL + "/polls/" + pollId, requestOptions)
        .then((response) => response.json())
        .catch(() => alert("Failed to reach the server, Please try again later"));
};


export const submitChoice = (pollId, choiceIndex, isPublic) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"))
    myHeaders.append("Content-Type", "application/json");


    var raw = JSON.stringify(
        {
            "poll": pollId,
            "choice": choiceIndex,
            "public": isPublic,
        }

    );

  var requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: myHeaders,
    body: raw
  };

  return fetch(apiURL + "/votes/submit", requestOptions) 
    .then(async (response) => {
      let statusObject = await response.json();
      console.log(statusObject)
      return statusObject.status === "successVote"
    })
    .catch(() => alert("Failed to reach the server, Please try again later"));
};

/**
 * 
 * @param {string} title 
 * @param {boolean} Private 
 * @param {Array.<string>} options 
 * @returns on success, id of the created poll
 */
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

    return fetch(apiURL + "/polls/create", requestOptions)
        .then(response => response.json())
        .then(result => result.id)
        .catch(error => console.log('error', error));
}

/**
 * 
 * @param {string} userId 
 * @returns {Poll[]} on success, array of polls posted by userId
 */
export const getUserPolls = (userId) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(apiURL + `/user/polls/${userId}`, requestOptions)
        .then(response => response.json())
        .catch(error => alert(error));
}