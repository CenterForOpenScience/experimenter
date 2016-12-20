import {makeUserPattern} from 'experimenter/utils/patterns';
import { module, test } from 'qunit';

module('Unit | Utility | patterns');

// Replace this with your real tests.
test('Given prefix, returns a valid regex', function(assert) {
    assert.expect(7);
    let pattern = makeUserPattern('some-prefix');

    assert.ok(pattern.test('some-prefix-bob'),
        'Finds a specific suffix');

    assert.ok(pattern.test('some-prefix-123-bob'),
        'Finds a username with hyphens');

    assert.notOk(pattern.test('some-prefix-123-notallowed!'),
        'Username characters must be alphanumeric, underscores, or hyphens');

    assert.ok(pattern.test('some-prefix-*'),
        'Finds a wildcard suffix');

    assert.notOk(pattern.test('other-prefix-bob'),
        'Different prefixes do not match');

    assert.equal(pattern.exec('some-prefix-bob')[1], 'bob',
        'Username is captured');

    assert.equal(pattern.exec('some-prefix-bob-123')[1], 'bob-123',
        'Correctly extracts a username with hyphens');
});
