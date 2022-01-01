const mongoose = require('mongoose')

before(async function () {
    mongoose.set('useFindAndModify', false);
    await mongoose.connection.dropDatabase();
});

after(function (done) {
    mongoose.connection.close().then(done);
})
