var dns = require('native-dns');

module.exports = function (context, req) {
    
    var checks = req.body.checks;
    context.log(checks.length);
    var pending = checks.length;
    var answers = Array(pending).fill(0);

    for (var i = 0; i<checks.length; i++){
        var ck = checks[i];
        makeReq(ck.name, ck.addr, context,i, function(idx,result,time){
            context.log(`Finished query ${idx}: ${time.toString()}ms`);
            answers[i] = {time:time.toString(),v:result}
            pending--;
            if (pending == 0){
                context.bindings.response = { status: 200, body: answers };
                context.done();
            }
        })
    }

};

function makeReq(name, target, context, idx, callback){
    
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
        timeout: 2000,
        cache: false,
    });

    var result = "?"

    dnsReq.on('timeout', function () {
        result = "timeout"
        context.log(`Timeout in making request for ${name} from ${target}`);
    });

    dnsReq.on('message', function (err, answer) {
        context.log(err, answer)
        answer.answer.forEach(function (a) {
            result = a.address;
            context.log(`${target} replies ${a.address} for ${name}`);
        });
    });

    dnsReq.on('end', function () {
        var delta = (Date.now()) - start;
        callback(idx,result, delta);
    });
    dnsReq.send();
}