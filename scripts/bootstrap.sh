#!/bin/bash
# For local development we need this script tp create collections in a local jamdb.
# For deployment this will need to be run manually.

source ~/.bashrc

workon `lsvirtualenv -b |grep "jam\|momo"`

jam delete experimenter
jam create experimenter

jam create experimenter sys
jam update experimenter -p "jam-experimenter:sys-root ADMIN"
jam userify experimenter sys
echo '{"password":"$2b$12$iujjM4DtPMWVL1B2roWjBeHzjzxaNEP8HbXxdZwRha/j5Pc8E1n2G"}' | jam create experimenter sys root
