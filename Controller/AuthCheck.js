module.exports = function(enxpoints, context){
    let endpoint = enxpoints.filter(x => x.method === context.req.method && x.url === context.req.url);
    if(endpoint.length === 0){
        context.req.next();
        return;
    }
    if (context.req.headers.session) {
        context.db.UserCrud.checkToken({data: {token: context.req.headers.session}}, function (result) {
            var canAccess = false;
            if (result.user && result.user.roles){
                endpoint[0].auth.map(function(auth){
                    if(result.user.roles.filter(x => x.role === auth).length > 0) canAccess = true;
                });
            }
            if(canAccess){
                context.next();
            } else context.res.send({error: true, reason: 'Not Authorized To Access This Endpoint'});
        });
    } else context.res.send({error: true, reason: 'Not Authorized To Access This Endpoint'});
};