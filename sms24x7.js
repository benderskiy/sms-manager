// sms24x7.ru transport
var https = require('https');
var async = require('async');

function SMS24x7() {
    // auth parametres on sms24x7.ru
    var host = "https://api.sms24x7.ru/?";
    var email = "";
    var password = "";
    var senderName = "";  // 11 chars only! need to be registered on sms24x7.ru

    this.setAuthData = function (mail, pass) {
        email = mail;
        password = pass;
    };
    this.setHost = function (hst) {
        host = hst;
    };
    this.setSenderName = function (sender) {
        senderName = sender;
    };    

// PUBLIC send [messages] array [{number: "...", text: "..."}, .., {..}] on host
    this.send = function(messages) {
        var funcs = []; // array of functions 
        console.log("..SENDING", messages.length, " MESSAGES through sms24x7.ru");
        // pushing all sendOne()s in a funcs arrray
        for (var i = 0; i < messages.length; i++) {
            funcs.push(sendOne.bind({"message" : messages[i]}));
        };
        //waterfalling all messages
        async.waterfall(funcs, 
            function (err) {
                if(!err) {
                    console.log("..DONE with sms24x7.ru");
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
            'format': "jsonp",
            'method': "push_msg",
            'email': email,
            'password': password,
            'sender_name': senderName ,           
            'text': this.message.text,
            'phone': this.message.phone
        });
        console.log("  ..SENDING «"+this.message.text+"» TO "+this.message.phone);
        // HTTPS GET
        https.get(host+qs,
            function(res) {
                // on server responce
                res.on('data', function (chunk) {
                    try {
                        if (JSON.parse(chunk).response.msg.err_code === 0) {
                            console.log("    ..SUCCESS");
                        }
                        else {
                            console.log("    ..!ERROR! "+JSON.parse(chunk).response.msg.text);
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
                console.log("    ..!FAILED HTTPS GET");
                console.error("    .." + e);
                // watterfalling next..:
                callback(null);
            });  
    };
}

module.exports = new SMS24x7();
