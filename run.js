const cluster = require('express-cluster');
const app = require('./server.js');

activePort = process.env.PORT || 3000;

cluster((worker) => {
    app.listen(activePort, () => {
        console.log('worker ' + worker.id + ' is listening on port ' + activePort);
    });
}, {
    'respawn': true, // workers will restart on failure
    'verbose': true, // logs what happens to console
});
