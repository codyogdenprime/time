var router = require('express').Router();
var path = require('path');

//servering index
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/../../public/index.html'));
});

module.exports = router;
