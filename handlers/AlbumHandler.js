var fs = require('fs'),
    async = require('async');
    res_hdlr = require("../util/ResponseUtil.js"),
    req_hdlr = require("../util/RequestUtil.js");

exports.version = "0.1.0";
exports.list_albums = function (req, res) {
    load_album_list(function (err, albums) {
        if (err) {
            res_hdlr.send_failure(res, 500, err);
            return;
        }

        res_hdlr.send_success(res, { albums: albums });
    });
}

exports.get_album = function (req, res) {
    // get the GET params
    var getp = req_hdlr.get_query_params(req);
    var page_num = getp.page ? getp.page : 0;
    var page_size = getp.page_size ? getp.page_size : 1000;

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /albums/album_name.json
    var album_name = get_album_name(req);
    load_album(
        album_name,
        page_num,
        page_size,
        function (err, album_contents) {
            if (err && err == "no_such_album") {
                res_hdlr.send_failure(res, 404, err);
            }  else if (err) {
                res_hdlr.send_failure(res, 500, err);
            } else {
                res_hdlr.send_success(res, { album_data: album_contents });
            }
        }
    );
}

function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir(
        "albums",
        function (err, files) {
            if (err) {
                callback(res_hdlr.make_error("file_error", JSON.stringify(err)));
                return;
            }

            var only_dirs = [];
            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        "albums/" + element,
                        function (err, stats) {
                            if (err) {
                                cb(res_hdlr.make_error("file_error", JSON.stringify(err)));
                                return;
                            }
                            if (stats.isDirectory()) {
                                only_dirs.push({ name: element });
                            }
                            cb(null);
                        }
                    );
                },
                function (err) {
                    callback(err, err ? null : only_dirs);
                }
            );
        }
    );
}


function load_album(album_name, page, page_size, callback) {
    fs.readdir(
        "albums/" + album_name,
        function (err, files) {
            if (err) {
                if (err.code == "ENOENT") {
                    callback(no_such_album());
                } else {
                    callback(res_hdlr.make_error("file_error", JSON.stringify(err)));
                }
                return;
            }

            var only_files = [];
            var path = "albums/" + album_name + "/";

            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        path + element,
                        function (err, stats) {
                            if (err) {
                                cb(res_hdlr.make_error("file_error", JSON.stringify(err)));
                                return;
                            }
                            if (stats.isFile()) {
                                var obj = { filename: element,
                                            desc: element };
                                only_files.push(obj);
                            }
                            cb(null);
                        }
                    );
                },
                function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        var ps = page_size;
                        var photos = only_files.slice(page * ps, ps);
                        var obj = { short_name: album_name,
                                    photos: photos };
                        callback(null, obj);
                    }
                }
            );
        }
    );
}

function no_such_album() {
    return res_hdlr.make_error("no_such_album",
                      "The specified album does not exist");
}

function get_album_name(req) {
    return req.params.album_name;
}
