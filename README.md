PRspectives
===========

PRspectives is a multi-perspective process model editor that has been developed by the [ISA Research Group](http://www.isa.us.es). 

It integrates several technologies that have been developed as part of Research Projects ISABEL, SETI, THEOS and TAPAS. Specifically, it uses:
* [PPINOT](http://www.isa.us.es/ppinot) to model and analyse process performance indicators
* [CRISTAL](http://www.isa.us.es/cristal) to model and analyse the organisational perspective of the process

In addition, it also integrates a model editor based on [Oryx Editor](http://bpt.hpi.uni-potsdam.de/Oryx).

You can try PRspectives online at https://prspectives.services.governify.io

Features
--------

The current version of PRspectives has the following features:

* Model business processes in BPMN 2.0 using a web-based model editor.
* Model process performance indicators either using a graphical notation together with the business process or using templates. See [PPINOT](http://www.isa.us.es/ppinot) for more information.
* Model organizational models that include roles, a hierarchy of positions and organizational units.
* Model human resource assignments to the activities of the business process using either RACI matrices or RAL, a resource assignment language. See [CRISTAL](http://www.isa.us.es/cristal) for more information about RAL.
* Save and share your models.
* Login using Google or Facebook accounts.

Run PRspectives
---------------

PRspectives can also be run in your own server. To do so, it is necessary to configure several environment variables:

 - PPINOT_REPOSITORY_DIRECTORY: Path to the directory in which the process models will be stored.
 - PPINOT_BASE_URL: Base URL of the whole app.
 - PPINOT_GOOGLE_KEY: Consumer key for google login.
 - PPINOT_GOOGLE_SECRET: Secret for google login.
 - PPINOT_FACEBOOK_KEY: Consumer key for facebook login.
 - PPINOT_FACEBOOK_SECRET: Secret for facebook login.

Once those variables are defined, you just need to run:

```
git clone https://github.com/isa-group/prspectives.git
cd prspectives/prspectives
mvn clean package jetty:run
```

Alternatively, you can define the environment variables just before the maven command as follows:

```
PPINOT_REPOSITORY_DIRECTORY=/path/to/model/repository PPINOT_BASE_URL=http://localhost:8080 PPINOT_GOOGLE_KEY=googlekey PPINOT_GOOGLE_SECRET=googlesecret mvn clean package jetty:run
```

Google keys can be obtained from https://code.google.com/apis/console#access. The redirect URI should be set to http://localhost:8080/bpmn-editor/socialauth.do
