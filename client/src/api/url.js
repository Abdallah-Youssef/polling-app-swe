export const apiURL = "http://localhost:5000"

/**
 * 
 * @param {string} url 
 * @returns {boolean} true if the url doesn't need an "Authorization" header
 */
export const nonAuthenticatedURL = (url) => {
    if (url.startsWith(apiURL + "/userAuth")) return true

    if (url === apiURL || url === apiURL+'/') return true

    return false
}