"use strict";
/**
 * @file debugform.jsのテスト。
 */
const assert = require('power-assert');

import debugformService from '../../public/app/services/debugform';
const service = debugformService(null);

const config = {
	"categories": [
		{
			"name": "general",
			"url": "http://",
			"headers": {
				"Authorization": "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="
			},
			"templates": [
				{
					"name": "json-sample",
					"method": "POST",
					"headers": {
						"Content-Type": "application/json"
					},
					"data": {
					},
					"json": true
				},
				{
					"name": "form-sample",
					"method": "POST",
					"headers": {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					"body": ""
				},
				{
					"name": "get-sample",
					"method": "GET"
				}
			]
		},
		{
			"name": "sample",
			"url": "http://",
			"templates": [
				{
					"name": "inline-sample",
					"method": "POST",
					"headers": {
						"Content-Type": "application/json"
					},
					"data": {
						"name": "name={{ name }}",
						"random": "{{ Math.floor(Math.random() * 1000) }}",
						"value": "{{ value1 }}",
						"none": "{{ __none }}",
						"invalid": "{{ }}"
					},
					"json": true,
					"value1": "test value"
				}
			]
		}
	]
};

describe('debugformService', () => {
	describe('#select()', () => {
		it('should return selected template', () => {
			let form = service.select(config, 0, 0);
			assert.equal(form.name, "json-sample");
			form = service.select(config, 0, 1);
			assert.equal(form.name, "form-sample");
			form = service.select(config, 0, 2);
			assert.equal(form.name, "get-sample");
			form = service.select(config, 1, 0);
			assert.equal(form.name, "inline-sample");
			// ↓存在しないインデックスの場合空が返るが、親カテゴリの値が引き継がれるのでgeneralになる
			form = service.select(config, 0, 100);
			assert.equal(form.name, "general");
			// カテゴリもない場合は完全に空
			form = service.select(config, 2, 0);
			assert.deepStrictEqual(form, {});
		});
	});

	describe('#deepcopy()', () => {
		it('should include copied value', () => {
			let form = service.select(config, 0, 2);
			assert.equal(form.url, "http://");
			assert.deepStrictEqual(form.headers, {"Authorization":"Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="});

			form = service.select(config, 0, 0);
			assert.deepStrictEqual(form.headers, {"Content-Type":"application/json", "Authorization":"Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="});
		});
	});

	describe('#parseExpressions()', () => {
		it('should include expression value', () => {
			let form = service.select(config, 1, 0);
			assert.equal(form.data.name, "name=inline-sample");
			assert.equal(form.data.value, "test value");
			assert.equal(form.data.none, "");
			assert.equal(form.data.invalid, "");
			assert(/[0-9]{1,4}/.test(form.data.random));
		});
	});
});