import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.sessions/documents',
  queryUrlTemplate: '{+host}/v2/collections/experimenter.sessions/_search'
});
