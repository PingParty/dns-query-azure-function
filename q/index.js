var dns = require('native-dns');

module.exports = function (context, req) {
    
    var checks = req.body.checks;
    context.log(checks.length);
    var pending = checks.length;

    for (var i = 0; i<checks.length; i++){
        var ck = checks[i];
        var i2 = i;
        makeReq(ck.name, ck.addr, context, function(time){
            context.log(`Finished query ${i2}: ${time.toString()}ms`);
            pending--;
            if (pending == 0){
                context.done();
            }
        })
    }

};

function makeReq(name, target, context, callback){
    
    var question = dns.Question({
        name: name,
        type: 'A',
    });
    var start = Date.now();
    var dnsReq = dns.Request({
        question: question,
        server: {
            address: target,
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
        callback(delta);
    });
    dnsReq.send();
}