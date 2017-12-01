exports.version = "0.1.0";

exports.four_oh_four= function (req, res) {
    exports.send_failure(res, 404, exports.make_error("invalid_resource",
                      "the requested resource does not exist."));
}

exports.make_error =  function (err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

exports.send_success = function (res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}

exports.send_failure = function (res, server_code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}

make_error =  function (err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}
