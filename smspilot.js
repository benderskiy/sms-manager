// SMSPILOT.ru transport
var http = require('http');
var async = require('async');

function SMSPilot() {
    // auth parametres on sms24x7.ru
    var host = "http://smspilot.ru/api2.php?json=";
    var login = "";
    var password = "";
    var sender = "";  // 11 chars only! need to be registered on https://www.smspilot.ru/

    this.setAuthData = function (log, pass) {
        login = log;
        password = pass;
    };
    this.setHost = function (hst) {
        host = hst;
    };
    this.setSenderName = function (senderName) {
        sender = senderName;
    };    

// PUBLIC send [messages] array [{number: "...", text: "..."}, .., {..}] on host
    this.send = function(messages) {
        var funcs = []; // array of functions 
        console.log("..SENDING", messages.length, " MESSAGES through SMSPilot.ru");
        // pushing all sendOne()s in a funcs arrray
        for (var i = 0; i < messages.length; i++) {
            funcs.push(sendOne.bind({"message" : messages[i]}));
        };
        //waterfalling all messages
        async.waterfall(funcs, 
            function (err) {
                if(!err) {
                    console.log("..DONE with SMSPilot.ru");
                }
                else {
                    console.log("..!");
                    console.log(err);
                }
            });
    };
    
    // send one message (message must be binded)
    var sendOne = function(callback) {
        // form request
        var qs = {
            "login": login,
            "password": password,
            "send": [
                {
                    "from": sender,
                    "to": this.message.phone,
                    "text": this.message.text
                } ]
        };
        qs = JSON.stringify(qs);
        console.log("  ..SENDING «"+this.message.text+"» TO "+this.message.phone);
        // HTTP GET
        http.get(host+qs,
            function(res) {
                // on server responce
                res.on('data', function (chunk) {
                    try {
                        if (JSON.parse(chunk).cnt) {
                            console.log("    ..SUCCESS");
                        }
                        else {
                            console.log("    ..!ERROR! "+chunk);
                        }
                    }
                    catch(e) {
                        console.log("    ..!FAILED parse JSON");
                        console.log("      ..!" + e);
                        console.log("    ..SERVER RESPONSE:");
                        console.log("    ..", chunk.toString());

                    };
                    // watterfalling next
                    callback(null);
                });  
            // on error
            }).on('error', function(e) {
                console.log("    ..!FAILED HTTP GET");
                console.error("    .." + e);
                // watterfalling next
                callback(null);
            });  
    };

}

module.exports = new SMSPilot();