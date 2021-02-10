#!/usr/bin/env bash

rm -rf publish
mkdir publish

yarn build
cp -r build/ publish/public

cp -r package.json publish/
cp scripts/index.js publish/


if [ "$1" == "publish" ]
	then
		cd publish/ || exit
		npm publish
fi
