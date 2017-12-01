exports.version = "0.1.0";
exports.get_template_name = function (req) {
    return req.params.template_name;
}

exports.get_query_params = function (req) {
    return req.query;
}

exports.get_page_name = function (req) {
    return req.params.page_name;
}
