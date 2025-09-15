# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# フルスタックToDoアプリ

「Reactで作ったSPAのタスク管理アプリ。カテゴリー整理、締切・優先度管理を搭載。バックエンドはNode.js + MongoDBで構築し、フルスタック開発のスキルを詰め込みました。」

### 技術スタック
Frontend: React, Tailwind CSS, React Router
Backend: Node.js, Express
Database: MongoDB (Railway)
Deployment: Vercel (Frontend), Render (Backend)

### 主な機能
・タスク作成・編集・削除
・締切・優先度・カテゴリー分け

### デモ・コードリンク
フロント（Vercel）: https://todo-ten-ivory.vercel.app/
GitHubリポジトリ: https://github.com/username/todo-app

### 開発で学んだこと・工夫ポイント
・React Hook Form + Yup でフォームバリデーション
・JWT認証の実装と安全なトークン管理
・実務を想定して、フロントとバックエンドの分離デプロイを行った
・Todoアプリなのでどんな人が使えるようにデザインをミニマル・ジェンダーレスにした 

### 改善したいポイント
- 設計書を書いてからコードの実装に入ればよかった
- 本番環境と開発環境の違いを理解して開発すればデプロイで時間がかからなかった
- 日々学んだことを記録して発信・復習すればよかった
- チームで開発することを想定して、Git管理をすればよかった（ブランチを切る・プルリクエストをしてからマージする等）

  
### 追加したい機能
- タイマーと連携してタスクにどの程度時間がかかったか記録できるようにしたい
- 機械学習やAIを搭載して、タスクを入力するとタスクを実行するのにかかる時間を予測してくれるようにしたい
- カレンダーと連携してタスクを整理して見えるようにしたい

### さらに学んでみたいこと
- dockerで開発してデプロイしたい
- テストコードを導入して品質を高めたい
- CI/CDを取り入れて開発体験を改善したい
- 今回はJWT認証だったが、セッション認証も体験したい
- セキュリティについてもっと学んで安全なアプリを作成したい
- UIの設計をFigmaでやってみたい
