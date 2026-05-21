# SoManyLanes ADHD Quest Board

这是一个 Vite + React + TypeScript 版本的本地任务副本面板。当前版本只使用浏览器 `localStorage` 保存数据，没有接 Supabase、注册或登录。

## 本地运行

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认会打开在：

```text
http://127.0.0.1:5173/
```

如果 Windows PowerShell 提示脚本执行策略拦截，可以改用：

```bash
npm.cmd install
npm.cmd run dev
```

## Build

生成生产版本：

```bash
npm run build
```

构建产物会输出到 `dist/`。

## 部署到 Vercel

1. 把这个项目推到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 新建项目并导入仓库。
3. Framework Preset 选择 `Vite`。
4. Build Command 使用：

```bash
npm run build
```

5. Output Directory 使用：

```text
dist
```

6. 点击 Deploy。

当前应用是纯前端本地保存版本，部署后每个浏览器会独立保存自己的数据。

## Copyright

© 2026 SoManyLanes. All rights reserved.

This source code is proprietary and not licensed for copying, redistribution, or commercial use.
