const mongoose = require('mongoose')

before(async function () {
    await mongoose.connection.dropDatabase();
});

after(function (done) {
    mongoose.connection.close().then(done);
})
