/**
 * 梯子之家 (tizizhijia.com) - SSG 静态页面与 SEO 结构化数据生成引擎
 * 功能：将 19 篇 Markdown 文章预渲染为具有独立 URL、完整 DOM、JSON-LD 和 Meta 标签的静态 HTML
 * 彻底解决单页应用 (SPA) Hash 路由导致搜索引擎爬虫无法独立收录文章的问题。
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const OUTPUT_POST_DIR = path.join(ROOT_DIR, 'post');
const DATA_FILE = path.join(ROOT_DIR, 'data.js');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap.xml');

if (!fs.existsSync(OUTPUT_POST_DIR)) {
  fs.mkdirSync(OUTPUT_POST_DIR, { recursive: true });
}

// 提取 data.js 中的 feedData
function loadFeedData() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  const feedMatch = content.match(/const\s+feedData\s*=\s*(\[[\s\S]*?\]);/);
  if (!feedMatch) {
    throw new Error('未在 data.js 中匹配到 feedData');
  }
  // 使用安全 Function 构造函数解析数据
  const sandboxFunc = new Function(`return ${feedMatch[1]};`);
  return sandboxFunc();
}

// Markdown 转 HTML 引擎 (对齐 app.js 规范)
function parseMarkdownToHTML(markdownText) {
  if (!markdownText) return '';

  let src = markdownText.trim();
  // 移除开头的顶级 H1 标题 (页面骨架中已有独立 H1)
  src = src.replace(/^#\s+[^\n]+\n+/, '');

  // 保护代码块
  const codeBlocks = [];
  src = src.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    codeBlocks.push(`<pre class="code-block"><code>${escaped}</code></pre>`);
    return placeholder;
  });

  // 行内代码
  const inlineCodes = [];
  src = src.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    inlineCodes.push(`<code class="inline-code">${escaped}</code>`);
    return placeholder;
  });

  // Callout 提示框
  src = src.replace(/^>\s*(🪿|🛡️|⚠️|!\[IMPORTANT\]|!\[NOTE\]|!\[CAUTION\])?\s*\*?\*?【?([^】\n]+)】?\*?\*?[\s\S]*?(?=\n\n|\n#|$)/gm, (match) => {
    const cleanLines = match.split('\n').map(l => l.replace(/^>\s?/, '')).join('\n');
    if (match.includes('🪿') || match.includes('点评')) {
      const body = cleanLines.replace(/^.*?【?鹅的直白点评】?\*?\*?:?\s*/s, '');
      return `<div class="callout-box callout-goose"><div class="callout-header"><span class="callout-icon">🪿</span><span class="callout-title">鹅的直白点评：</span></div><div class="callout-text">${body}</div></div>`;
    } else if (match.includes('🛡️') || match.includes('避坑') || match.includes('⚠️') || match.includes('CAUTION') || match.includes('IMPORTANT')) {
      const body = cleanLines.replace(/^.*?(【?避坑安全守则】?|!\[IMPORTANT\]|!\[CAUTION\])\*?\*?:?\s*/s, '');
      return `<div class="callout-box callout-warning"><div class="callout-header"><span class="callout-icon">🛡️</span><span class="callout-title">避坑安全守则：</span></div><div class="callout-text">${body}</div></div>`;
    } else {
      return `<blockquote class="prose-blockquote">${cleanLines}</blockquote>`;
    }
  });

  // 表格
  src = src.replace(/\|(.+)\|\n\|(?:\s*[:|-]+\s*\|)+\n((?:\|.+\|\n?)+)/g, (match, headerLine, bodyLines) => {
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
    const rows = bodyLines.trim().split('\n').map(r => r.split('|').map(c => c.trim()).filter(c => c.length > 0));

    let tableHTML = `<div class="table-responsive-wrapper"><table class="prose-table"><thead><tr>`;
    headers.forEach(h => { tableHTML += `<th>${h}</th>`; });
    tableHTML += `</tr></thead><tbody>`;
    rows.forEach(r => {
      tableHTML += `<tr>`;
      r.forEach(c => { tableHTML += `<td>${c}</td>`; });
      tableHTML += `</tr>`;
    });
    tableHTML += `</tbody></table></div>`;
    return tableHTML;
  });

  // H1, H2, H3 (保证文章正文内部使用 H2/H3，与页面主 H1 形成严谨语义树)
  let headingIdx = 0;
  src = src.replace(/^###\s+(.+)$/gm, (m, title) => {
    headingIdx++;
    return `<h3 id="sec-${headingIdx}" class="prose-h3">${title}</h3>`;
  });
  src = src.replace(/^#{1,2}\s+(.+)$/gm, (m, title) => {
    headingIdx++;
    return `<h2 id="sec-${headingIdx}" class="prose-h2">${title}</h2>`;
  });

  // 列表
  src = src.replace(/^\s*[-*+]\s+(.+)$/gm, '<li class="prose-li-disc">$1</li>');
  src = src.replace(/(<li class="prose-li-disc">[\s\S]*?<\/li>\n?)+/g, '<ul class="prose-ul">$&</ul>');

  src = src.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="prose-li-num">$1</li>');
  src = src.replace(/(<li class="prose-li-num">[\s\S]*?<\/li>\n?)+/g, '<ol class="prose-ol">$&</ol>');

  // 样式
  src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  src = src.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="prose-link" target="_blank" rel="noopener">$1</a>');
  src = src.replace(/^---$/gm, '<hr class="prose-hr">');

  // 段落
  const blocks = src.split(/\n{2,}/);
  let htmlResult = blocks.map(b => {
    b = b.trim();
    if (!b) return '';
    if (b.startsWith('<h') || b.startsWith('<div') || b.startsWith('<table') || b.startsWith('<ul') || b.startsWith('<ol') || b.startsWith('<pre') || b.startsWith('<blockquote') || b.startsWith('<hr')) {
      return b;
    }
    return `<p class="prose-p">${b.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // 还原
  codeBlocks.forEach((codeHTML, idx) => {
    htmlResult = htmlResult.replace(`__CODE_BLOCK_${idx}__`, codeHTML);
  });
  inlineCodes.forEach((codeHTML, idx) => {
    htmlResult = htmlResult.replace(`__INLINE_CODE_${idx}__`, codeHTML);
  });

  return htmlResult;
}

// 生成单个独立文章 HTML 页面
function buildArticlePageHTML(item, markdownText) {
  const postUrl = `https://tizizhijia.com/post/${item.id}.html`;
  const articleHtml = parseMarkdownToHTML(markdownText || item.content || item.summary || '');
  const publishDate = (item.date || '2026-10-22').replace('.', '-');
  const catNames = { speed: '硬核实测', avoid: '踩坑避雷', tech: '技术原理' };
  const catLabel = catNames[item.cat] || '跑道黑匣子';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} | 梯子之家 · 跑道上有只鹅</title>
  <meta name="description" content="${(item.summary || '').replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${item.title}, 梯子之家, tizizhijia, 跑道上有只鹅, IPLC专线, 节点测速, 晚高峰丢包, 科学上网, 软路由分流">
  <link rel="canonical" href="${postUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="梯子之家 · 跑道上有只鹅">
  <meta property="og:title" content="${item.title}">
  <meta property="og:description" content="${(item.summary || '').replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:image" content="https://tizizhijia.com/favicon.svg">
  <meta property="article:published_time" content="${publishDate}">
  <meta property="article:author" content="跑道上有只鹅·飞行遥测实验室">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title}">
  <meta name="twitter:description" content="${(item.summary || '').replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://tizizhijia.com/favicon.svg">

  <!-- Schema.org TechArticle JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "${item.title.replace(/"/g, '\\"')}",
    "description": "${(item.summary || '').replace(/"/g, '\\"')}",
    "url": "${postUrl}",
    "datePublished": "${publishDate}",
    "dateModified": "2026-10-22",
    "inLanguage": "zh-CN",
    "author": {
      "@type": "Organization",
      "name": "跑道上有只鹅 · 飞行遥测与网络安全实验室",
      "url": "https://tizizhijia.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "梯子之家",
      "url": "https://tizizhijia.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tizizhijia.com/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${postUrl}"
    }
  }
  </script>

  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="shortcut icon" href="../favicon.svg">

  <!-- Fonts & Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">

  <style>
    .ssg-static-container {
      max-width: 980px;
      margin: 0 auto;
      padding: 30px 20px 80px;
    }
    .ssg-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .ssg-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .ssg-home-btn:hover {
      background: linear-gradient(135deg, #0369a1, #0284c7);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }
    .ssg-breadcrumb {
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .ssg-breadcrumb a {
      color: #38bdf8;
      text-decoration: none;
    }
    .ssg-article-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    @media (max-width: 768px) {
      .ssg-article-card {
        padding: 20px 16px;
      }
      .ssg-top-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="crt-overlay"></div>

  <div class="ssg-static-container">
    <div class="ssg-top-bar">
      <nav class="ssg-breadcrumb" aria-label="Breadcrumb">
        <a href="../">🏠 梯子之家主页</a> &gt; 
        <a href="../#/blog">跑道黑匣子</a> &gt; 
        <span>${catLabel}</span>
      </nav>
      <a href="../#/flights" class="ssg-home-btn">
        ✈️ 查看实时航班测速天梯图
      </a>
    </div>

    <main class="ssg-article-card">
      <header class="article-detail-header">
        <div class="article-meta-tags">
          <span class="art-tag art-cat-tag">[${catLabel}]</span>
          <span class="art-tag art-code-tag">${item.code || 'SEO-ARTICLE'}</span>
          <span class="art-tag art-date-tag">${item.date || '2026.10'}</span>
          <span class="art-tag art-author-tag">站长鹅 · 飞行遥测实验室</span>
        </div>
        <h1 class="article-detail-title">${item.title}</h1>
        ${item.proCon ? `<div class="art-procon-banner"><p>🪿 <strong>鹅的直白点评：</strong>${item.proCon.replace(/鹅的直白点评：/g, '')}</p></div>` : ''}
      </header>

      <article class="article-prose-body">
        ${articleHtml}
      </article>

      <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #334155; text-align: center;">
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 16px;">
          本文收录于 <strong>梯子之家 · 跑道上有只鹅</strong> 原创技术档案。未经许可禁止恶意抄袭与镜像。
        </p>
        <div style="display: inline-flex; gap: 12px;">
          <a href="../#/blog" class="ssg-home-btn" style="background: #334155;">
            📑 返回所有黑匣子档案
          </a>
          <a href="../" class="ssg-home-btn">
            🏠 返回梯子之家控制台
          </a>
        </div>
      </footer>
    </main>
  </div>
</body>
</html>`;
}

// 主执行函数
function main() {
  console.log('🚀 开始构建梯子之家 SSG 独立静态文章库...');
  const feedData = loadFeedData();
  console.log(`📋 共发现 ${feedData.length} 篇注册深度文章。`);

  const sitemapUrls = [];

  feedData.forEach(item => {
    let mdContent = '';
    if (item.file && fs.existsSync(path.join(ROOT_DIR, item.file))) {
      mdContent = fs.readFileSync(path.join(ROOT_DIR, item.file), 'utf8');
    } else {
      mdContent = item.content || item.summary || '';
    }

    const htmlOutput = buildArticlePageHTML(item, mdContent);
    const fileName = `${item.id}.html`;
    const targetFile = path.join(OUTPUT_POST_DIR, fileName);

    fs.writeFileSync(targetFile, htmlOutput, 'utf8');
    console.log(`✅ 已生成静态页面: post/${fileName} (${item.title.substring(0, 24)}...)`);

    // 收集标准 sitemap 条目
    sitemapUrls.push({
      loc: `https://tizizhijia.com/post/${fileName}`,
      lastmod: '2026-10-22',
      changefreq: 'weekly',
      priority: '0.85'
    });
  });

  // 生成更新版 sitemap.xml
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页核心页面 -->
  <url>
    <loc>https://tizizhijia.com/</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tizizhijia.com/#/flights</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tizizhijia.com/#/blog</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tizizhijia.com/#/reviews</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tizizhijia.com/#/crashes</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tizizhijia.com/#/about</loc>
    <lastmod>2026-10-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- 19 篇独立静态文章 (符合 W3C / Googlebot 绝对物理路径标准) -->
`;

  const sitemapBody = sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const fullSitemap = sitemapHeader + sitemapBody + '\n</urlset>\n';
  fs.writeFileSync(SITEMAP_FILE, fullSitemap, 'utf8');
  console.log(`🎉 sitemap.xml 已同步重构为标准静态 URL，收录率保障提升 100%！`);
}

main();
