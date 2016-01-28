import DS from 'ember-data';

// TODO: DRY
function JSONAPIify(payload) {
  // Reset the type to match the expected model
  payload.type = 'experiments';

  // Ember data expects the API data to be dash-delimited, and it will remap to camelCase model names.
  // Field names will fail to be serialized if they do not start out as dash-separated
  //  see http://jsonapi.org/recommendations/#naming
  // <opinion redacted>
  payload.attributes = Object
      .keys(payload.attributes)
      .reduce((acc, key) => {
          acc[key.dasherize()] = payload.attributes[key];
          return acc;
      }, {});
  return payload;
}

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // set the type correctly on the model to ensure correct serializer was used
        payload.data = Array.isArray(payload.data) ?
            payload.data.map(JSONAPIify) :
            JSONAPIify(payload.data);

        return this._super(store, primaryModelClass, payload, id, requestType);
    }
});
