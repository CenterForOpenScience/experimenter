import Em from 'ember';
import ENV from 'experimenter/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    authenticate(access_token, expires) {
        return new Promise(function(resolve, reject) {
            data: JSON.stringify({data: {
                type: 'users',
                attributes: {
                    provider: 'osf',
                    access_token
                }
            }})
        }).then(function(data) {
            data.data.attributes.accessToken = access_token;
            return data.data.attributes;
        });

    },
});