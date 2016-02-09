import { routeMatches } from '../../../helpers/route-matches';
import { module, test } from 'qunit';

module('Unit | Helper | route matches');

// Replace this with your real tests.
test('it matches url names', function(assert) {

	assert.equal(routeMatches(['experiments.index', 'experiments']), true, 'child routes match specified route');
	assert.equal(routeMatches(['experiments.open.index', 'experiments']), true, 'deeply nested route matches specifed route');

	assert.equal(routeMatches(['participants.index', 'experiments']), false, 'other route will not match route name');
});
