module.exports = URLRequest;

function URLRequest(url) {
    this.contentType = "";
    this.method = "";
    this.requestHeaders = [];
    this.data = "";
}