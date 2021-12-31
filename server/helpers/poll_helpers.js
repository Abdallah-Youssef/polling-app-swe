const Vote = require('../models/vote_schema')
const Poll = require('../models/poll_schema')

module.exports = {
    /**
     * @param  votes array of Vote docs
     * @returns promise of public vote details
     */
    getResults: async function(votes){
        return Promise.all(
            votes.map(async (v) => {
                if (v.public){
                    await v.populate('user', 'display_name').execPopulate();
                    return {choice: v.choice, voter: v.user.display_name};
                }
                return {choice: v.choice};
            }));
    },

    /**
     * @param {Array.<Poll>} polls
     * @param {number} pageNumber 
     * @param {number} pollCount number of polls in a page
     * @return {Array.<Poll>} Return pollCount polls of this page
     */
    paginate: function(polls, pageNumber, pollCount = 10){
        if (pageNumber <= 0){
            console.error("Invalid page number :" + pageNumber)
            return []
        }

        if (pollCount <= 0){
            console.error("Invalid pollCount :" + pollCount)
            return []
        }

        return polls.slice((pageNumber - 1) * pollCount, pageNumber * pollCount)
    },

    
}