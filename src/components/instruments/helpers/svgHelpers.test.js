import SvgHelpers from "./svgHelpers";

const testData1 = [
	{ start: { x: 0, y: 10 }, end: { x: 0, y: 0 } },
	{ start: { x: 1.2246467991473533e-15, y: -10 }, end: { x: 0, y: 0 } },
];

const testData2 = [
	{ start: { x: 50, y: 100 }, end: { x: 50, y: 90 } },
	{ start: { x: 51.74497483512505, y: 99.96954135095478 }, end: { x: 51.39597986810004, y: 89.97563308076383 } },
	{ start: { x: 53.487823687206266, y: 99.87820251299121 }, end: { x: 52.79025894976501, y: 89.90256201039297 } },
	{ start: { x: 55.22642316338268, y: 99.72609476841367 }, end: { x: 54.181138530706136, y: 89.78087581473093 } },
	{ start: { x: 56.95865504800327, y: 99.51340343707852 }, end: { x: 55.56692403840262, y: 89.61072274966281 } },
	{ start: { x: 58.68240888334652, y: 99.2403876506104 }, end: { x: 56.94592710667721, y: 89.39231012048832 } },
	{ start: { x: 60.39558454088797, y: 98.90738003669028 }, end: { x: 58.31646763271037, y: 89.12590402935223 } },
	{ start: { x: 62.09609477998339, y: 98.51478631379982 }, end: { x: 59.676875823986705, y: 88.81182905103987 } },
	{ start: { x: 63.78186779084996, y: 98.06308479691594 }, end: { x: 61.02549423267997, y: 88.45046783753276 } },
	{ start: { x: 65.45084971874736, y: 97.55282581475768 }, end: { x: 62.3606797749979, y: 88.04226065180615 } },
	{ start: { x: 67.10100716628344, y: 96.98463103929542 }, end: { x: 63.680805733026745, y: 87.58770483143634 } },
	{ start: { x: 68.7303296707956, y: 96.35919272833937 }, end: { x: 64.98426373663648, y: 87.0873541826715 } },
	{ start: { x: 70.33683215379001, y: 95.67727288213004 }, end: { x: 66.26946572303201, y: 86.54181830570403 } },
	{ start: { x: 71.91855733945387, y: 94.93970231495835 }, end: { x: 67.53484587156309, y: 85.95176185196668 } },
	{ start: { x: 73.47357813929455, y: 94.14737964294635 }, end: { x: 68.77886251143563, y: 85.31790371435707 } },
	{ start: { x: 75, y: 93.30127018922194 }, end: { x: 70, y: 84.64101615137756 } },
	{ start: { x: 76.49596321166024, y: 92.4024048078213 }, end: { x: 71.1967705693282, y: 83.92192384625704 } },
	{ start: { x: 77.95964517353735, y: 91.45187862775208 }, end: { x: 72.36771613882988, y: 83.16150290220166 } },
	{ start: { x: 79.38926261462366, y: 90.45084971874738 }, end: { x: 73.51141009169893, y: 82.36067977499789 } },
	{ start: { x: 80.78307376628291, y: 89.4005376803361 }, end: { x: 74.62645901302633, y: 81.52043014426887 } },
	{ start: { x: 82.13938048432696, y: 88.3022221559489 }, end: { x: 75.71150438746157, y: 80.64177772475912 } },
	{ start: { x: 83.4565303179429, y: 87.15724127386972 }, end: { x: 76.76522425435434, y: 79.72579301909576 } },
	{ start: { x: 84.73291852294986, y: 85.96699001693256 }, end: { x: 77.78633481835989, y: 78.77359201354605 } },
	{ start: { x: 85.96699001693256, y: 84.73291852294986 }, end: { x: 78.77359201354605, y: 77.78633481835989 } },
	{ start: { x: 87.15724127386972, y: 83.4565303179429 }, end: { x: 79.72579301909576, y: 76.76522425435434 } },
	{ start: { x: 88.3022221559489, y: 82.13938048432698 }, end: { x: 80.64177772475912, y: 75.71150438746157 } },
	{ start: { x: 89.4005376803361, y: 80.78307376628291 }, end: { x: 81.52043014426889, y: 74.62645901302633 } },
	{ start: { x: 90.45084971874738, y: 79.38926261462366 }, end: { x: 82.36067977499789, y: 73.51141009169893 } },
	{ start: { x: 91.45187862775208, y: 77.95964517353734 }, end: { x: 83.16150290220168, y: 72.36771613882988 } },
	{ start: { x: 92.40240480782131, y: 76.49596321166024 }, end: { x: 83.92192384625704, y: 71.1967705693282 } },
	{ start: { x: 93.30127018922192, y: 75 }, end: { x: 84.64101615137754, y: 70 } },
	{ start: { x: 94.14737964294633, y: 73.47357813929455 }, end: { x: 85.31790371435707, y: 68.77886251143563 } },
	{ start: { x: 94.93970231495835, y: 71.91855733945387 }, end: { x: 85.95176185196668, y: 67.5348458715631 } },
	{ start: { x: 95.67727288213004, y: 70.33683215379001 }, end: { x: 86.54181830570403, y: 66.26946572303201 } },
	{ start: { x: 96.35919272833937, y: 68.7303296707956 }, end: { x: 87.0873541826715, y: 64.98426373663648 } },
	{ start: { x: 96.98463103929541, y: 67.10100716628344 }, end: { x: 87.58770483143633, y: 63.68080573302675 } },
	{ start: { x: 97.55282581475768, y: 65.45084971874738 }, end: { x: 88.04226065180615, y: 62.3606797749979 } },
	{ start: { x: 98.06308479691594, y: 63.78186779084996 }, end: { x: 88.45046783753276, y: 61.02549423267997 } },
	{ start: { x: 98.51478631379982, y: 62.09609477998338 }, end: { x: 88.81182905103987, y: 59.676875823986705 } },
	{ start: { x: 98.90738003669028, y: 60.395584540887974 }, end: { x: 89.12590402935223, y: 58.31646763271038 } },
	{ start: { x: 99.2403876506104, y: 58.68240888334652 }, end: { x: 89.39231012048832, y: 56.94592710667722 } },
	{ start: { x: 99.51340343707852, y: 56.95865504800327 }, end: { x: 89.61072274966281, y: 55.56692403840262 } },
	{ start: { x: 99.72609476841367, y: 55.22642316338268 }, end: { x: 89.78087581473093, y: 54.181138530706136 } },
	{ start: { x: 99.87820251299121, y: 53.48782368720626 }, end: { x: 89.90256201039297, y: 52.79025894976501 } },
	{ start: { x: 99.96954135095478, y: 51.744974835125056 }, end: { x: 89.97563308076383, y: 51.39597986810004 } },
	{ start: { x: 100, y: 50 }, end: { x: 90, y: 50 } },
	{ start: { x: 99.96954135095478, y: 48.25502516487495 }, end: { x: 89.97563308076383, y: 48.604020131899965 } },
	{ start: { x: 99.87820251299121, y: 46.512176312793734 }, end: { x: 89.90256201039297, y: 47.20974105023499 } },
	{ start: { x: 99.72609476841367, y: 44.77357683661732 }, end: { x: 89.78087581473093, y: 45.81886146929386 } },
	{ start: { x: 99.51340343707852, y: 43.041344951996734 }, end: { x: 89.61072274966281, y: 44.43307596159738 } },
	{ start: { x: 99.2403876506104, y: 41.31759111665349 }, end: { x: 89.39231012048832, y: 43.05407289332279 } },
	{ start: { x: 98.90738003669028, y: 39.60441545911203 }, end: { x: 89.12590402935223, y: 41.68353236728963 } },
	{ start: { x: 98.51478631379982, y: 37.90390522001661 }, end: { x: 88.81182905103987, y: 40.32312417601329 } },
	{ start: { x: 98.06308479691594, y: 36.21813220915005 }, end: { x: 88.45046783753276, y: 38.97450576732004 } },
	{ start: { x: 97.55282581475768, y: 34.549150281252636 }, end: { x: 88.04226065180615, y: 37.63932022500211 } },
	{ start: { x: 96.98463103929542, y: 32.89899283371656 }, end: { x: 87.58770483143634, y: 36.319194266973255 } },
	{ start: { x: 96.35919272833937, y: 31.269670329204395 }, end: { x: 87.0873541826715, y: 35.01573626336352 } },
	{ start: { x: 95.67727288213004, y: 29.663167846209987 }, end: { x: 86.54181830570403, y: 33.73053427696799 } },
	{ start: { x: 94.93970231495834, y: 28.081442660546124 }, end: { x: 85.95176185196668, y: 32.4651541284369 } },
	{ start: { x: 94.14737964294633, y: 26.526421860705454 }, end: { x: 85.31790371435707, y: 31.221137488564363 } },
	{ start: { x: 93.30127018922194, y: 25.00000000000001 }, end: { x: 84.64101615137756, y: 30.000000000000007 } },
	{ start: { x: 92.40240480782131, y: 23.50403678833976 }, end: { x: 83.92192384625704, y: 28.80322943067181 } },
	{ start: { x: 91.45187862775208, y: 22.040354826462664 }, end: { x: 83.16150290220168, y: 27.632283861170134 } },
	{ start: { x: 90.45084971874738, y: 20.61073738537635 }, end: { x: 82.36067977499789, y: 26.48858990830108 } },
	{ start: { x: 89.4005376803361, y: 19.216926233717086 }, end: { x: 81.52043014426889, y: 25.37354098697367 } },
	{ start: { x: 88.3022221559489, y: 17.86061951567303 }, end: { x: 80.64177772475912, y: 24.288495612538426 } },
	{ start: { x: 87.15724127386972, y: 16.543469682057086 }, end: { x: 79.72579301909576, y: 23.23477574564567 } },
	{ start: { x: 85.96699001693256, y: 15.267081477050134 }, end: { x: 78.77359201354605, y: 22.213665181640106 } },
	{ start: { x: 84.73291852294986, y: 14.033009983067437 }, end: { x: 77.78633481835989, y: 21.22640798645395 } },
	{ start: { x: 83.45653031794292, y: 12.842758726130292 }, end: { x: 76.76522425435434, y: 20.274206980904236 } },
	{ start: { x: 82.13938048432698, y: 11.697777844051103 }, end: { x: 75.71150438746159, y: 19.358222275240884 } },
	{ start: { x: 80.78307376628293, y: 10.599462319663907 }, end: { x: 74.62645901302633, y: 18.479569855731125 } },
	{ start: { x: 79.38926261462366, y: 9.549150281252636 }, end: { x: 73.51141009169893, y: 17.63932022500211 } },
	{ start: { x: 77.95964517353735, y: 8.54812137224792 }, end: { x: 72.36771613882988, y: 16.83849709779834 } },
	{ start: { x: 76.49596321166024, y: 7.5975951921787015 }, end: { x: 71.1967705693282, y: 16.078076153742963 } },
	{ start: { x: 75, y: 6.698729810778062 }, end: { x: 70, y: 15.35898384862245 } },
	{ start: { x: 73.47357813929453, y: 5.852620357053652 }, end: { x: 68.77886251143562, y: 14.68209628564292 } },
	{ start: { x: 71.91855733945387, y: 5.060297685041647 }, end: { x: 67.53484587156309, y: 14.04823814803332 } },
	{ start: { x: 70.33683215379003, y: 4.32272711786996 }, end: { x: 66.26946572303201, y: 13.458181694295973 } },
	{ start: { x: 68.73032967079561, y: 3.640807271660634 }, end: { x: 64.98426373663649, y: 12.91264581732851 } },
	{ start: { x: 67.10100716628344, y: 3.015368960704585 }, end: { x: 63.68080573302676, y: 12.412295168563666 } },
	{ start: { x: 65.45084971874738, y: 2.447174185242325 }, end: { x: 62.3606797749979, y: 11.957739348193861 } },
	{ start: { x: 63.78186779084996, y: 1.9369152030840553 }, end: { x: 61.02549423267997, y: 11.549532162467244 } },
	{ start: { x: 62.09609477998339, y: 1.4852136862001757 }, end: { x: 59.676875823986705, y: 11.188170948960142 } },
	{ start: { x: 60.39558454088797, y: 1.0926199633097156 }, end: { x: 58.31646763271037, y: 10.874095970647772 } },
	{ start: { x: 58.68240888334651, y: 0.7596123493895988 }, end: { x: 56.94592710667721, y: 10.607689879511682 } },
	{ start: { x: 56.958655048003266, y: 0.4865965629214841 }, end: { x: 55.56692403840261, y: 10.389277250337187 } },
	{ start: { x: 55.226423163382684, y: 0.2739052315863333 }, end: { x: 54.18113853070615, y: 10.219124185269067 } },
	{ start: { x: 53.48782368720627, y: 0.12179748700879145 }, end: { x: 52.79025894976502, y: 10.09743798960703 } },
	{ start: { x: 51.744974835125056, y: 0.030458649045215225 }, end: { x: 51.39597986810004, y: 10.024366919236172 } },
	{ start: { x: 50.00000000000001, y: 0 }, end: { x: 50.00000000000001, y: 10 } },
	{ start: { x: 48.25502516487496, y: 0.030458649045215225 }, end: { x: 48.604020131899965, y: 10.024366919236172 } },
	{ start: { x: 46.512176312793734, y: 0.12179748700879145 }, end: { x: 47.20974105023499, y: 10.09743798960703 } },
	{ start: { x: 44.77357683661732, y: 0.2739052315863333 }, end: { x: 45.81886146929386, y: 10.219124185269067 } },
	{ start: { x: 43.04134495199672, y: 0.4865965629214841 }, end: { x: 44.43307596159738, y: 10.389277250337187 } },
	{ start: { x: 41.317591116653475, y: 0.7596123493895988 }, end: { x: 43.05407289332278, y: 10.607689879511682 } },
	{ start: { x: 39.604415459112026, y: 1.0926199633097227 }, end: { x: 41.683532367289615, y: 10.87409597064778 } },
	{ start: { x: 37.903905220016625, y: 1.4852136862001686 }, end: { x: 40.3231241760133, y: 11.188170948960135 } },
	{ start: { x: 36.21813220915005, y: 1.9369152030840553 }, end: { x: 38.97450576732004, y: 11.549532162467244 } },
	{ start: { x: 34.549150281252636, y: 2.447174185242318 }, end: { x: 37.63932022500211, y: 11.957739348193854 } },
	{ start: { x: 32.89899283371656, y: 3.0153689607045777 }, end: { x: 36.319194266973255, y: 12.41229516856366 } },
	{ start: { x: 31.2696703292044, y: 3.640807271660627 }, end: { x: 35.01573626336352, y: 12.912645817328503 } },
	{ start: { x: 29.66316784620999, y: 4.32272711786996 }, end: { x: 33.73053427696799, y: 13.458181694295966 } },
	{ start: { x: 28.081442660546127, y: 5.060297685041654 }, end: { x: 32.4651541284369, y: 14.04823814803332 } },
	{ start: { x: 26.526421860705458, y: 5.8526203570536595 }, end: { x: 31.221137488564366, y: 14.682096285642928 } },
	{ start: { x: 24.999999999999993, y: 6.698729810778069 }, end: { x: 29.999999999999996, y: 15.358983848622458 } },
	{ start: { x: 23.50403678833976, y: 7.597595192178694 }, end: { x: 28.80322943067181, y: 16.078076153742956 } },
	{ start: { x: 22.040354826462664, y: 8.548121372247905 }, end: { x: 27.632283861170134, y: 16.838497097798324 } },
	{ start: { x: 20.61073738537635, y: 9.54915028125263 }, end: { x: 26.48858990830108, y: 17.639320225002102 } },
	{ start: { x: 19.21692623371709, y: 10.5994623196639 }, end: { x: 25.373540986973673, y: 18.47956985573112 } },
	{ start: { x: 17.860619515673037, y: 11.697777844051096 }, end: { x: 24.28849561253843, y: 19.358222275240877 } },
	{ start: { x: 16.543469682057086, y: 12.842758726130285 }, end: { x: 23.23477574564567, y: 20.274206980904232 } },
	{ start: { x: 15.267081477050134, y: 14.033009983067444 }, end: { x: 22.213665181640106, y: 21.226407986453957 } },
	{ start: { x: 14.033009983067437, y: 15.26708147705014 }, end: { x: 21.226407986453953, y: 22.21366518164011 } },
	{ start: { x: 12.842758726130285, y: 16.543469682057093 }, end: { x: 20.274206980904225, y: 23.234775745645674 } },
	{ start: { x: 11.697777844051103, y: 17.86061951567303 }, end: { x: 19.358222275240884, y: 24.28849561253842 } },
	{ start: { x: 10.599462319663893, y: 19.216926233717096 }, end: { x: 18.479569855731114, y: 25.373540986973676 } },
	{ start: { x: 9.549150281252636, y: 20.61073738537634 }, end: { x: 17.63932022500211, y: 26.48858990830107 } },
	{ start: { x: 8.548121372247905, y: 22.04035482646267 }, end: { x: 16.838497097798324, y: 27.632283861170137 } },
	{ start: { x: 7.5975951921787015, y: 23.50403678833975 }, end: { x: 16.078076153742963, y: 28.8032294306718 } },
	{ start: { x: 6.698729810778076, y: 24.99999999999998 }, end: { x: 15.358983848622458, y: 29.999999999999982 } },
	{ start: { x: 5.852620357053652, y: 26.52642186070546 }, end: { x: 14.68209628564292, y: 31.22113748856437 } },
	{ start: { x: 5.060297685041661, y: 28.081442660546113 }, end: { x: 14.048238148033327, y: 32.46515412843689 } },
	{ start: { x: 4.3227271178699525, y: 29.663167846209994 }, end: { x: 13.45818169429596, y: 33.730534276968 } },
	{ start: { x: 3.640807271660634, y: 31.269670329204384 }, end: { x: 12.91264581732851, y: 35.01573626336351 } },
	{ start: { x: 3.0153689607045777, y: 32.89899283371658 }, end: { x: 12.41229516856366, y: 36.319194266973255 } },
	{ start: { x: 2.447174185242325, y: 34.54915028125262 }, end: { x: 11.957739348193861, y: 37.639320225002095 } },
	{ start: { x: 1.9369152030840553, y: 36.218132209150056 }, end: { x: 11.549532162467244, y: 38.974505767320046 } },
	{ start: { x: 1.4852136862001757, y: 37.90390522001661 }, end: { x: 11.188170948960142, y: 40.32312417601329 } },
	{ start: { x: 1.0926199633097227, y: 39.60441545911201 }, end: { x: 10.87409597064778, y: 41.68353236728961 } },
	{ start: { x: 0.7596123493895988, y: 41.31759111665348 }, end: { x: 10.607689879511682, y: 43.05407289332279 } },
	{ start: { x: 0.4865965629214841, y: 43.041344951996706 }, end: { x: 10.389277250337187, y: 44.43307596159737 } },
	{ start: { x: 0.2739052315863333, y: 44.77357683661733 }, end: { x: 10.219124185269067, y: 45.818861469293864 } },
	{ start: { x: 0.12179748700879145, y: 46.51217631279372 }, end: { x: 10.09743798960703, y: 47.209741050234975 } },
	{ start: { x: 0.030458649045215225, y: 48.255025164874965 }, end: { x: 10.024366919236172, y: 48.60402013189997 } },
	{ start: { x: 0, y: 49.99999999999999 }, end: { x: 10, y: 49.99999999999999 } },
	{ start: { x: 0.030458649045215225, y: 51.74497483512506 }, end: { x: 10.024366919236172, y: 51.39597986810005 } },
	{ start: { x: 0.12179748700878434, y: 53.48782368720626 }, end: { x: 10.09743798960703, y: 52.79025894976501 } },
	{ start: { x: 0.2739052315863333, y: 55.22642316338265 }, end: { x: 10.219124185269067, y: 54.18113853070612 } },
	{ start: { x: 0.4865965629214841, y: 56.95865504800327 }, end: { x: 10.389277250337187, y: 55.56692403840262 } },
	{ start: { x: 0.7596123493895917, y: 58.6824088833465 }, end: { x: 10.607689879511675, y: 56.945927106677196 } },
	{ start: { x: 1.0926199633097227, y: 60.395584540887974 }, end: { x: 10.87409597064778, y: 58.31646763271038 } },
	{ start: { x: 1.4852136862001686, y: 62.096094779983375 }, end: { x: 11.188170948960135, y: 59.6768758239867 } },
	{ start: { x: 1.9369152030840624, y: 63.78186779084997 }, end: { x: 11.549532162467251, y: 61.025494232679975 } },
	{ start: { x: 2.447174185242318, y: 65.45084971874736 }, end: { x: 11.957739348193854, y: 62.36067977499789 } },
	{ start: { x: 3.015368960704585, y: 67.10100716628345 }, end: { x: 12.412295168563666, y: 63.68080573302676 } },
	{ start: { x: 3.640807271660627, y: 68.7303296707956 }, end: { x: 12.912645817328503, y: 64.98426373663648 } },
	{ start: { x: 4.322727117869945, y: 70.33683215378998 }, end: { x: 13.45818169429596, y: 66.269465723032 } },
	{ start: { x: 5.060297685041647, y: 71.91855733945387 }, end: { x: 14.04823814803332, y: 67.53484587156309 } },
	{ start: { x: 5.852620357053645, y: 73.47357813929452 }, end: { x: 14.682096285642913, y: 68.77886251143562 } },
	{ start: { x: 6.698729810778069, y: 75 }, end: { x: 15.358983848622458, y: 70 } },
	{ start: { x: 7.597595192178694, y: 76.49596321166024 }, end: { x: 16.078076153742956, y: 71.19677056932818 } },
	{ start: { x: 8.54812137224792, y: 77.95964517353735 }, end: { x: 16.83849709779834, y: 72.36771613882988 } },
	{ start: { x: 9.549150281252622, y: 79.38926261462365 }, end: { x: 17.639320225002095, y: 73.51141009169892 } },
	{ start: { x: 10.599462319663914, y: 80.78307376628293 }, end: { x: 18.47956985573113, y: 74.62645901302633 } },
	{ start: { x: 11.697777844051096, y: 82.13938048432696 }, end: { x: 19.358222275240877, y: 75.71150438746157 } },
	{ start: { x: 12.84275872613027, y: 83.45653031794289 }, end: { x: 20.274206980904218, y: 76.76522425435431 } },
	{ start: { x: 14.033009983067444, y: 84.73291852294986 }, end: { x: 21.226407986453957, y: 77.78633481835989 } },
	{ start: { x: 15.26708147705012, y: 85.96699001693254 }, end: { x: 22.213665181640096, y: 78.77359201354604 } },
	{ start: { x: 16.543469682057093, y: 87.15724127386972 }, end: { x: 23.234775745645674, y: 79.72579301909576 } },
	{ start: { x: 17.860619515673022, y: 88.3022221559489 }, end: { x: 24.288495612538416, y: 80.64177772475911 } },
	{ start: { x: 19.21692623371709, y: 89.4005376803361 }, end: { x: 25.373540986973673, y: 81.52043014426889 } },
	{ start: { x: 20.610737385376332, y: 90.45084971874736 }, end: { x: 26.488589908301066, y: 82.36067977499789 } },
	{ start: { x: 22.04035482646267, y: 91.4518786277521 }, end: { x: 27.632283861170137, y: 83.16150290220168 } },
	{ start: { x: 23.50403678833975, y: 92.40240480782128 }, end: { x: 28.8032294306718, y: 83.92192384625703 } },
	{ start: { x: 24.99999999999998, y: 93.30127018922192 }, end: { x: 29.999999999999982, y: 84.64101615137753 } },
	{ start: { x: 26.526421860705458, y: 94.14737964294635 }, end: { x: 31.221137488564366, y: 85.31790371435707 } },
	{ start: { x: 28.08144266054611, y: 94.93970231495834 }, end: { x: 32.46515412843689, y: 85.95176185196667 } },
	{ start: { x: 29.663167846209994, y: 95.67727288213004 }, end: { x: 33.730534276967994, y: 86.54181830570404 } },
	{ start: { x: 31.269670329204384, y: 96.35919272833937 }, end: { x: 35.01573626336351, y: 87.08735418267149 } },
	{ start: { x: 32.89899283371657, y: 96.98463103929542 }, end: { x: 36.319194266973255, y: 87.58770483143634 } },
	{ start: { x: 34.54915028125262, y: 97.55282581475768 }, end: { x: 37.639320225002095, y: 88.04226065180615 } },
	{ start: { x: 36.218132209150056, y: 98.06308479691594 }, end: { x: 38.97450576732004, y: 88.45046783753276 } },
	{ start: { x: 37.903905220016604, y: 98.51478631379982 }, end: { x: 40.32312417601329, y: 88.81182905103987 } },
	{ start: { x: 39.604415459112005, y: 98.90738003669028 }, end: { x: 41.6835323672896, y: 89.12590402935223 } },
	{ start: { x: 41.31759111665348, y: 99.2403876506104 }, end: { x: 43.05407289332278, y: 89.39231012048832 } },
	{ start: { x: 43.041344951996706, y: 99.51340343707852 }, end: { x: 44.43307596159737, y: 89.61072274966281 } },
	{ start: { x: 44.77357683661733, y: 99.72609476841367 }, end: { x: 45.818861469293864, y: 89.78087581473093 } },
	{ start: { x: 46.51217631279372, y: 99.87820251299121 }, end: { x: 47.209741050234975, y: 89.90256201039297 } },
	{ start: { x: 48.25502516487496, y: 99.96954135095478 }, end: { x: 48.604020131899965, y: 89.97563308076383 } },
];

it("should calculate coordinates properly", () => {
	const coords1 = SvgHelpers.getDivisionCoordinates({ x: 0, y: 0 }, 10, 10, 2, i => Math.PI * i);
	expect(coords1).toEqual(testData1);

	const coords2 = SvgHelpers.getDivisionCoordinates({ x: 50, y: 50 }, 50, 10, 180, i => ((2 * Math.PI) / 180) * i);
	expect(coords2).toEqual(testData2);
});