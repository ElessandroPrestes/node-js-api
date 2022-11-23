module.exports = function ResourceImproperError(message = 'This resource does not belong to the user') {
  this.name = 'ResourceImproperError';
  this.message = message;
};