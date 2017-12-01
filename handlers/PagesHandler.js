
var fs = require('fs'),
    res_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\util\\ResponseUtil.js"),
    req_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\util\\RequestUtil.js");

exports.version = "0.1.0";

/**
 * All pages come from the same one skeleton HTML file that
 * just changes the name of the JavaScript loader that needs to be
 * downloaded.
 */
exports.serve_page = function (req, res) {

    var page = req_hdlr.get_page_name(req);

    fs.readFile(
        'basic.html',
        function (err, contents) {
            if (err) {
                res_hdlr.send_failure(res, 500, err);
                return;
            }

            contents = contents.toString('utf8');

            // replace page name, and then dump to output.
            contents = contents.replace('{{PAGE_NAME}}', page);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
}
