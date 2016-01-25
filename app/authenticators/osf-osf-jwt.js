import Em from 'ember';
import ENV from 'experimenter/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    authenticate(access_token, expires) {
        return Em.RSVP.resolve(JSON.stringify({data: {
                type: 'users',
                attributes: {
                    provider: 'osf',
                    access_token
                }
            }}));
    },
});
