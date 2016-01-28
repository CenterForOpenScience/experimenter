import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.accounts/documents',
  queryUrlTemplate: '{+host}/v2/collections/experimenter.accounts/_search'
});
