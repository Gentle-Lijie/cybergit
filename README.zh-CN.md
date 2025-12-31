
<div align="center">

# 🟢 CyberGit Report (赛博 GitHub 年报)

**[ [English](./README.md) | 中文说明 ]**

![License](https://img.shields.io/badge/license-MIT-00FF41?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-00FF41?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-00FF41?style=for-the-badge&logo=typescript&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-00FF41?style=for-the-badge&logo=tailwindcss&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-AI-00FF41?style=for-the-badge&logo=google&logoColor=black)

> "醒醒吧，黑客。我们有个仓库要分析。"

</div>

## ⚡ 系统概览

**CyberGit Report** 是一款沉浸式的、赛博朋克主题的 GitHub 用户年度报告生成器。它通过科幻终端界面可视化你的编程之旅，将原始的 GitHub GraphQL 数据转化为一份令人惊叹的“网络行者（Netrunner）”档案。

与标准报告不同，该系统利用 **AI** 对你的代码风格进行心理分析，根据你的语言使用、提交习惯和项目主题，为你分配独特的人格画像（如“赛博架构师”、“重构大师”）。

![登陆](https://cdn.u14.app/upload/WX20251231-102539@2x.png)

![报告](https://cdn.u14.app/upload/WX20251231-102715@2x.png)

预览链接: [Amery2010 的 CyberGit 年报](https://cybergit.u14.app/#Amery2010)

## 📊 报告情报概览

**CyberGit** 聚合了多维度数据，为您生成连贯的叙事报告：

*   **身份矩阵**: 基于年度总贡献量计算的黑客等级。
*   **时空分析**:
    *   *作息形态*: 生产力峰值时段分析（如“夜猫子” vs “早起鸟”）。
    *   *节奏*: 24小时活跃度分布及贡献连胜（Streak）记录。
*   **代码动力学**:
    *   *代码熵*: 重构比例（新增行数 vs 删除行数）。
    *   *开发速度*: 平均 PR 合并耗时及代码变动规模。
*   **生态系统**:
    *   *技术栈*: 基于使用占比的编程语言分析。
    *   *影响力*: Star/Fork 总量聚合及开源贡献占比。
    *   *网络*: 组织隶属关系及“影响力之星”仓库。
*   **AI 心理侧写**: 独特的、生成式的代码人格叙事分析。

## 💾 核心模块

*   **赛博朋克 UI/UX**: 包含黑客帝国式的代码雨 Canvas 特效、CRT 扫描线、霓虹光晕以及沉浸式的音频音效（打字声、悬停声、启动音）。
*   **深度数据分析**: 后端逻辑负责计算连胜、重构比率以及从原始 GraphQL 节点中提取合并速度。
*   **AI 人格生成**: 使用 AI 模型生成描述你编程灵魂的独特叙事档案。
*   **贡献热力图**: 专为 2025 年定制的绿色荧光活动网格。
*   **3D 技术云**: 可交互的 3D 标签球，展示你的热门技术栈。
*   **导出与分享**: 生成高质量的 PNG 报告快照，或通过唯一的上行链路 URL 分享你的档案。

## 🛠️ 技术栈

*   **前端**: React 19, TypeScript
*   **样式**: Tailwind CSS (配合自定义动画与字体)
*   **数据源**: GitHub GraphQL API
*   **AI**: Google GenAI SDK (`@google/genai`)
*   **音频**: Web Audio API (自定义振荡器合成器)

## 🔌 安装与接入

### 前置要求

*   Node.js (v18+)
*   GitHub Personal Access Token (权限范围: `read:user`, `read:org`, `repo`)
*   (可选) Google Gemini API Key 用于 AI 功能

### 本地部署

1.  **克隆仓库**
    ```bash
    git clone https://github.com/Amery2010/cybergit.git
    cd cybergit
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **环境配置**
    在根目录创建 `.env` 文件：
    ```env
    # 可选：用于本地开发的 Gemini API Key
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **启动系统**
    ```bash
    npm start
    ```

## 🕹️ 使用指南

1.  **登录**: 输入你的 GitHub Personal Access Token。
    *   *演示模式*: 点击 "BYPASS SECURITY" (绕过安全) 可查看模拟档案 (CyberRunner_2077)。
2.  **可视化**: 向下滚动查看档案。界面会随着滚动触发动画逐步揭示数据。
3.  **音频**: 点击顶部的声音图标可开启/关闭 UI 音效。
4.  **语言**: 点击 `EN / 中文` 按钮切换语言。
5.  **快照**: 点击底部的相机图标下载 PNG 格式的报告。

## ⚠️ 隐私协议

本应用程序完全在客户端运行（或通过无状态代理）。你的 GitHub Token **永远不会** 存储在任何数据库中。
*   **本地使用**: Token 仅存在于 React 状态/内存中。
*   **分享**: 当生成分享链接时，仅暂时缓存生成的*数据快照*（不包含 Token）。

## 📜 许可证

[MIT](./LICENSE) © 2025 CyberGit Systems.

---
<div align="center">
  <sub>*系统分析完成。连接终止。*</sub>
</div>
