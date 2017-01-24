/* jshint worker:true */
/* global dcodeIO */

importScripts('bcryptjs/dist/bcrypt.min.js');
const bcrypt = dcodeIO.bcrypt;

const bounds = [
    [49, 57], // 1-9
    [65, 90], // A-Z
];

const possible = [];

for (let b = 0; b < bounds.length; b++) {
    const bound = bounds[b];
    const upperBound = bound[1] + 1;

    for (let i = bound[0]; i < upperBound; i++) {
        possible.push(String.fromCharCode(i));
    }
}

const alphaRegex = /[A-Z]/;

/**
 * Generates a new ID
 * @param len {Number} The length of the ID
 * @param [enforceAlpha=true] {Boolean} Whether or not to enforce alpha characters
 * @returns {String} The ID
 */
function makeId(len, enforceAlpha=true) {
    const possibleLength = enforceAlpha ? possible.length : 9;
    let text = '';

    for (let i = 0; i < len; i++) {
        text += possible[Math.floor(Math.random() * possibleLength)];
    }

    // Enforce alpha characters in text if flag is set and recurse if criterion is not met
    return enforceAlpha && !alphaRegex.test(text) ? makeId(len) : text;
}

/**
 * Web worker message receiver for generating account records
 * @param {Object} event
 * @param {Object} event.data
 * @param {Number} event.data.batchSize The size of the batch (how many accounts to generate)
 * @param {String} event.data.studyId The Study ID
 * @param {Object} event.data.extra The extra fields
 * @param {String} [event.data.tag] The tag
 * @returns {Object[]} The account records
 * @private
 */
self.onmessage = event => {
    const {batchSize, studyId, extra, tag} = event.data;
    const records = [];
    const idSet = [];

    for (let i = 0; i < batchSize; i++) {
        postMessage({
            progress: i
        });

        let id;

        // Check for duplicated IDs. Unlikely, but possible.
        while (!id || ~idSet.indexOf(id)) {
            id = `${makeId(7)}${tag ? `-${tag}` : ''}`;
        }

        idSet.push(id);

        const salt = bcrypt.genSaltSync(12);
        const password = bcrypt.hashSync(studyId, salt).replace('$2a$', '$2b$');

        records[i] = {
            id,
            password,
            extra
        };
    }

    postMessage({records});
};
