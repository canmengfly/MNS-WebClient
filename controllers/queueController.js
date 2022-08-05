// AWS test mnsqueue controller / API 

var MNSClient = require('mns');
var fs       = require('fs');
// load MNS config
mns_config = JSON.parse(fs.readFileSync(__dirname + '/ali-config.json','utf8'));
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
    
   
    // 1. create Queue 
    app.post('/mnsqueue-queue', async function (req, res) {

        ui.menuitem = 1
        // res.send('Got a POST request')
        // client.createQueue('test-queue2');
        var qParams = {
            queuename: req.body.queuename
        }
        mnsq = await mns.createQueue(qParams.queuename)
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
        //         // default prepop
        ui.def_mnsqueuename = req.body.queuename
        ui.def_mnsqueueurl = mnsq
        res.render('./index', {ui: ui})

    })


    // 2. list all queues (no input required)
    app.get('/mnsqueue-queue/list', async function (req, res){

        ui.menuitem = 2
    
        mnsq = await mns.listQueue()
        ui.data[ui.menuitem] ='处理结果:\n\n' + JSON.stringify(mnsq)
        //         // default prepop
        // ui.def_mnsqueuename = req.body.queuename
        // ui.def_mnsqueueurl = mnsq
        res.render('./index', {ui: ui})

        
    })



    



    // 3. get Queue Attributes. input = queue URL
    app.get('/mnsqueue-queue/attributes', async function (req, res,next) {

        ui.menuitem = 3
        var qParams = req.query.queuename
        // console.log(qParams);
        mnsq = await mns.getQueueAttributes(qParams)

        if (mnsq.code >= 200 && mnsq.code < 300) {
            ui.data[ui.menuitem] ='处理结果:\n\n' + JSON.stringify(mnsq)
            ui.def_mnsqueuename = req.query.queuename
            } else {
                ui.data[ui.menuitem] = '(500) Get Queue Attributes Error:\n\n' + JSON.stringify(mnsq)
            }

        // ui.def_mnsqueueurl = mnsq
        res.render('./index', {ui: ui})

       
    })

    
    
    // 4. post message to queue. input = queue URL and message
    app.post ('/mnsqueue-queue/message', async function (req, res) {

        ui.menuitem = 4

        var qParams = {
            queuemessage: req.body.message,
            queueName: req.body.queuename
            }   

        mnsq = await mns.sendMessage(qParams.queueName, {
            MessageBody: qParams.queueName
          });
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
        ui.def_mnsqueuename = req.body.queuename
        ui.def_message = req.body.message
        res.render('./index', {ui: ui})

        
    })


    // 5. receive (get) message. input = queue URL
    app.get('/mnsqueue-queue/message', async function (req, res) {

        ui.menuitem = 5

        var qParams = {
            queueName: req.query.queuename,
            VisibilityTimeout: 10 // 1 min wait time for anyone else to process / lock
        }

        mnsq = await mns.receiveMessage(qParams.queueName, qParams.VisibilityTimeout)
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
        ui.def_mnsqueuename = req.query.queuename
        // ui.def_message = req.body.message
        res.render('./index', {ui: ui})
        
        
    })


    // 6. delete message from queue
    app.post('/mnsqueue-queue/message/delete', async function (req, res) {

        ui.menuitem = 6

        var qParams = {
            queueName: req.body.queuename,
            ReceiptHandle: req.body.messagehandle
        }

        mnsq = await mns.deleteMessage(qParams.queueName, qParams.ReceiptHandle)
        ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
        ui.def_mnsqueuename = req.query.queuename
        ui.def_msghandle = req.body.messagehandle
        res.render('./index', {ui: ui})

        
       
    });




    // 7. delete queue - dangerzone
    app.post('/mnsqueue-queue/delete', async function (req, res) {
       
        ui.menuitem = 7
        
            var qParams = {
                queueName: req.body.queuename,
            }
    
            // const res = await client.deleteQueue(queueName);

            mnsq = await mns.deleteQueue(qParams.queueName)
            ui.data[ui.menuitem] ='返回结果:\n\n' + JSON.stringify(mnsq)
            ui.def_mnsqueuename = req.body.queuename
            // ui.def_msghandle = req.body.messagehandle
            res.render('./index', {ui: ui})    
            
    })


    

// err uncaughtException
    process.on('uncaughtException', function (err) {
        console.log(err);
        console.log(err.stack)
      });
}


