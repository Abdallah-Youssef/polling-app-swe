const mongoose = require('mongoose')


before(async function(){
    mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.once('open', function(){
        console.log('connected..\n');
    }).on('error', function(error){
        console.log('Connection error:', error);
        //done();
    });

    await mongoose.connection.dropDatabase();
    //done();
});

after(function(done){
    mongoose.connection.close().then(done);
})
