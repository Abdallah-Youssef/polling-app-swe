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

/**
 * 
 * @param {string} pollId 
 * @param {Number} choiceIndex 
 * @param {Boolean} isPublic whether the user allows his name 
 * to be shown to the public with the vote
 * @param {Boolean} changing has the user already voted and wants to change the vote?
 * @returns on success, true
 */
export const submitChoice = (pollId, choiceIndex, isPublic, changing) => {
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

  let path = "/votes";
  if (changing)
    path += "/change";
  else
    path += "/submit";

  return fetch(apiURL + path, requestOptions) 
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
export const createPoll = (title, Private, options, Photo) => {

    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //     "question": title,
    //     "public": !Private,
    //     "choices": options
    // });

    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "multipart/form-data");

    let formData = new FormData();
    formData.append('question', title);
    formData.append('public', !Private);
    formData.append('choices', options);
    formData.append('photo', Photo);

    // var raw = JSON.stringify({
    //     "question": title,
    //     "public": !Private,
    //     "choices": options
    // });


    var requestOptions = {
        method: 'POST',
        // headers: myHeaders,
        body: formData,
        redirect: 'follow'
    };

    return fetch(apiURL + "/polls/create", requestOptions)
        .then(response => response.json())
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


/**
 * 
 * @param {string} pollId
 * @returns Array of prefix arrays
 */
export const getInsights = (pollId) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(apiURL + "/polls/"+pollId+"/insights", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

export const closePoll = (pollId) => {
    var requestOptions = {
        method: 'GET',
    };
    
    return fetch(apiURL + "/polls/"+pollId+"/close", requestOptions)
        .then(response => {
            return response.text()
        })
        .catch(error => console.log('error', error));
}