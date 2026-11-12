# 掠影中国 · 导游证备考地图

一个无需构建工具的静态网页项目。首版包含：

- 中国省级行政区互动地图（ECharts + GeoJSON 在线底图）
- 34 个省级行政区的结构化知识卡片
- 地理气候、历史文化、旅游资源、风物产业、交通区位、考点速记六个维度
- 关键词搜索、区域筛选、省份快捷入口
- 手机与桌面端响应式布局

## 本地预览

直接用浏览器打开 `index.html`。如果浏览器限制本地脚本或地图数据请求，可在项目目录启动一个静态服务器，例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## GitHub Pages 部署

1. 打开仓库 Settings → Pages。
2. 在 Build and deployment 中选择 Deploy from a branch。
3. Branch 选择 `main`，目录选择 `/(root)`，点击 Save。
4. 等待 GitHub Pages 发布完成后，访问页面上显示的站点地址。

## 项目文件

- `index.html`：页面结构与样式
- `data.js`：34 个省级行政区知识数据
- `app.js`：地图初始化、搜索筛选与交互逻辑

## 数据说明

当前版本是可运行的学习框架与首轮知识摘要，不应视为已完成官方逐条核验的考试数据库。正式备考时，尤其需要核对世界遗产、国家级非物质文化遗产、国家 5A 级旅游景区名单、交通线路及年度统计数据。

建议优先查阅：
- [文化和旅游部](https://www.mct.gov.cn/)
- [国家文物局](https://www.ncha.gov.cn/)
- [民政部](https://www.mca.gov.cn/)
- [国家统计局](https://www.stats.gov.cn/)

页面内容标注日期：2026-11-12。
