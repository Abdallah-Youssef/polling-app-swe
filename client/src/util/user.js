export const getLoggedInUser = () => JSON.parse(localStorage.getItem("user"))

export const logInUser = (user) => localStorage.setItem("user", JSON.stringify(user))
export const logOutUser = () => localStorage.removeItem("user")

export const getIsLoggedIn = () => getLoggedInUser() !== null