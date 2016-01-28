import ApplicationAdapter from './application';
import ENV from 'experimenter/config/environment';


export default ApplicationAdapter.extend({
  urlSegments: {
    collectionId: () => 'admins',
  }
});

