module.exports.parseValidationErr = (err) => Object.values(err.errors).join(', ');
