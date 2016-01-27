import Em from 'ember';
import ENV from 'experimenter/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    url: `${ENV.JAMDB.url}/v1/auth`,

    restore(data) {
        let accessToken = data.accessToken;

        return Em.$.ajax({
            method: 'POST',
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
            data: JSON.stringify({data: {
                type: 'users',
                attributes: {
                    provider: 'osf',
                    access_token: accessToken
                }
            }})
        }).then(function(data) {
            data.data.attributes.accessToken =accessToken;
            return data.data.attributes;
        });
    },
    authenticate(access_token, expires) {
        return Em.$.ajax({
            method: 'POST',
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
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
    invalidate(data) {
        console.log('Invalidating data:');
        console.log(data);
    }
});
