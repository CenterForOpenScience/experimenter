/* jshint worker:true */
/* global dcodeIO */

importScripts('bcryptjs/dist/bcrypt.min.js');
const bcrypt = dcodeIO.bcrypt;

// h/t: http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(len) {
    let text = '';
    const possible = '0123456789';

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
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

    for (let i = 0; i < batchSize; i++) {
        postMessage({
            progress: i
        });

        const id = `${makeId(10)}${tag ? `-${tag}` : ''}`;
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
