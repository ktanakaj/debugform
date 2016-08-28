"use strict";
/**
 * JSONバリデーションAngular.jsディレクティブ。
 * @module ./websrc/directives/validate-json
 */
export default /* @ngInject */ function() {
	return {
		require: 'ngModel',
		scope: {},
		/**
		 * JSONのバリデーションを行う。
		 * @function link
		 * @param {Object} scope スコープ。
		 * @param {Object} elm 要素。
		 * @param {Object} attrs 引数。
		 * @param {Object} ctrl コントローラ。
		 */
		link: function(scope, elm, attrs, ctrl) {
			// 最初に呼ばれたタイミングだとパラメータが渡らない場合があるので、監視する
			scope.$watch(() => attrs.validateJson, (attr) => {
				if (attr && attr !== "false" && attr !== "FALSE" && attr !== "0") {
					ctrl.$validators.validateJson = validate;
				} else {
					delete ctrl.$validators.validateJson;
				}
			});

			/**
			 * バリデーションを実施する。
			 * @function validate
			 * @param {string} modelValue モデルの値。
			 * @param {string} viewValue ビューの値。
			 * @returns {boolean} バリデーションOKの場合true。
			 */
			function validate(modelValue, viewValue) {
				// JSONとして無効な値が設定されている場合NG
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}

				try {
					JSON.parse(modelValue);
				} catch (e) {
					return false;
				}
				return true;
			}
		}
	};
}