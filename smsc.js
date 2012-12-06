// smsc.ru transport
var http = require('http');
var async = require('async');

function SMSC() {
    // auth parametres on smsc.ru
    var host = "http://smsc.ru/sys/send.php?";
    var login = "";
    var psw = "";
    var sender = "";  // 11 chars only! need to be registered on smsc.ru

    this.setAuthData = function (log, pass) {
        login = log;
        psw = pass;
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
        console.log("..SENDING", messages.length, " MESSAGES through smsc.ru");
        // pushing all sendOne()s in a funcs arrray
        for (var i = 0; i < messages.length; i++) {
            funcs.push( sendOne.bind( {"message" : messages[i]} ) );
        };
        //waterfalling all messages
        async.waterfall(funcs, 
            function (err) {
                if(!err) {
                    console.log("..DONE with smsc.ru");
                }
                else {
                    console.log("..!");
                    console.log(err);
                }
            });
    }; 

    // send one message; message must be binded «sendOne.bind( {"message" : message} )»
    var sendOne = function(callback) {
        // form request
        var qs = require("querystring").stringify({
            'login': login,
            'psw': psw,
            'fmt': 3, // json            
            'charset': "utf-8",
            'sender': sender,
            'phones': this.message.phone,
            'mes': this.message.text,            
        });
        console.log("  ..SENDING «"+this.message.text+"» TO "+this.message.phone);
        // HTTP GET
        http.get(host+qs,
            // response
            function(res) {
                // on server responce
                res.on('data', function (chunk) {
                    try {
                        if (JSON.parse(chunk).cnt) {
                            console.log("    ..SUCCESS");
                        }
                        else {
                            console.log("    ..!ERROR "+JSON.parse(chunk).error);
                        }
                    }
                    catch(e) {
                        console.log("    ..!FAILED parse JSON");
                        console.log("      ..!" + e);
                        console.log("    ..SERVER RESPONSE:");
                        console.log("    ..", chunk.toString());

                    };
                    // watterfalling next..:
                    callback(null);
                });  
            // on error
            }).on('error', function(e) {
                console.log("    ..!FAILED HTTP GET");
                console.error("    .." + e);
                // watterfalling next..:
                callback(null);
            });
    };
}

module.exports = new SMSC();