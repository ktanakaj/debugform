"use strict";
/**
 * デバッグ用フォームAngular.jsサービス。
 * @module ./scripts/services/debugform
 * @param {Object} $http HTTPモジュール。
 * @returns {Object} サービスインスタンス。
 */
import HttpError from '../libs/http-error.js';

export default /* @ngInject */ function($http) {
	return {
		load: load,
		select: select,
		submit: submit,
	};

	/**
	 * フォーム定義情報の読み込み。
	 * @function load
	 * @param {string} url 読み込む設定ファイルURL。
	 * @returns {Promise.<Object>} 読み込み結果。
	 */
	function load(url) {
		console.log("load : " + url);
		return $http.get(url)
		.then((response) => response.data)
		.catch(HttpError.throwError);
	}

	/**
	 * フォームの選択。
	 * @function select
	 * @param {Object} config フォーム定義情報。
	 * @param {number} categoryNo 選択したカテゴリ。
	 * @param {number} templateNo 選択したテンプレート。
	 * @returns {Object} 選択したテンプレートのフォーム。
	 */
	function select(config, categoryNo, templateNo) {
		// 選択したテンプレートを取得する（定義情報は壊れている可能性があるのでチェックしつつ）
		let categories = config.categories || [];
		let category = categories[categoryNo] || {};
		let templates = category.templates || [];

		// テンプレート自体が変更されないようクローンする
		let form = JSON.parse(JSON.stringify(templates[templateNo] || {}));

		// カテゴリからパラメータを引き継ぐ
		deepcopy(form, category, "templates");

		// 埋め込み式を展開
		parseExpressions(form);

		return form;
	}

	/**
	 * オブジェクトのプロパティをディープコピーする。
	 * コピー先に値が存在しない場合のみコピーする。
	 * @function deepcopy
	 * @param {Object} target コピーされるオブジェクト。
	 * @param {Object} source コピー元のオブジェクト。
	 * @param {...Any} excludes 指定されたプロパティを除外する。
	 */
	function deepcopy(target, source, ...excludes) {
		// 除外されたプロパティ以外を全てコピーする
		for (let key of Object.keys(source)) {
			if (!excludes.includes(key)) {
				let value = source[key];
				if (value instanceof Object && !Array.isArray(value)) {
					// プロパティがオブジェクトの場合、再帰的にコピーする
					// ※ 厳密なオブジェクトチェックはしていない
					let newValue = target[key] || {};
					deepcopy(newValue, value);
					target[key] = newValue;
				} else if (target[key] === undefined) {
					// コピー先がない場合のみコピーする
					target[key] = value;
				}
			}
		}
	}

	/**
	 * プロパティ中の埋め込み式を展開する。
	 * @function parseExpressions
	 * @param {Object} target 展開するオブジェクト。
	 * @param {Object} source 埋め込み変数の値を格納したオブジェクト。未指定時はtarget自身。
	 */
	function parseExpressions(target, source) {
		// 全プロパティをチェックして、埋め込み文字があったら展開する
		source = source || target;
		for (let key of Object.keys(target)) {
			let value = target[key];
			if (value instanceof Object && !Array.isArray(value)) {
				// プロパティがオブジェクトの場合、再帰的に実行する
				// ※ 厳密なオブジェクトチェックはしていない
				parseExpressions(value, source);
			} else if (typeof value == "string") {
				// 文字列の場合、埋め込み式を展開
				target[key] = parseExpressionStr(value, source);
			}
		}
	}

	/**
	 * 文字列中の埋め込み式を展開する。
	 * @function parseExpressionStr
	 * @param {Object} str 展開する文字列。
	 * @param {Object} source 埋め込み変数の値を格納したオブジェクト。
	 * @returns {string} 展開した文字列。
	 */
	function parseExpressionStr(str, source) {
		let regex = /\{\{(.*?)\}\}/g;
		let m;
		while ((m = regex.exec(str)) !== null) {
			let parsed = parseExpression(m[1], source) || "";
			str = m["input"].slice(0, m["index"]) + parsed + m["input"].slice(m["index"] + m[0].length);
			regex.lastIndex = m["index"] + String(parsed).length;
		}
		return str;
	}

	/**
	 * 埋め込み式を展開する。
	 * @function parseExpression
	 * @param {string} expression 展開する式。
	 * @param {Object} source 埋め込み変数の値を格納したオブジェクト。
	 * @returns {string} 展開した文字列。
	 */
	function parseExpression(expression, source) {
		// 普通の変数ならオブジェクトのプロパティ、それ以外ならJavaScript文として展開
		expression = expression.trim();
		if (/^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(expression)) {
			return source[expression];
		}
		return (function(){ return eval(expression); })();
	}

	/**
	 * デバッグフォームの送信。
	 * @function submit
	 * @param {Object} form 送信するフォーム情報。
	 * @returns {Promise.<Object>} 送信結果。
	 */
	function submit(form) {
		// 正常系も異常系もレスポンスオブジェクトを返す
		let config = {
			method: form.method,
			url: form.url,
			headers: form.headers,
			data: form.body,
			// ↓現状は直接生データが渡される想定なので変換しない
			transformRequest: (data) => data
		};
		console.log(config);
		return $http(config)
		.catch((response) => response);
	}
}