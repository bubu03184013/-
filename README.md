# 北京时间悬浮球 · Windows Desktop

一个极简的 Windows 桌面悬浮球时钟。

## 功能

- 常驻桌面、透明无边框、始终置顶
- 默认显示北京时间（Asia/Shanghai）
- 鼠标移入：显示距离当天/下一次 18:00 的倒计时
- 持续悬停 3 秒：切换为距离下一个中国法定节假日的倒计时
- 鼠标移出：恢复北京时间
- 点击小球：展开玻璃质感月历
- 点击日期：日期格 3D 翻转，显示中国农历
- 月历支持前后月份切换
- 点击日历外部自动收起
- 悬浮球支持鼠标拖动

## Windows

```bash
npm install
npm start
```

构建安装包和 Portable：

```bash
npm run dist
```

也可以双击：

```text
build-windows.cmd
```

## GitHub Actions

推送到 main 后，`.github/workflows/build-windows.yml` 会在 Windows Runner 上自动构建并上传 EXE。

## 技术

Electron + 原生 HTML/CSS/JavaScript，无前端框架，方便继续定制。
