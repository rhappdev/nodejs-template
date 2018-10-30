This directory contains a Jenkinsfile which can be used to build
nodejsApp using an OpenShift build pipeline.

To do this, run:

```bash

# Pipeline should be create under jenkins project
# create the pipeline build controller from the openshift/pipeline
# subdirectory 
oc project <<jenkins project name>>
oc new-app <<git-lab-repo-url> \
  --context-dir=openshift/pipeline --name <<name of the pipeline>>