/*
 Regexes and string templates reused throughout the application
*/


// Admin users are those authenticated via OSF
var adminPattern = new RegExp(/^user-osf-(\w+|\*)$/);

export {adminPattern};

