import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.admins/documents',
  queryUrlTemplate: '{+host}/v2/collections/experimenter.admins/_search'
});
