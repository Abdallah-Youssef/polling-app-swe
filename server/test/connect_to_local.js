const mongoose = require('mongoose')


before(function(done){
    mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.once('open', function(){
        console.log('connected..\n');
        /*(async function(){
            await mongoose.connection.collections.votes.drop();
            await mongoose.connection.collections.users.drop();
            await mongoose.connection.collections.polls.drop();
        })().then(done);*/
        done();
    }).on('error', function(error){
        console.log('Connection error:', error);
    });
});

after(function(done){
    mongoose.connection.close().then(done);
})
