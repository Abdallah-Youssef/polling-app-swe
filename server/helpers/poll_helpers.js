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
                    //console.log(`vote is ${v}`); execPopulate is deprecated in mongoose 6.. my GOD
                    return {choice: v.choice, voter: v.user.display_name};
                }
                return {choice: v.choice};
            }));
    }
}