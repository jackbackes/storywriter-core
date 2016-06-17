var path = require('path');
var devConfigPath = path.join(__dirname, '../../../env/storywriter/development.js');
var productionConfigPath = path.join(__dirname, '../../../env/storywriter/production.js');

if (process.env.NODE_ENV === 'production') {
    module.exports = require(productionConfigPath);
} else {
    module.exports = require(devConfigPath);
}
