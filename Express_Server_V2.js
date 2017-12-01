var express = require('express');
var app = express();

app.use(express.logger("dev"));
app.use(express.responseTime());
app.use(express.static("D:\\Enterprise_Projs\\nodejs"));

var albm_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\handlers\\AlbumHandler.js"),
    pages_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\handlers\\PagesHandler.js"),
    res_hdlr = require("D:\\Enterprise_Projs\\nodejs\\Lesson_7\\01play\\util\\ResponseUtil.js");

/*Routing or layering the middleware functions is very important.
If a middleware function like Authentication is placed last in function calls then it will not be executed as,
there might be another generic route handled the request.
It is similar to Interceptors concept in "spring"*/

app.get('/albums.json', albm_hdlr.list_albums);
app.get('/albums/:album_name.json', albm_hdlr.get_album);

// As we are using the static middleware function, we dont need to do this manually.
/*
app.get('/content/:filename', function(req, res) {
    sFile_hdlr.serve_static_file('content/' + req.params.filename, res);
});
app.get('/albums/:album_name/:filename', function(req, res) {
    sFile_hdlr.serve_static_file('albums/' + req.params.album_name + "/" +
        req.params.filename, res);
});
app.get('/templates/:template_name', function(req, res) {
    sFile_hdlr.serve_static_file("templates/" + req.params.template_name, res);
});
*/
app.get('/pages/:page_name', pages_hdlr.serve_page);
app.get('/pages/:page_name/:sub_page', pages_hdlr.serve_page);
app.get('*', res_hdlr.four_oh_four);
app.listen(8080);
