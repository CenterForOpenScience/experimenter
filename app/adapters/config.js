import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.configs/documents',
  queryUrlTemplate: '{+host}/v2/collections/experimenter.configs/_search'
});
