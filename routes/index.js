
/*
 * GET home page.
 */
exports.index = function(request, response){
    var locals = { title: 'Welcome' };

    if (request.user) {
        locals.user = request.user;
    }
    response.render('index', locals);
};
