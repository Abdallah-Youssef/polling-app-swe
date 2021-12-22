/** I have created this module to ease testing */

const Vote = require('../models/vote_schema');

/** @param voteData a NORMAL javascript object containing the data NOT a Vote
 */
module.exports = async function(voteData){
    //console.log(voteData);
    const existingVote = await Vote.countDocuments({
        user: voteData.user, 
        poll: voteData.poll
    });
    //console.log(existingVote);

    if(existingVote !== 0){
        // console.log('Rejected vote');
        throw new Error('This user has already voted in this poll');
    }

    const saveVote = new Vote(voteData);
    //console.log(saveVote)
    //console.log('vote not rejected');

    await saveVote.save();
    //console.log(`This vote was saved: ${saveVote.isNew}`);
}