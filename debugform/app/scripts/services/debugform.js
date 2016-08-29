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
		let form = JSON.parse(JSON.stringify(templates[templateNo])) || {};

		// カテゴリからパラメータを引き継ぐ
		// TODO: 入れ子も対応する
		for (let key of Object.keys(category)) {
			if (key != "templates" && form[key] === undefined) {
				form[key] = category[key];
			}
		}

		// TODO: 埋め込み変数を解決
		// TODO: 入れ子も対応する

		return form;
	}

	/**
	 * デバッグフォームの送信。
	 * @function submit
	 * @param {Object} form 送信するフォーム情報。
	 * @returns {Promise.<Object>} 送信結果。
	 */
	function submit(form) {
		// 正常系も異常系もレスポンスオブジェクトを返す
		console.log(form);
		return $http({
			method: form.method,
			url: form.url,
			headers: form.headers,
			data: form.body
		})
		.catch((response) => response);
	}
}