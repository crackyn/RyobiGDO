// Project Name: Ryobi GDO Proxy for Node.js
// Version: 2.5
// Author: Justin Dybedahl
//
// https://github.com/Madj42/RyobiGDO/
//


const http = require('http')
const url = require('url')
var WebSocket = require('ws')
const port = 3042

const requestHandler = (request, response) => {
const queryData = url.parse(request.url, true).query;
        response.writeHead(200, {"Content-Type": "text/plain"});
        var reqip = request.connection.remoteAddress.split(':')
//        if (reqip[3] !== 'x.x.x.x') {
//        response.end('Not Authorized')
//        }
//console.log(request.url)
        if (queryData.name == 'lighton') {
                var cmd = 'lightState'
//                var cmdstate = 'true'
                var cmdtype = 0
        } else if (queryData.name == 'lightoff') {
                var cmd = 'lightState'
//                var cmdstate = 'false'
                var cmdtype = 0
        } else if (queryData.name == 'dooropen') {
                var cmd = 'doorCommand'
//                var cmdstate = '1'
                var cmdtype = 0
        } else if (queryData.name == 'doorclose') {
                var cmd = 'doorCommand'
//                var cmdstate = '0'
                var cmdtype = 0
        } else if (queryData.name == 'status') {
                var cmd = 'status'
                var cmdtype = 1
        } else {
                response.end('Not valid command!');
        }

        if (queryData.name == null) {
                response.end('No name specified');
        } else if (queryData.email == null) {
                response.end('No email specified');
        } else if (queryData.pass == null) {
                response.end('No password specified');
        }
//              var cleanpass = queryData.pass.replace(/[<>+\/'"*()?]/g, "\\$&");
        var cleanpass = queryData.pass
        var request = require('request');
                const getAPIKey = () => new Promise((resolve, reject) => {
                        var options = {url:'https://tti.tiwiconnect.com/api/login',method:'POST',json:JSON.parse('{"username":"' + queryData.email + '","password":"' + cleanpass + '"}')}
                                request(options, (err, res, body) => {
                                if (err) return reject(err)
                                        resolve(body)
                                })
                })

                const getAPIKeyController = async function() {
                        var someValue = await getAPIKey()
                                var apikey = someValue.result.auth.apiKey

                            const getDoorID = () => new Promise((resolve, reject) => {
                                        var options = {url:'https://tti.tiwiconnect.com/api/devices'' + door_id + '',method:'GET',json:JSON.parse('{"username":"' + queryData.email + '","password":"' + cleanpass + '"}')}
                                                request(options, (err, res, body) => {
                                                if (err) return reject(err)
                                                resolve(body)
                                        })
                                })

                                const getDoorIDController = async function() {
                                        var someValue = await getDoorID()
                                        //console.log(someValue.result[0].varName)
                                                                                var deviceModel = someValue.result[0].deviceTypeIds
                        //                                                      console.log(deviceModel)
                                                                                if (queryData.doorid == null) {
                                                                                        if (deviceModel == 'gda500hub') {
                                                                                                var doorid = someValue.result[1].varName
                                                                                        }
                                                                                        else {
                                                                                                var doorid = someValue.result[0].varName
                                                                                        }
                                                                                }
                                                                                else {
                                                                                        var doorid = queryData.doorid
                                                                                }



        if (cmdtype == 0) {
                if (queryData.name == 'lightoff' && deviceModel == 'gda500hub') {
                var cmdstate = 'true'
                }
                else if (queryData.name == 'lightoff' && deviceModel == 'gdoMasterUnit') {
                var cmdstate = 'false'
//              console.log('Running Correctly')
                }
                else if (queryData.name == 'lighton') {
                var cmdstate = 'true'
                }
                else if (queryData.name == 'dooropen') {
                var cmdstate = '1'
                }
                else if (queryData.name == 'doorclose') {
                var cmdstate = '0'
                }
//      console.log(cmdstate)
        var ws = new WebSocket('wss://tti.tiwiconnect.com/api/wsrpc', 'echo-protocol');
        ws.onopen = function()
        {
        ws.send(JSON.parse(JSON.stringify('{"jsonrpc":"2.0","id":3,"method":"srvWebSocketAuth","params": {"varName": "' + queryData.email + '","apiKey": "' + apikey + '"}}')));
        function freeze(time) {
            const stop = new Date().getTime() + time;
         while(new Date().getTime() < stop);
        }
        freeze(250);
        ws.send(JSON.parse(JSON.stringify('{"jsonrpc":"2.0","method":"gdoModuleCommand","params":{"msgType":16,"moduleType":5,"portId":7,"moduleMsg":{"' + cmd + '":' + cmdstate + '},"topic":"' + doorid +'"}}')));
        response.end("Ran Command");
        ws.close()
        }
        } else if (cmdtype == 1) {
        var request = require('request');

const getStatus = () => new Promise((resolve, reject) => {
var options = {url:'https://tti.tiwiconnect.com/api/devices/' + doorid + '',method:'GET',json:JSON.parse('{"username":"' + queryData.email + '","password":"' + cleanpass + '"}')}
    function freeze(time) {
            const stop = new Date().getTime() + time;
         while(new Date().getTime() < stop);
        }
        freeze(3000);

        request(options, (err, res, body) => {
        if (err) return reject(err)
        resolve(body)
    })
})

const getStatusController = async function() {
    var statusValue = await getStatus()
        for(var device in statusValue.result[0].deviceTypeMap) {
                if (device.includes('garageDoor')) {
                        var doorval = statusValue.result[0].deviceTypeMap[device].at.doorState.value
                }
                else if (device.includes('garageLight')) {
                        var lightval = statusValue.result[0].deviceTypeMap[device].at.lightState.value
                }
                else if (device.includes('backupCharger')) {
                        var batval = statusValue.result[0].deviceTypeMap[device].at.chargeLevel.value
                }
                                else if (device.includes('garageDoorSensor')) {
                                        var doorval = statusValue.result[0].deviceTypeMap[device].at.doorState.value
                                        var batval = statusValue.result[0].deviceTypeMap[device].at.batteryLevel.value
                                        var lightval = 'false'
                                }
        if (batval == null) {
                var batval = 'NA'
        }
}

response.end('status:' + String(lightval) + ':' + String(doorval) + ':' + String(batval))
}
getStatusController()

}
}

getDoorIDController()
}
getAPIKeyController()

}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
}
)
