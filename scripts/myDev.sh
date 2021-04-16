#!/usr/bin/env bash

rm -rf dev
mkdir dev

cp package.json package.json.backup
echo $(jq '.name = "signalk-scientia-kraivio-dev"' <<< $(cat package.json)) > package.json
echo $(jq '.homepage = "signalk-scientia-kraivio-dev"' <<< $(cat package.json)) > package.json

yarn build

cp -r build/ dev/public
cp scripts/indexDev.js dev/index.js

cp package.json dev/

cd dev/ || exit 1



cd .. || exit 1
mv package.json.backup package.json
cd dev/ || exit 1

if [ "$1" == "link" ]
	then
		sudo npm unlink
		sudo npm link
fi


