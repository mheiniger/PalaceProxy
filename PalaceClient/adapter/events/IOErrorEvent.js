module.exports = IOErrorEvent;
module.exports.IO_ERROR = 'ioError';
module.exports.STANDARD_ERROR_IO_ERROR = 'standardErrorIoError';
module.exports.STANDARD_INPUT_IO_ERROR = 'standardInputIoError';
module.exports.STANDARD_OUTPUT_IO_ERROR = 'standardOutputIoError';

function IOErrorEvent(type)
{
    this.type = type;
}