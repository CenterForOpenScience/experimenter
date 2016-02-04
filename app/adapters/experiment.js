import ApplicationAdapter from './application';
import JamCollectionAdapter from '../mixins/jam-collection-adapter';

export default ApplicationAdapter.extend(JamCollectionAdapter, {
	queryUrlTemplate: '{+host}/{+namespace}/collections{/jamNamespace}.{+collectionId}/documents',
});
