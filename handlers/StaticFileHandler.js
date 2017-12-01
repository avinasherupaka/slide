var fs = require('fs'),
path = require("path"),
    res_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\util\\ResponseUtil.js"),
    req_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\util\\RequestUtil.js");
exports.version = "0.1.0";

exports.serve_static_file = function (file, res) {
    var rs = fs.createReadStream(file);
    rs.on(
        'error',
        function (e) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }
    );
    var ct = content_type_for_file(file);
    res.writeHead(200, { "Content-Type" : ct });
    rs.pipe(res);
}


function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'text/plain';
    }
}
