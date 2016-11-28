/*
 Regexes and string templates reused throughout the application
 */

// Admin users are those authenticated via OSF
// TODO: This wass a regex, now it's just a prefix
const adminPattern = 'user-osf';

/**
 * Create a regex object for matching users based on the specified external auth or Jam collection prefix.
 *
 * @param {String} prefix Eg 'user-osf'
 * @return {RegExp} A new regex object
 */
function makeUserPattern(prefix) {
    return new RegExp(`^${prefix}-(\\w\+|\\*)$`);
};

export {adminPattern, makeUserPattern};

