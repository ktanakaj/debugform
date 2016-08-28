# debugform
Web form for API debug call by Javascript.  
APIを叩くためのデバッグ用Webアプリです。
JavaScriptのWebアプリから、現状JSONのAPIを叩くことができます。

## 環境
* AngularJS 1.5.7
    * Bable 6.5.2
    * browserify 13.1.0
    * UI Bootstrap 1.3.3

### 対応ブラウザ
* &gt;= Google Chrome Ver51.0.2704.106

他は未検証。HTML5のFile APIが動作すれば動くはず。

### 開発環境
* Vagrant 1.8.4 - 仮想環境管理
    * VirtualBox 5.0.24 - 仮想環境
    * vagrant-vbguest - Vagrantプラグイン
* Eclipse 4.7 (for JavaScript and Web Developers) - Webアプリ開発用IDE

## 動作方法
JavaScriptオンリーで作っているので、app以下のファイルを適当な場所に設置すれば動作します。  
ただし、babelを使用している関係上、Webアプリはビルドが必要です。

開発環境は、ソース一式の展開後に `vagrant up` で自動的に立ち上がります。

### ビルド方法
ビルド等する場合は、VM上の `debugapp` ディレクトリにて以下のコマンドを実行してください。

* `npm run build` - アプリのビルド
* `npm run watch` - アプリのビルド（デバッグ用）
* `npm run doc` - アプリのAPIドキュメント生成
* `npm run clean` - 全ビルド生成物の削除

## 起動方法
デフォルトのVMでは http://172.16.10.12/ でアクセスする。

## 操作方法
指定されたURLに入力データからリクエストを投げてレスポンスを表示するだけです。  
定義ファイルを作成すれば、リクエストのテンプレートを作成できます。

日本語／英語両対応。ユーザーの環境に応じて自動的に切り替わります。
