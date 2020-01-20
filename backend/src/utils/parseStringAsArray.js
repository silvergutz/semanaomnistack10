module.exports = function parseStringAsArray(string) {
    return string.split(',').map(val => val.trim())
}