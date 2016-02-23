import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Edit',

    selectedIndex: -1,

    selected: function() {
        if (this.get('selectedIndex') === -1) return false;
        return this.get('blocks')[this.get('selectedIndex')];
    }.property('selectedIndex'),

    blocks: [{
        icon: 'file-text',
        title: 'Provide Study Information',
        description: `Cornhole four loko butcher, fixie disrupt cray marfa keffiyeh art party yuccie readymade stumptown yr aesthetic. Cornhole ugh everyday carry church-key put a bird on it. Put a bird on it viral venmo jean shorts, vinyl shabby chic williamsburg. Brooklyn kombucha whatever photo booth, lumbersexual offal shabby chic locavore gentrify fashion axe salvia semiotics banh mi. XOXO flexitarian occupy, marfa offal blog poutine chillwave hella. Mlkshk flannel wolf chartreuse bespoke. Mustache ennui vinyl waistcoat iPhone, wayfarers single-origin coffee.`,
    }, {
        icon: 'check-square-o',
        title: 'Consent Form',
        description: `Truffaut cold-pressed health goth, celiac pabst brunch lomo cardigan four dollar toast. Messenger bag post-ironic biodiesel, migas man bun literally plaid drinking vinegar truffaut bitters fashion axe sartorial. Flannel tattooed you probably haven't heard of them kombucha, humblebrag tumblr chia pitchfork knausgaard semiotics sriracha vice heirloom irony. Tattooed hoodie locavore four loko cray. Craft beer gochujang austin everyday carry. Tumblr ugh shoreditch, keffiyeh kinfolk intelligentsia blue bottle pork belly art party heirloom echo park quinoa wayfarers. Synth intelligentsia wayfarers bicycle rights shabby chic aesthetic.`,
    }, {
        icon: 'dropbox',
        title: 'Card Sort',
        description: `Leggings retro PBR&B, small batch fashion axe thundercats locavore. Williamsburg ugh pour-over thundercats artisan, poutine fingerstache scenester cornhole keytar normcore tattooed waistcoat semiotics DIY. Migas waistcoat selfies heirloom, letterpress williamsburg chambray. Everyday carry photo booth vice narwhal, marfa thundercats lomo vinyl. Raw denim bitters bespoke chia wolf. Whatever mlkshk microdosing banjo, umami roof party biodiesel listicle XOXO forage. Chicharrones meh slow-carb, bespoke chartreuse beard wolf seitan four loko raw denim cred fap 8-bit retro.`,
    }, {
        icon: 'file-text',
        title: 'Thank You Note',
        description: `Ennui mlkshk meggings drinking vinegar, ugh keffiyeh gochujang try-hard. Street art portland chia, hashtag normcore chicharrones wolf waistcoat. Man braid hella authentic health goth selfies, skateboard church-key schlitz ramps four dollar toast celiac. Salvia lomo offal kinfolk kombucha. Organic helvetica retro, tacos dreamcatcher mixtape kinfolk shabby chic synth narwhal lumbersexual chambray ramps paleo. Selvage you probably haven't heard of them chartreuse messenger bag stumptown, ramps single-origin coffee aesthetic. Mlkshk pickled hella, post-ironic aesthetic brunch blue bottle four loko.`
    }],

    actions: {
        'add-component': function() {
            this.set('selectedIndex', -1);
            // this.get('blocks').pushObject({
            //   icon: 'dropbox',
            //   title: 'Card Sort',
            // });
            // console.log(this.get('blocks'));
        },
        'tile-click': function(index, event) {
            this.set('selectedIndex', index);
        }
    }
});
