"use strict";
/**
 * JSONバリデーションAngular.jsディレクティブ。
 * @module ./scripts/directives/validate-json
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
			ctrl.$validators.validateJson = (modelValue, viewValue) => {
				// 引数でバリデーションが有効にされていない場合、何もしない
				let attr = attrs.validateJson;
				if (!attr || attr === "false" || attr === "FALSE" || attr === "0") {
					return true;
				}

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
			};

			// 引数の変化の前にバリデートが動くことがあるようなので、監視する
			scope.$watch(() => attrs.validateJson, () => {
				ctrl.$validate();
			});
		}
	};
}