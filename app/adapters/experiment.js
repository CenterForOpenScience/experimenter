import ApplicationAdapter from './application';
import JamDocumentAdapter from '../mixins/jam-document-adapter';

export default ApplicationAdapter.extend(JamDocumentAdapter, {
	queryUrlTemplate: '{+host}/{+namespace}/collections{/jamNamespace}.{+collectionId}/documents',
});
