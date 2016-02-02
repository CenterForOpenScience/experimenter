/*
Manage data about a given collection
 */
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    // TODO: What is the endpoint to find a list of all collections?
    findRecordUrlTemplate: '{+host}/{+namespace}/collections/{+jamNamespace}.{+id}',
    createRecordUrlTemplate: '{+host}/v2/namespaces{/namespaceId}/collections',
});
