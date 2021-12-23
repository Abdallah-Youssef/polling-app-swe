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
