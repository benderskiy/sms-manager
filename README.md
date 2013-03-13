# SMS Manager
SMS manager is a simple way to send SMS messages from internet sevices with an open API.
Supported services in this built: [smsPilot.ru] (http://smsPilot.ru), [sms24x7.ru] (http://sms24x7.ru), [smsc.ru] (http://smsc.ru)
Designed for node.js

## Quick Example
```javascript
var smsManager = require('./smsmanager.js');

// transports
var sms24x7 = require('./sms24x7.js');
sms24x7.setAuthData("email", "pass");   // email and password on sms24x7.ru
sms24x7.setSenderName("name");          // register it on sms24x7.ru

var smsc = require('./smsc.js');
smsc.setAuthData("login", "pass");      // login and password on smsc.ru
smsc.setSenderName("name");             // register it on smsc.ru


var smsPilot = require('./smspilot.js');
smsPilot.setAuthData("email", "pass");  // email and password on smsc.ru
smsPilot.setSenderName("name");         // register it on smsPilot.ru

// adding transports to an SMS manager
smsManager.addTransport("sms24x7", sms24x7);   
smsManager.addTransport("smsc", smsc);
smsManager.addTransport("smsPilot", smsPilot);

// messages
messages = [
    {   'text': "Your text here! UTF8", 
        'phone': "78912345678"},                // international format, example: 02112040404 (no +, whitespaces and so on)
    {   'text': "Second message here", 
        'phone': "02112040404"}
    ///...
];

// sending..
smsManager.send("sms24x7", messages);
smsManager.send("smsPilot", messages);
smsManager.send("smsc", messages);
```
