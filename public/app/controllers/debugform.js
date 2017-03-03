"use strict";
/**
 * デバッグ用フォームAngular.jsコントローラ。
 * @module ./scripts/controllers/debugform
 * @param {Object} $scope スコープモジュール。
 * @param {Object} $localStorage ローカルストレージモジュール。
 * @param {Object} Upload アップロードモジュール。
 * @param {Object} debugformService デバッグ用フォームサービス。
 */
export default /* @ngInject */ function($scope, $localStorage, Upload, debugformService) {
	/** デフォルトの定義ファイルURL。 */
	const DEFAULT_CONFIG = './resources/form.json';

	/**
	 * 定義ファイルの読み込み。
	 * @function load
	 * @param {string} url 読み込むURL。
	 * @returns {Promise} 処理結果。
	 */
	this.load = (url) => {
		// 定義ファイルを読み込み、初期値として先頭の値を選択
		return debugformService.load(url)
		.then((config) => {
			this.config = config;
			this.select(0, 0);
			// 初期設定以外の場合、読み込んだファイルを記録する
			if (url != DEFAULT_CONFIG) {
				$localStorage.config = config;
				this.releasable = true;
			}
		});
	};

	/**
	 * 定義ファイルの解除。
	 * @function release
	 * @returns {Promise} 処理結果。
	 */
	this.release = () => {
		// ローカルストレージの記録を解除し、初期設定を読み込む
		delete $localStorage.config;
		delete $localStorage.categoryNo;
		delete $localStorage.templateNo;
		this.releasable = false;
		return this.load(DEFAULT_CONFIG);
	};

	/**
	 * フォームの選択。
	 * @function select
	 * @param {number} categoryNo 選択したカテゴリ。
	 * @param {number} templateNo 選択したテンプレート。
	 */
	this.select = (categoryNo, templateNo) => {
		// 選択したテンプレートを読み込む。選択はローカルストレージに記録する
		this.form = debugformService.select(this.config, categoryNo, templateNo);
		this.categoryNo = categoryNo;
		this.templateNo = templateNo;
		$localStorage.categoryNo = categoryNo;
		$localStorage.templateNo = templateNo;
		// headersとdataを文字列として展開する
		// （もし直接文字列で指定されていたら上書きしない）
		// TODO: オブジェクトをキーバリューの形で入力できるようにしたい
		if (this.form.headerText === undefined) {
			this.form.headerText = JSON.stringify(this.form.headers, null, "\t");
		}
		if (this.form.body === undefined && this.form.json) {
			this.form.body = JSON.stringify(this.form.data, null, "\t");
		}
		this.response = {};
	};

	/**
	 * フォームのリセット。
	 * @function reset
	 */
	this.reset = () => {
		this.select(this.categoryNo, this.templateNo);
	};

	/**
	 * フォームの送信。
	 * @function submit
	 * @returns {Promise} 処理結果。
	 */
	this.submit = () => {
		// JSON文字列で入力させたヘッダーオブジェクトに上書き
		this.form.headers = JSON.parse(this.form.headerText || "{}");
		// フォームを送信しレスポンスを画面表示
		this.response = {};
		return debugformService.submit(this.form)
		.then((response) => {
			this.response = response;
		});
	};

	// 定義ファイルが指定された場合、読み込む
	$scope.$watch('vm.file', (file) => {
		if (file) {
			console.log(file);
			Upload.dataUrl(file)
			.then((url) => {
				this.load(url);
			});
		}
	});

	// 前回の設定があれば復元、なければ初期値読み込み
	this.config = $localStorage.config || {};
	this.categoryNo = $localStorage.categoryNo || 0;
	this.templateNo = $localStorage.templateNo || 0;
	if (Object.keys(this.config).length > 0) {
		// 値が読み込まれていることをフラグ立て
		this.releasable = true;
		this.reset();
	} else {
		this.release();
	}
}
