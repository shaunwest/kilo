/**
 * Created by shaun on 1/28/14.
 */

exports.getAsset = function(req, res) {
    var filename = req.params.assetName;

    res.sendfile('data/ultradian/images/' + filename, function(err){
        if(err) {
            res.status(404);
            res.render('404.ejs');
        }
    });
};

