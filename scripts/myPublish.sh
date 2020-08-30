#!/usr/bin/env bash

rm -rf publish
mkdir publish

yarn build
cp -r build/ publish/public

cp -r package.json node_modules publish/
cp scientia-signalk-plugin/index.js publish/

cd publish/ || exit
npm publish
