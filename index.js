var CronJob = require('cron').CronJob;
var request = require('request');
var htmlparser = require("htmlparser2");
var md5 = require('MD5');
var chalk = require('chalk');



var Wchanges = function(addr, time) {
    cron(addr, time);
};


var get_page = function(addr) {
    if(typeof addr === 'string') {
        var md5_result = '';
        request(addr, function(error, response, body){
             if(!error && response.statusCode === 200){
                 var result_str = '';
                 var parser = new htmlparser.Parser({
                    ontext: function(text){
                        if(text.length > 1)
                           result_str += text;
                       },
                 });
                 parser.write(body);
                 parser.end();
                 if(md5_result === '')
                   md5_result = md5(result_str);
                 else{
                    md5_current = md5(result_str);
                    if(md5_current !== md5_result)
                        console.log(addr + ' has changed');
                 }



             }
        });
    }
};


var cron = function(addr, time) {
    console.log(chalk.green("Tracking of page " + addr + " is started"));
    //Now is by default
    new CronJob('* * * * * *', function() {
        get_page(addr, time);
    }, null, true, 'America/Los_Angeles');

};

module.exports = Wchanges;

