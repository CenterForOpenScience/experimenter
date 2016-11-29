import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(sessionData, setHeader) {
        setHeader('Authorization', sessionData.token);
    }
});
