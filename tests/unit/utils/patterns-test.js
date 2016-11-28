import {makeUserPattern} from 'experimenter/utils/patterns';
import { module, test } from 'qunit';

module('Unit | Utility | patterns');

// Replace this with your real tests.
test('Given prefix, returns a valid regex', function(assert) {
    assert.expect(4);
    let pattern = makeUserPattern('some-prefix');

    assert.ok(pattern.test('some-prefix-bob'),
        'Finds a specific suffix');
    assert.ok(pattern.test('some-prefix-*'),
        'Finds a wildcard suffix');
    assert.notOk(pattern.test('other-prefix-bob'),
        'Different prefixes do not match');

    assert.equal(pattern.exec('some-prefix-bob')[1], 'bob',
        'Username is captured');

});
