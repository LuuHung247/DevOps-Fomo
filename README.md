# TechFOMO 🚀🔥

> **Never suffer from tech FOMO again.** Discover, track, and analyze community-verified, high-utility, and rapidly rising GitHub repositories across **AI Agents, Cloud-Native, DevOps, MLOps, LLMs, and System Architecture**.

---

## 🌟 Highlights

- **🔥 Real-time & Verified Repos**: Aggregates top-tier repositories with thousands of stars and community validation across AI, DevOps & Cloud.
- **⚡ Star Growth & Velocity Tracking**: Multi-signal velocity scoring (Explosive, Hot Rising, Early Gem, Community Pick) detecting breakout tools before they go mainstream.
- **🤖 AI Repository Insights**: Explains *why* the community uses each repo, target audience, standout features, and where it fits in modern engineering stacks.
- **📂 Categorized Hub**:
  - 🤖 **Agentic AI & LLMs** (Autonomous agents, Ollama, vLLM, LangChain, OpenHands)
  - ⚙️ **DevOps & Cloud-Native** (Kubernetes, Terraform, OpenTofu, ArgoCD, Cilium, Crossplane)
  - 🧠 **MLOps & LLMOps** (MLflow, Qdrant, Chroma, BentoML, Phoenix AI Tracing)
  - 📐 **Architecture & Best Practices** (System Design Primer, Developer Roadmaps, SRE Exercises)
  - 🏆 **Hall of Fame** (Legendary repos with 30k+ to 300k+ stars)
- **🔍 Instant Filtering & Search**: Zero-latency search by name, author, topic, or language; filter by star thresholds (5k+, 10k+, 25k+, 50k+).
- **💾 Local Bookmarks**: Save favorites locally directly in your browser.
- **📈 Star History**: Instant one-click links to Star-History graphs and direct Markdown copy.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure Environment
Copy `.env.example` to `.env.local` to add GitHub or Gemini API keys:
```env
# Increases GitHub API rate limit from 60 to 5000 req/hr
GITHUB_TOKEN=your_github_personal_access_token

# Enables dynamic Gemini AI analysis for repos
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Deployment

### Deploy to Vercel / Cloud Run / Google Cloud
1. Push this repository to GitHub.
2. Import the repository into **Vercel** or deploy via **Docker / Cloud Run**.
3. Set `GITHUB_TOKEN` in Environment Variables (optional, for higher rate limits).

---

## 📄 License
MIT License.
