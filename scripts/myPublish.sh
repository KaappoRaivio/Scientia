#!/usr/bin/env bash

rm -rf publish
mkdir publish

yarn build
cp -r build/ publish/public

cp -r package.json node_modules publish/
cp scripts/index.js publish/

cd publish/ || exit
npm publish
