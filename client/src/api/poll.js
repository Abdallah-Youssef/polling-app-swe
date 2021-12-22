import { apiURL } from "./url";

export const getAllPolls = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(apiURL, requestOptions)
    .then((response) => response.json())
    .then(res => res.polls)
    .catch((error) => console.log("error", error));
};
