/*
 Regexes and string templates reused throughout the application
 */

// Admin users are those authenticated via OSF
const adminPattern = 'user-osf';

/**
 * Create a regex object for matching users based on the specified external auth or Jam collection prefix.
 *
 * @param {String} prefix Eg 'user-osf'
 * @return {RegExp} A new regex object that matches `prefix-abc`, `prefix.*`, or similar.
 */
function makeUserPattern(prefix) {
    return new RegExp(`^${prefix}-(\\w\+|\\*)$`);
}

export {adminPattern, makeUserPattern};

