module.exports = SecurityErrorEvent;
module.exports.SECURITY_ERROR = "securityError";

function SecurityErrorEvent(type)
{
    this.type = type;
}