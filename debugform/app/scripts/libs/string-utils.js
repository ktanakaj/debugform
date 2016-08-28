"use strict";
/**
 * 文字列関連ユーティリティのNode.jsモジュール。
 * @module ./scripts/libs/string-utils
 */

/**
 * 文字列の先頭一文字を大文字に変換する。
 * @function ucfirst
 * @param {string} str 変換する文字列。
 * @returns {string} 変換した文字列。
 */
function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 文字列をキャメルコードに変換する。
 * @function camelize
 * @param {string} str 変換する文字列。
 * @returns {string} 変換した文字列。
 */
function camelize(str) {
	return str.replace(/(\-|\_|\s)(\w)/g, (a,b,c) => {
		return c.toUpperCase();
	});
}

/**
 * 文字列を指定桁で埋める。
 * @function lpad
 * @param {string} str 桁数を揃える文字列。
 * @param {int} len 必要な桁数。
 * @param {string} chr 埋める文字。
 * @returns {string} 桁数を揃えた文字列。
 */
function lpad(str, len, chr) {
	if (!chr || chr.length == 0) {
		return str;
	} else if (chr.length > 1) {
		chr = chr.charAt(0);
	}
	for (; str.length < len; str = chr + str);
	return str;
}

/**
 * 乱数によるUUIDを生成する。
 * @returns {string} 生成したUUID。
 */
function generateUUID() {
	let d = Date.now();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		let r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

export default {
	ucfirst: ucfirst,
	camelize: camelize,
	lpad: lpad,
	generateUUID: generateUUID,
};
