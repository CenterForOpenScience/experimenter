import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.experiments/documents',
  queryUrlTemplate: '{+host}/v2/collections/experimenter.experiments/_search'
});
