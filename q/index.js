var dns = require('native-dns');

module.exports = function (context, req) {
    
    var pending = req.body.length;
    context.log(pending, req.body);

    var question = dns.Question({
        name: 'www.google.com',
        type: 'A',
    });
    var start = Date.now();
    var dnsReq = dns.Request({
        question: question,
        server: {
            address: '1.1.1.1',
            port: 53,
            type: 'udp'
        },
        timeout: 1500,
    });

    dnsReq.on('timeout', function () {
        context.log('Timeout in making request');
    });

    dnsReq.on('message', function (err, answer) {
        answer.answer.forEach(function (a) {
            context.log(a.address);
        });
    });

    dnsReq.on('end', function () {
        var delta = (Date.now()) - start;
        context.log('Finished processing request: ' + delta.toString() + 'ms');
        context.done();
    });
    dnsReq.send();
};