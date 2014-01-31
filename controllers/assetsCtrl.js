/**
 * Created by shaun on 1/28/14.
 */

/** usage:
 *
 * assetsCtrl.loadAsset('data/ultradian/images/tree1.png', function(data) {
 *   res.set({
 *       'Content-Type': 'image/png'
 *   });
 *   res.send(data);
 * });
 */

var fs = require('fs');

module.exports = {
    loadAssets: function() {

    },
    loadAsset: function(filePath, ready) {
        fs.readFile(filePath, function(err, data) {
            if(err) throw err;

            if(ready) {
                ready(data);
            }
        });
    }
};
