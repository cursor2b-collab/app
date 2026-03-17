
  # 安卓苹果 APP下载页

  This is a code bundle for 安卓苹果 APP下载页. The original project is available at https://www.figma.com/design/VeRExpcsdaHhwLrL0z61Fk/%E5%AE%89%E5%8D%93%E8%8B%B9%E6%9E%9C-APP%E4%B8%8B%E8%BD%BD%E9%A1%B5.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## 部署到 Vercel / Netlify

  - **构建**：`npm run build`，输出目录为 `dist`。
  - **Vercel**：已配置 `vercel.json`，连接 Git 仓库后自动识别；或本地执行 `npx vercel` 部署。
  - **Netlify**：已配置 `netlify.toml`，在 Netlify 中连接仓库后自动使用该配置。
  - 部署前请确保 `public/` 下已有 `Vip.apk`、`x426251-WebClip260317-224906-ec9.mobileconfig`、`vipclub.png`，否则需在构建前复制到 `public/`。
