const del = require('del');

module.exports = () => {
    del.sync(['public/uploads/**', '!public/uploads'])
}