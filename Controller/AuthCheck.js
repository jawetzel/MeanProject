module.exports = function(enxpoints, req){
    let endpoint = req.endpoints.filter(x => x.method === req.req.method && x.url === req.req.url);
    if(endpoint.length === 0){
        req.next();
        return;
    }
    if (req.headers.session) {
        req.db.UserCrud.checkToken({data: {token: req.headers.session}}, function (result) {
            var canAccess = false;
            if (result.user && result.user.roles){
                endpoint[0].auth.map(function(auth){
                    if(result.user.roles.filter(x => x.role === auth).length > 0) canAccess = true;
                });
            }
            if(canAccess){
                req.next();
            } else req.res.send({error: true, reason: 'Not Authorized To Access This Endpoint'});
        });
    } else req.res.send({error: true, reason: 'Not Authorized To Access This Endpoint'});
};