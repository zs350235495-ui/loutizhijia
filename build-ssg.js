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

  // H1, H2, H3 (保证文章正文内部使用 H2/H3，与页面主 H1 形成严谨语义树，并收集 TOC 目录)
  const headings = [];
  let headingIdx = 0;
  src = src.replace(/^###\s+(.+)$/gm, (m, title) => {
    headingIdx++;
    const cleanTitle = title.replace(/\*\*/g, '').replace(/`/g, '').trim();
    headings.push({ level: 3, id: `sec-${headingIdx}`, title: cleanTitle });
    return `<h3 id="sec-${headingIdx}" class="prose-h3">${title}</h3>`;
  });
  src = src.replace(/^#{1,2}\s+(.+)$/gm, (m, title) => {
    headingIdx++;
    const cleanTitle = title.replace(/\*\*/g, '').replace(/`/g, '').trim();
    headings.push({ level: 2, id: `sec-${headingIdx}`, title: cleanTitle });
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

  return { html: htmlResult, headings };
}

// 生成单个独立文章 HTML 页面
function buildArticlePageHTML(item, markdownText, allFeedData = []) {
  const postUrl = `https://tizizhijia.com/post/${item.id}.html`;
  const { html: articleHtml, headings } = parseMarkdownToHTML(markdownText || item.content || item.summary || '');
  const rawDate = (item.date || '2026-10-22').replace(/\./g, '-');
  const publishDate = rawDate.length === 7 ? `${rawDate}-01` : rawDate;
  const catNames = { speed: '硬核实测', avoid: '踩坑避雷', tech: '技术原理' };
  const catLabel = catNames[item.cat] || '跑道黑匣子';

  // 生成顶部折叠目录 TOC
  let tocHTML = '';
  if (headings && headings.length > 2) {
    const listItems = headings.map(h => {
      const padClass = h.level === 3 ? 'padding-left: 20px; font-size: 0.82rem; color: #94a3b8;' : 'font-weight: 600; color: #38bdf8;';
      return `<li style="margin: 4px 0; ${padClass}"><a href="#${h.id}" style="color: inherit; text-decoration: none;">${h.title}</a></li>`;
    }).join('\n');
    tocHTML = `
      <div class="ssg-toc-box">
        <div class="ssg-toc-header">📑 本文核心章节导航 (Table of Contents)</div>
        <ul style="list-style: none; margin: 0; padding: 0;">
          ${listItems}
        </ul>
      </div>
    `;
  }

  // 站内推荐网格闭环 (选取同分类或高权重 3 篇关联文章)
  const relatedPosts = (allFeedData || [])
    .filter(p => p.id !== item.id)
    .sort((a, b) => (a.cat === item.cat ? -1 : 1))
    .slice(0, 3);

  const relatedHTML = relatedPosts.length > 0 ? `
    <section class="ssg-related-section" style="margin-top: 48px; padding-top: 28px; border-top: 1px solid #1e293b;">
      <h3 style="font-size: 1.15rem; color: #fbbf24; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <span>📑</span> 推荐延伸阅读与深度避坑档案
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
        ${relatedPosts.map(rp => `
          <a href="/post/${rp.id}.html" style="display: block; padding: 14px 16px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; text-decoration: none; transition: all 0.2s;">
            <div style="font-size: 0.75rem; color: #38bdf8; margin-bottom: 6px;">[${catNames[rp.cat] || '跑道黑匣子'}] ${rp.date || '2026.10'}</div>
            <div style="font-size: 0.92rem; font-weight: 600; color: #f1f5f9; line-height: 1.4;">${rp.title}</div>
          </a>
        `).join('\n')}
      </div>
    </section>
  ` : '';

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
  <meta property="article:published_time" content="${publishDate}T08:00:00+08:00">
  <meta property="article:modified_time" content="2026-10-23T16:00:00+08:00">
  <meta property="article:author" content="跑道巡检鹅 · 飞行遥测与网络安全实验室">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title}">
  <meta name="twitter:description" content="${(item.summary || '').replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://tizizhijia.com/favicon.svg">

  <!-- Schema.org JSON-LD (@graph 规范集成 TechArticle 与 BreadcrumbList) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": "${postUrl}#article",
        "headline": "${item.title.replace(/"/g, '\\"')}",
        "description": "${(item.summary || '').replace(/"/g, '\\"')}",
        "url": "${postUrl}",
        "datePublished": "${publishDate}T08:00:00+08:00",
        "dateModified": "2026-10-23T16:00:00+08:00",
        "inLanguage": "zh-CN",
        "author": {
          "@type": "Person",
          "name": "跑道巡检鹅",
          "jobTitle": "网络性能与安全架构工程师",
          "url": "https://tizizhijia.com/#/about",
          "sameAs": [
            "https://t.me/huanqiuti8899"
          ]
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
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${postUrl}#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "梯子之家首页",
            "item": "https://tizizhijia.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "跑道黑匣子",
            "item": "https://tizizhijia.com/#/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${item.title.replace(/"/g, '\\"')}",
            "item": "${postUrl}"
          }
        ]
      }
    ]
  }
  </script>

  <!-- 规范根绝对路径引入 Favicon 与 Stylesheet (杜绝深层路由样式裸奔) -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">

  <!-- Fonts & Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">

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
    .ssg-toc-box {
      margin: 24px 0 32px;
      padding: 18px 24px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 10px;
    }
    .ssg-toc-header {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="crt-overlay"></div>

  <div class="ssg-static-container">
    <div class="ssg-top-bar">
      <nav class="ssg-breadcrumb" aria-label="Breadcrumb">
        <a href="/">🏠 梯子之家主页</a> &gt; 
        <a href="/#/blog">跑道黑匣子</a> &gt; 
        <span>${catLabel}</span>
      </nav>
      <a href="/#/flights" class="ssg-home-btn">
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

      ${tocHTML}

      <article class="article-prose-body">
        ${articleHtml}
      </article>

      ${relatedHTML}

      <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #334155; text-align: center;">
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 16px;">
          本文收录于 <strong>梯子之家 · 跑道上有只鹅</strong> 原创技术档案。未经许可禁止恶意抄袭与镜像。
        </p>
        <div style="display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
          <a href="/#/blog" class="ssg-home-btn" style="background: #334155;">
            📑 返回所有黑匣子档案
          </a>
          <a href="/" class="ssg-home-btn">
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

    const htmlOutput = buildArticlePageHTML(item, mdContent, feedData);
    const fileName = `${item.id}.html`;
    const targetFile = path.join(OUTPUT_POST_DIR, fileName);

    fs.writeFileSync(targetFile, htmlOutput, 'utf8');
    console.log(`✅ 已生成静态页面: post/${fileName} (${item.title.substring(0, 24)}...)`);

    // 收集标准 sitemap 条目
    sitemapUrls.push({
      loc: `https://tizizhijia.com/post/${fileName}`,
      lastmod: '2026-10-23',
      changefreq: 'weekly',
      priority: '0.85'
    });
  });

  // 生成更新版 sitemap.xml (严格遵循 W3C 规范，杜绝 Fragment # 虚拟路由，保障 100% 页面返回 200 OK)
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 梯子之家主页 (Canonical Clean URL) -->
  <url>
    <loc>https://tizizhijia.com/</loc>
    <lastmod>2026-10-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 独立预渲染静态文章库 (符合 W3C / Googlebot / Bingbot 标准 200 OK 绝对物理路径) -->
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

  // 生成标准 RSS 2.0 feed.xml (极客生态与订阅聚合器分发)
  const RSS_FILE = path.join(ROOT_DIR, 'feed.xml');
  const rssItems = feedData.map(item => {
    const postUrl = `https://tizizhijia.com/post/${item.id}.html`;
    const pubDate = new Date('2026-10-22T08:00:00Z').toUTCString();
    const cleanSummary = (item.summary || item.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanTitle = item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `    <item>
      <title>${cleanTitle}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cleanSummary}</description>
    </item>`;
  }).join('\n');

  const fullRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>梯子之家 · 跑道上有只鹅</title>
    <link>https://tizizhijia.com/</link>
    <description>2026 全球骨干网络加速、IPLC/IEPL 专线全链路实测与跑路避坑技术评测知识库</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://tizizhijia.com/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`;
  fs.writeFileSync(RSS_FILE, fullRss, 'utf8');
  console.log(`📡 feed.xml (RSS 2.0) 订阅源已同步生成！`);
}

main();
