// AWS test topic controller / API 
var MNSClient = require('mns');
var fs       = require('fs');
// // load MNS config
mns_config = JSON.parse(fs.readFileSync(__dirname + '/ali-config.json','utf8'));
// console.log(mns_config,mns_config.accountid,mns_config.region);
const mns = new MNSClient(mns_config.accountid, {
    region: mns_config.region,
    accessKeyId: mns_config.accessKeyId,
    accessKeySecret: mns_config.accessKeySecret,// optional & default
    secure: false, // use https or http
    internal: false, // use internal endpoint
    vpc: false // use vpc endpoint
 });

module.exports = function ( app, ui) {
    

    // setup bodyparser
    var bodyParser = require('body-parser');
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
   

    // 8. create Topic - input = topic name
    app.post('/topic', async function (req, res) {

        ui.menuitem = 8

        var tParams = {
            mnstopic: req.body.mnstopic
        }
        // res.send('Got a POST request')
        // client.createQueue('test-queue2');
        mnst = await mns.createTopic(tParams.mnstopic)
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnst)
        //         // default prepop
        ui.def_topicname = req.body.mnstopic
        // ui.def_sqsurl = mnsq
        res.render('./index', {ui: ui})

    
    })



    // 9. Send message to topic topics
    app.post('/topic/message', async function (req, res) {

        ui.menuitem = 9

        var tParams = {
            topicmessage: req.body.topicmessage,
            mnstopic: req.body.mnstopic
        }


        mnsq = await mns.publishMessage(tParams.mnstopic, {
            MessageBody: tParams.topicmessage
          });

        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
        ui.def_mnstopic = req.body.mnstopic
        // ui.def_message = req.body.message
        res.render('./index', {ui: ui})
 
    })



    // 10. List topic topics
    app.get('/topic', async function (req, res) {

        ui.menuitem = 10
        var tParams = {
            mnstopic: req.body.mnstopic
        }
        // res.send('Got a POST request')
        // client.createQueue('test-queue2');
        mnst = await mns.listTopic()
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnst)
        //         // default prepop
        ui.def_topicname = req.body.mnstopic
        // ui.def_sqsurl = mnsq
        res.render('./index', {ui: ui})
        
        //res.render('./index', {ui: ui})
    })




    // 11. List Get Attributes
    app.get('/topic/attributes', async function  (req, res) {

        ui.menuitem = 11

        var tParams = {
            mnstopic: req.query.mnstopic
        }
        // res.send('Got a POST request')
        // client.createQueue('test-queue2');
        mnst = await mns.getTopicAttributes(tParams.mnstopic)
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnst)
        //         // default prepop
        ui.def_topicname = req.query.mnstopic
        // ui.def_sqsurl = mnsq
        res.render('./index', {ui: ui})

    })

    // err uncaughtException
    process.on('uncaughtException', function (err) {
        console.log(err);
        console.log(err.stack)
      });
    
 }