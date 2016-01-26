import Em from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    authenticate(access_token, _) {
        return Em.RSVP.resolve(JSON.stringify({data: {
                type: 'users',
                attributes: {
                    provider: 'osf',
                    access_token
                }
            }}));
    }
});
