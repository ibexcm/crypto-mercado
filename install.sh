#! usr/bin/bash

ROOT=`pwd`

cd $ROOT/database/dist
yarn link

cd $ROOT/libraries/dist
yarn link

cd $ROOT/graphqlserver
yarn link @ibexcm/libraries
yarn link @ibexcm/database

cd $ROOT/webclient
yarn link @ibexcm/libraries

cd $ROOT/adminclient
yarn link @ibexcm/libraries


