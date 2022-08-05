
// setup express server
var express  = require('express');
// var MNSClient = require('mns');
// var fs       = require('fs');
var app      = express();


// // load MNS config
// mns_config = JSON.parse(fs.readFileSync(__dirname + '/config/ali-config.json','utf8'));

// // load and override endpoints (if config file exists)
// var configFile = null
// try {
//     configFile = fs.readFileSync(__dirname + '/config/ali-override.json','utf8');
// } catch (err) {
//     if (err.code === 'ENOENT') {
//         console.log("No local AliCloud endpoint config found, using dafault routing to AliCloud")
//     } else {
//         throw(err)
//     }
// }

// const mns = new MNSClient(mns_config.accountid, {
//     region: mns_config.region,
//     accessKeyId: mns_config.accessKeyId,
//     accessKeySecret: mns_config.accessKeySecret,// optional & default
//     secure: mns_config.secure, // use https or http
//     internal: mns_config.internal, // use internal endpoint
//     vpc: mns_config.vpc // use vpc endpoint
//  });
    

var ui = {
    menuitem: 1,
    data: [],
    def_snsname: '',
    def_snsarn: '',
    def_sqsname: '',
    def_sqsurl: '',
    def_sqsar: '',
    def_subarn: '',
    def_msghandle: ''
}


var topicController = require('./controllers/topicController')
var queueController = require('./controllers/queueController')

topicController(app, ui);
queueController(app, ui);


// server listen port - can be overriden by an environment variable
var port = process.env.PORT || 3000

// configure assets and views
app.use('/assets', express.static(__dirname+'/public'))
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs')


// login and serve up index
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./index', {ui: ui})
})


// Start server.
app.listen(port)
console.log('AliCloud MNS test server listening on port', port);
console.log('Localhost URL:', 'http://localhost:'+port);





