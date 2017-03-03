"use strict";
/**
 * @file デバッグフォーム共通定義部。
 * @author Koichi Tanaka
 */
import angularUtils from './libs/angular-utils.js';

const app = angular.module('debugformApp', ['ngStorage', 'ngFileUpload', 'ui.bootstrap', 'pascalprecht.translate']);

// 国際化の設定
app.config(/* @ngInject */ function($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix : './resources/locale_',
		suffix : '.json'
	});
	$translateProvider.preferredLanguage(angularUtils.getLanguage());
	$translateProvider.useSanitizeValueStrategy('escape');
});

// 基底の例外ハンドラー
app.factory("$exceptionHandler", /* @ngInject */ function($window, $log, $filter) {
	return function(exception, cause) {
		$log.error(exception);
		$window.alert($filter('translate')("FATAL_ERROR"));
	};
});

// ディレクティブ・サービス・コントローラのインポートと登録
import validateJson from './directives/validate-json.js';
import debugformService from './services/debugform.js';
import debugformController from './controllers/debugform.js';

app.directive('validateJson', validateJson);
app.service('debugformService', debugformService);
app.controller('debugformController', debugformController);