var CronJob = require('cron').CronJob;
var request = require('request');
var htmlparser = require("htmlparser2");
var md5 = require('MD5');
var chalk = require('chalk');


var md5_result = '';
var Wchanges = function(addr, opts) {
    opts = opts || {};
    cron(addr, opts);
};


var get_page = function(addr, opts) {
    if (typeof addr === 'string') {
        request(addr, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var result_str = '';
                var parser = new htmlparser.Parser({
                    ontext: function(text) {
                        if (text.length > 1 && text.length < 500){
                            result_str += text;
                        }
                    },
                });
                parser.write(body);
                parser.end();
                if (md5_result === '')
                    md5_result = md5(result_str);
                else {
                    md5_current = md5(result_str);
                    if (md5_current !== md5_result)
                        console.log(addr + ' has changed');
                    md5_result = md5_current;

                }
            } else {
                console.log(chalk.red(error));
            }

        });
    }
};


var cron = function(addr, opts) {
    console.log(chalk.green("Tracking of page " + addr + " is started"));
    //Now is by default
    var mask = '* * * * * *';
    if (opts.cronmask !== undefined) {
        mask = opts.cronmask;
    }
    new CronJob(mask, function() {
        get_page(addr, opts);
    }, null, true, 'America/Los_Angeles');

};

module.exports = Wchanges;
