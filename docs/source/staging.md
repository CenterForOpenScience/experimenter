# Using the staging server to try your experiments

### A sandbox environment

The staging versions of [Lookit](https://staging-lookit.osf.io) and [Experimenter](https://staging-experimenter.osf.io) allow you to write and try out your studies, without posting them on the main site and collecting data. On Experimenter, you can create a new study, edit the details about it like the summary and age range, edit the JSON schema that defines what happens in the study, and start/stop data collection. Lookit accesses that data to show the studies that are currently collecting data and parses the study description. The staging-lookit application is separate from the production version of Lookit at lookit.mit.edu; account data isn't shared. Any data stored on staging-lookit is expected to be temporary test data.

> Note: Technically, staging-lookit is public - anyone can create an account there, and see the studies being developed. It is, therefore, not a good place for your super-secret experimental design, working perpetual motion machine plans, etc. But in practice, no one's going to stumble on it.

It's also possible to run Lookit and/or Experimenter locally, so that you can edit the code that's used. In this case, they still talk to either the staging or the production server to fetch the definitions of available studies (Lookit) or save those definitions (Experimenter). For now, the plan is that you do NOT need to edit any of the code - if you want frames to work differently, in ways that aren't possible to achieve by adjusting the data you pass to them using the JSON schema, you'll contact MIT.

### Getting access

To access staging-experimenter, you'll need an account on [staging.osf.io](https://staging.osf.io/). Once you've created an account, go to
[your profile](https://staging.osf.io/profile/) and send MIT your 5-character profile ID from the end of your "public profile" link (e.g. `staging.osf.io/72qxr`) to get access to experimenter.

Once you can log in to experimenter, you may be prompted to select a namespace. Select 'lookit'.
