
<div align="center">

# 🟢 CyberGit Report

**[ English | [中文说明](./README.zh-CN.md) ]**

![License](https://img.shields.io/badge/license-MIT-00FF41?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-00FF41?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-00FF41?style=for-the-badge&logo=typescript&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-00FF41?style=for-the-badge&logo=tailwindcss&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-AI-00FF41?style=for-the-badge&logo=google&logoColor=black)

> "Wake up, Coder. We have a repo to analyze."

</div>

## ⚡ System Overview

**CyberGit Report** is an immersive, cyberpunk-themed GitHub annual report generator. It visualizes your coding journey through a sci-fi terminal interface, turning raw GitHub GraphQL data into a stunning "Netrunner" dossier.

Unlike standard reports, this system utilizes **AI** to psychoanalyze your coding style, assigning you a persona (e.g., "Fullstack AI Geek", "Refactor Monk") based on your languages, commit habits, and project topics.

![Login](https://cdn.u14.app/upload/WX20251231-102539@2x.png)

![Report](https://cdn.u14.app/upload/WX20251231-102715@2x.png)

Preview URL: [Amery2010's CyberGit Report](https://cybergit.u14.app/#Amery2010)

## 📊 Report Intelligence

**CyberGit** aggregates disparate data points into a cohesive narrative:

*   **Identity Matrix**: Level calculation based on total contribution volume.
*   **Temporal Analysis**:
    *   *Chronotype*: Peak productivity hours (e.g., "Night Owl" vs "Early Bird").
    *   *Rhythm*: 24-hour activity distribution and contribution streaks.
*   **Code Dynamics**:
    *   *Entropy*: Refactor ratio (Lines Added vs. Deleted).
    *   *Velocity*: Average PR merge time and code churn magnitude.
*   **Ecosystem**:
    *   *Stack*: Top languages by usage percentage.
    *   *Impact*: Total Stars/Forks and Open Source contribution ratio.
    *   *Network*: Organization affiliations and "Impact Star" repositories.
*   **AI Psych Profile**: A unique, generative text analysis of your coding personality.

## 💾 Core Modules

*   **Cyberpunk UI/UX**: Matrix rain canvas effects, CRT scanlines, neon glows, and immersive audio SFX (typing, hovering, booting).
*   **Deep Data Analysis**: Backend logic to calculate streaks, refactor ratios, and merge velocities from raw GraphQL nodes.
*   **AI Persona Generation**: Uses Google Gemini to generate a unique narrative profile describing your coding soul.
*   **Contribution Heatmap**: A custom-built, glowing activity grid for the year 2025.
*   **3D Tech Cloud**: Interactive tag sphere visualizing your top topics.
*   **Export & Share**: Generate a high-quality PNG snapshot of your report or share via a unique uplink URL.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS (with custom animations and fonts)
*   **Data Fetching**: GitHub GraphQL API
*   **AI**: Google GenAI SDK (`@google/genai`)
*   **Audio**: Web Audio API (Custom oscillator synthesizer)

## 🔌 Installation & Access

### Prerequisites

*   Node.js (v18+)
*   A GitHub Personal Access Token (Scope: `read:user`, `read:org`, `repo`)
*   (Optional) Google Gemini API Key for AI features

### Local Deployment

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Amery2010/cybergit.git
    cd cybergit
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # Optional: For local AI generation without proxy
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Initiate System**
    ```bash
    npm start
    ```

## 🕹️ Usage Guide

1.  **Login**: Enter your GitHub Personal Access Token.
    *   *Demo Mode*: Click "BYPASS SECURITY" to view a mock profile (CyberRunner_2077).
2.  **Visualization**: Scroll through your dossier. The interface reveals data using scroll-triggered animations.
3.  **Audio**: Toggle the sound icon in the header to enable/disable UI sound effects.
4.  **Language**: Toggle between `EN` (English) and `中文` (Chinese).
5.  **Snapshot**: Click the camera icon at the bottom to download a PNG report.

## ⚠️ Privacy Protocol

This application runs entirely on the client-side (or via a stateless proxy). Your GitHub Token is **never** stored in any database.
*   **Local Usage**: Token resides in React state/memory.
*   **Sharing**: When sharing a report, a snapshot of the *data* (not the token) is temporarily cached.

## 📜 License

[MIT](./LICENSE) © 2025 CyberGit Systems.

---
<div align="center">
  <sub>*System Analysis Complete. End of Line.*</sub>
</div>
