# debugform
APIを叩くためのデバッグ用Webアプリです。  
JavaScriptのWebアプリから、テンプレートを用いて、入力したテキストでAPIを叩くことができます。  
テンプレートには `{{ Math.floor(Math.random() * 1000) }}` のようにワンライナーのコード等を埋め込むことができます。

## 環境
* AngularJS 1.5.7
    * Bable 6.5.2
    * browserify 13.1.0
    * UI Bootstrap 1.3.3

### 対応ブラウザ
* &gt;= Google Chrome Ver51.0.2704.106

他は未検証。

### 開発環境
* Vagrant 1.8.4 - 仮想環境管理
    * VirtualBox 5.0.24 - 仮想環境
    * vagrant-vbguest - Vagrantプラグイン
* Eclipse 4.7 (for JavaScript and Web Developers) - アプリ開発用IDE

## 動作方法
JavaScriptオンリーで作っているので、`app`以下のファイルを適当な場所に設置すれば動作します。  
ただし、babelを使用している関係上ビルドが必要です。

動作する仮想環境は、ソース一式の展開後に `vagrant up` で自動的に立ち上がります。

### ビルド方法
ビルド等する場合は `debugapp` ディレクトリにて以下のコマンドを実行してください。

* `npm run build` - アプリのビルド
* `npm run watch` - アプリのビルド（デバッグ用）
* `npm run doc` - アプリのAPIドキュメント生成
* `npm test` - アプリのユニットテスト実行
* `npm run eslint` - アプリの静的解析ツール実行
* `npm run clean` - 全ビルド生成物の削除

## 起動方法
`debugform/app/` にWeb上からアクセスしてください。デフォルトのVMでは http://172.16.10.12/ でアクセス可能です。

## 操作方法
指定されたURLに入力データからリクエストを投げてレスポンスを表示するだけです。  
定義ファイルを作成すれば、リクエストのテンプレートを作成できます。

日本語／英語両対応。ユーザーの環境に応じて自動的に切り替わります。

## ライセンス
[MIT](https://github.com/ktanakaj/debugform/blob/master/LICENSE)
