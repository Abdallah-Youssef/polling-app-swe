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

  return fetch(apiURL + "/vote/submit", requestOptions) 
    .then(async (response) => {
      let statusObject = await response.json();
      console.log(statusObject)
      return statusObject.status === "successVote"
    })
    .catch(() => alert("Failed to reach the server, Please try again later"));
};

