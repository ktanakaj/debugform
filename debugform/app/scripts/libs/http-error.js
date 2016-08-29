/**
 * HTTPレスポンスエラー用例外クラス。
 * @module ./scripts/libs/http-error
 */

/**
 * HTTPレスポンスのエラーを格納する例外クラス。
 * @extends Error
 */
class HttpError extends Error {
	/**
	 * 例外を生成する。
	 * @param {Object} response HTTPレスポンス。
	 */
	constructor(response) {
		super(HttpError.makeErrorMessage(response));
		this.name = "HttpError";
		this.status = response && response.status ? response.status : 500;
	}

	/**
	 * HTTPレスポンスからエラーメッセージを生成する。
	 * @param {Object} response HTTPレスポンス。
	 * @returns {string} 例外エラーメッセージ。
	 */
	static makeErrorMessage(response) {
		let message = "Network Error";
		if (response) {
			if (response.status != -1) {
				message = response.status + " " + response.data;
			}
			if (response.config) {
				message += " (" + response.config.method + " " + response.config.url + ")";
			}
		}
		return message;
	}

	/**
	 * HTTPレスポンスから例外を投げる。
	 * @param {Object} response HTTPレスポンス。
	 * @throws {HttpError} 生成した例外。
	 */
	static throwError(response) {
		throw new HttpError(response);
	}

	/**
	 * HTTPレスポンスが指定されたステータスコードの時はdataを返し、それ以外は例外を投げる。
	 * @param {Object} response HTTPレスポンス。
	 * @param {...number} statuses dataを返すステータスコード。
	 * @return {Promise.<string>} response.dataの値。
	 * @throws {HttpError} 生成した例外。
	 */
	static rejectDataOrThrowError(response, ...statuses) {
		if (response && statuses.some((v) => response.status == v)) {
			// ※ そのまま返すとthenに流れてしまうのでrejectする
			return Promise.reject(response.data);
		}
		throw new HttpError(response);
	}
}

export default HttpError;