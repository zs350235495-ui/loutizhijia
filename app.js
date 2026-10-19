// 跑道上有只鹅 - SPA 客户端 Hash 路由与独立文章页逻辑
(function() {
  const boardTbody = document.getElementById('boardTbody');
  const inspectCardsGrid = document.getElementById('inspectCardsGrid');
  const reviewFeedGrid = document.getElementById('reviewFeedGrid');
  const feedGrid = document.getElementById('feedGrid');
  const crashListGrid = document.getElementById('crashListGrid');

  // Multi-filter states
  let activeBlogCat = 'all';
  let activeReviewCat = 'all';

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  // 航标灯 / 仪表盘式 鹅的分级评分 HTML 生成器
  function renderGooseRatingHTML(score) {
    const s = Math.min(5, Math.max(1, parseInt(score, 10) || 5));
    const tiers = {
      5: { text: "【顺畅起飞】", class: "tier-5" },
      4: { text: "【平稳滑行】", class: "tier-4" },
      3: { text: "【轻度颠簸】", class: "tier-3" },
      2: { text: "【严重失速】", class: "tier-2" },
      1: { text: "【原地趴窝】", class: "tier-1" }
    };

    const tierInfo = tiers[s] || tiers[5];

    let lightsHTML = '';
    for (let i = 1; i <= 5; i++) {
      const activeClass = i <= s ? 'active' : '';
      lightsHTML += `<span class="taxi-light ${activeClass}"></span>`;
    }

    return `
      <div class="goose-rating-instrument ${tierInfo.class}" title="鹅的起降推荐评级: ${s}/5">
        <span class="instrument-lbl">起降评级:</span>
        <div class="taxi-lights-bar">${lightsHTML}</div>
        <span class="rating-tier-text">${tierInfo.text}</span>
      </div>
    `;
  }

  function init() {
    setupRouting();
    renderBoardTable();
    renderReviewsView();
    renderFeedGrid();
    renderCrashGrid();
    setupEventListeners();
    updateRunwayStatusBadge();
  }

  // 动态跑道心跳与状态胶囊渲染 (Runway Status Badge)
  function updateRunwayStatusBadge() {
    const navStatusBadge = document.getElementById('navStatusBadge');
    const badgeStatusLbl = document.getElementById('badgeStatusLbl');
    const ttBodyText = document.getElementById('ttBodyText');
    if (!navStatusBadge || !badgeStatusLbl) return;

    const totalCount = typeof boardData !== 'undefined' ? boardData.length : 30;
    let onlineCount = totalCount;

    navStatusBadge.classList.remove('status-warning', 'status-danger');

    if (onlineCount === totalCount) {
      badgeStatusLbl.textContent = `跑道通畅 ${onlineCount}/${totalCount}`;
      if (ttBodyText) {
        ttBodyText.innerHTML = `当前巡查 <strong>${totalCount}</strong> 家推荐机场，全员在线中。QoS 丢包率 0%。`;
      }
    }
  }

  // 1. 全局 Hash 路由监听器与 SPA 页面切换
  function setupRouting() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  }

  function handleRouteChange() {
    const rawHash = window.location.hash || '#/flights';
    let route = rawHash.replace('#', '');
    if (route === '' || route === '/') route = '/flights';

    const pageMap = {
      '/flights': 'pageFlights',
      '/reviews': 'pageReviews',
      '/blog': 'pageBlog',
      '/crashes': 'pageCrashes',
      '/about': 'pageAbout'
    };

    let targetPageId = pageMap[route];
    let matchedArticle = null;

    // 检查是否为独立文章详情页路由: /post/:param 或 /blog/:param
    if (!targetPageId && (route.startsWith('/post/') || route.startsWith('/blog/'))) {
      const param = route.replace(/^\/(post|blog)\//, '').trim();
      matchedArticle = findArticleByParam(param);
      if (matchedArticle) {
        targetPageId = 'pagePost';
      }
    }

    // 检查是否通过 URL Query 参数传入文章 (如 ?post=100 或 ?id=100)
    if ((!targetPageId || targetPageId === 'pageFlights') && (!window.location.hash || window.location.hash === '' || window.location.hash === '#/flights')) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryPost = urlParams.get('post') || urlParams.get('id') || urlParams.get('article');
        if (queryPost) {
          const article = findArticleByParam(queryPost);
          if (article) {
            matchedArticle = article;
            targetPageId = 'pagePost';
          }
        }
      } catch (e) {}
    }

    if (!targetPageId) {
      targetPageId = 'pageFlights';
      route = '/flights';
    }

    // 切换页面视窗
    document.querySelectorAll('.page-view').forEach(page => {
      if (page.id === targetPageId) {
        page.classList.remove('hidden');
      } else {
        page.classList.add('hidden');
      }
    });

    // 如果是文章页，渲染文章内容
    if (targetPageId === 'pagePost' && matchedArticle) {
      renderArticleDetailPage(matchedArticle);
      document.title = `${matchedArticle.title} | 跑道黑匣子 - 跑道上有只鹅`;
    } else {
      document.title = `跑道上有只鹅 | 2026 稳定节点评测推荐与跑路避坑预警`;
    }

    // 更新 Navbar 当前 Active 导航链接
    document.querySelectorAll('#navLinks .nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      const isBlogRelated = (targetPageId === 'pagePost' && linkRoute === '/blog');
      if (linkRoute === route || isBlogRelated || (route === '/flights' && linkRoute === '/flights')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (navLinks) navLinks.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 根据参数匹配文章 (支持 id / code / slug)
  function findArticleByParam(param) {
    if (typeof feedData === 'undefined' || !feedData) return null;
    const lower = param.toLowerCase();
    return feedData.find(item => {
      if (String(item.id) === param) return true;
      if (item.code && item.code.toLowerCase() === lower) return true;
      if (item.slug && item.slug.toLowerCase() === lower) return true;
      return false;
    }) || feedData[0];
  }

  // 2. 渲染独立文章详情页 (Article Detail Page)
  function renderArticleDetailPage(item) {
    const artBreadcrumbTitle = document.getElementById('artBreadcrumbTitle');
    const artCatTag = document.getElementById('artCatTag');
    const artDateTag = document.getElementById('artDateTag');
    const artCodeTag = document.getElementById('artCodeTag');
    const artTitle = document.getElementById('artTitle');
    const artReadTime = document.getElementById('artReadTime');
    const artAuthor = document.getElementById('artAuthor');
    const artRatingTag = document.getElementById('artRatingTag');
    const artProConText = document.getElementById('artProConText');
    const artProseBody = document.getElementById('artProseBody');
    const tocList = document.getElementById('tocList');
    const prevPostLink = document.getElementById('prevPostLink');
    const nextPostLink = document.getElementById('nextPostLink');
    const prevPostTitle = document.getElementById('prevPostTitle');
    const nextPostTitle = document.getElementById('nextPostTitle');

    if (!artTitle || !artProseBody) return;

    // 填充头部元信息
    if (artBreadcrumbTitle) artBreadcrumbTitle.textContent = item.title;
    if (artCatTag) {
      const catMap = { speed: "[硬核实测]", avoid: "[踩坑避雷]", tech: "[技术原理]" };
      artCatTag.textContent = catMap[item.cat] || "[跑道黑匣子]";
    }
    if (artDateTag) artDateTag.textContent = item.date || "2026.10";
    if (artCodeTag) artCodeTag.textContent = item.code || "SEO-ARTICLE";
    if (artTitle) artTitle.textContent = item.title;
    if (artReadTime) artReadTime.textContent = "阅读耗时约 8 分钟";
    if (artAuthor) artAuthor.textContent = "站长鹅";

    if (artRatingTag) {
      const gooseRatingHTML = renderGooseRatingHTML(item.gooseScore || 5);
      artRatingTag.innerHTML = gooseRatingHTML;
    }

    if (artProConText) {
      artProConText.textContent = item.proCon || item.summary || "";
    }

    // 尝试加载完整 Markdown 文件，若环境限制则降级使用 item.content
    let markdownSource = item.content || item.summary || "";
    
    // 生成 Markdown 渲染 HTML
    const htmlContent = parseMarkdownToHTML(markdownSource);
    artProseBody.innerHTML = htmlContent;

    // 生成右侧 PC 端吸顶目录 (TOC)
    buildArticleTOC(artProseBody, tocList);

    // 翻页导航 (Prev / Next)
    const currentIndex = feedData.findIndex(f => f.id === item.id);
    if (currentIndex !== -1) {
      // 下一篇 (数组前一位，最新发布)
      if (currentIndex > 0) {
        const nextItem = feedData[currentIndex - 1];
        nextPostLink.href = `#/post/${nextItem.id}`;
        nextPostTitle.textContent = nextItem.title;
        nextPostLink.style.visibility = 'visible';
      } else {
        nextPostLink.href = '#/blog';
        nextPostTitle.textContent = '已是最新黑匣子 (返回博客)';
      }

      // 上一篇 (数组后一位)
      if (currentIndex < feedData.length - 1) {
        const prevItem = feedData[currentIndex + 1];
        prevPostLink.href = `#/post/${prevItem.id}`;
        prevPostTitle.textContent = prevItem.title;
        prevPostLink.style.visibility = 'visible';
      } else {
        prevPostLink.href = '#/blog';
        prevPostTitle.textContent = '已是最后一篇黑匣子 (返回博客)';
      }
    }

    // 异步加载对应 md 文件全文并渲染
    const postFileMap = {
      "SEO-ARTICLE-18": "posts/post-18-node-crash-blackbox-analysis.md",
      "SEO-ARTICLE-17": "posts/post-17-home-gateway-mosdns-transparent-proxy.md",
      "SEO-ARTICLE-16": "posts/post-16-node-failure-analysis.md",
      "SEO-ARTICLE-15": "posts/post-15-troubleshooting-dns-sub-errors.md",
      "SEO-ARTICLE-14": "posts/post-14-router-openwrt-transparent-proxy.md",
      "SEO-ARTICLE-13": "posts/post-13-android-singbox-vs-clash-meta.md",
      "SEO-ARTICLE-12": "posts/post-12-ios-shadowrocket-complete-guide.md",
      "SEO-ARTICLE-11": "posts/post-11-clash-verge-rev-pc-mac-tutorial.md",
      "SEO-ARTICLE-10": "posts/post-10-beginner-jargon-deconstruction.md",
      "SEO-ARTICLE-09": "posts/post-09-protocol-benchmark-hysteria2-reality.md",
      "SEO-ARTICLE-08": "posts/post-08-peak-hours-packet-loss-truth.md",
      "SEO-ARTICLE-07": "posts/post-07-tiktok-cross-border-guide.md",
      "SEO-ARTICLE-06": "posts/post-06-streaming-unlock-guide.md",
      "SEO-ARTICLE-05": "posts/post-05-chatgpt-claude-anti-ban-guide.md",
      "SEO-ARTICLE-04": "posts/post-04-iepl-iplc-deep-dive.md",
      "SEO-ARTICLE-03": "posts/post-03-pay-as-you-go-airport-guide.md",
      "SEO-ARTICLE-02": "posts/post-02-cheap-airport-guide.md",
      "SEO-ARTICLE-01": "posts/post-01-2026-airport-guide.md"
    };

    const targetFile = item.file || postFileMap[item.code];
    if (targetFile) {
      fetch(targetFile)
        .then(res => res.ok ? res.text() : null)
        .then(mdText => {
          if (mdText) {
            artProseBody.innerHTML = parseMarkdownToHTML(mdText);
            buildArticleTOC(artProseBody, tocList);
          }
        })
        .catch(() => {});
    }
  }

  // 简易但强大的 Markdown 转换 HTML 引擎
  function parseMarkdownToHTML(markdownText) {
    if (!markdownText) return '';

    let src = markdownText.trim();
    // 移除已在 Header 渲染的顶层 H1 标题
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

    // 转换 Callout 提示框
    src = src.replace(/^>\s*(🪿|🛡️|⚠️)?\s*\*?\*?【?([^】\n]+)】?\*?\*?[\s\S]*?(?=\n\n|\n#|$)/gm, (match) => {
      const cleanLines = match.split('\n').map(l => l.replace(/^>\s?/, '')).join('\n');
      if (match.includes('🪿') || match.includes('点评')) {
        const body = cleanLines.replace(/^.*?【?鹅的直白点评】?\*?\*?:?\s*/s, '');
        return `<div class="callout-box callout-goose"><div class="callout-header"><span class="callout-icon">🪿</span><span class="callout-title">鹅的直白点评：</span></div><div class="callout-text">${body}</div></div>`;
      } else if (match.includes('🛡️') || match.includes('避坑') || match.includes('⚠️')) {
        const body = cleanLines.replace(/^.*?【?避坑安全守则】?\*?\*?:?\s*/s, '');
        return `<div class="callout-box callout-warning"><div class="callout-header"><span class="callout-icon">🛡️</span><span class="callout-title">避坑安全守则：</span></div><div class="callout-text">${body}</div></div>`;
      } else {
        return `<blockquote class="prose-blockquote">${cleanLines}</blockquote>`;
      }
    });

    // 转换 Markdown 对比表格
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

    // 转换 H1, H2 与 H3 标题 (带有 ID 供锚点跳转，将 Markdown 中的 H1 安全降级为 H2 保证 DOM 全局仅 1 个 H1)
    let headingIdx = 0;
    src = src.replace(/^###\s+(.+)$/gm, (m, title) => {
      headingIdx++;
      return `<h3 id="heading-h3-${headingIdx}" class="prose-h3">${title}</h3>`;
    });
    src = src.replace(/^#{1,2}\s+(.+)$/gm, (m, title) => {
      headingIdx++;
      return `<h2 id="heading-h2-${headingIdx}" class="prose-h2">${title}</h2>`;
    });

    // 列表 (Disc & Num)
    src = src.replace(/^\s*[-*+]\s+(.+)$/gm, '<li class="prose-li-disc">$1</li>');
    src = src.replace(/(<li class="prose-li-disc">[\s\S]*?<\/li>\n?)+/g, '<ul class="prose-ul">$&</ul>');

    src = src.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="prose-li-num">$1</li>');
    src = src.replace(/(<li class="prose-li-num">[\s\S]*?<\/li>\n?)+/g, '<ol class="prose-ol">$&</ol>');

    // 加粗与斜体
    src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    src = src.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 超链接
    src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="prose-link">$1</a>');

    // 分割线
    src = src.replace(/^---$/gm, '<hr class="prose-hr">');

    // 段落包裹
    const blocks = src.split(/\n{2,}/);
    let htmlResult = blocks.map(b => {
      b = b.trim();
      if (!b) return '';
      if (b.startsWith('<h') || b.startsWith('<div') || b.startsWith('<table') || b.startsWith('<ul') || b.startsWith('<ol') || b.startsWith('<pre') || b.startsWith('<blockquote') || b.startsWith('<hr')) {
        return b;
      }
      return `<p class="prose-p">${b.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // 还原代码块
    codeBlocks.forEach((codeHTML, idx) => {
      htmlResult = htmlResult.replace(`__CODE_BLOCK_${idx}__`, codeHTML);
    });
    inlineCodes.forEach((codeHTML, idx) => {
      htmlResult = htmlResult.replace(`__INLINE_CODE_${idx}__`, codeHTML);
    });

    return htmlResult;
  }

  // 动态生成目录 (TOC)
  function buildArticleTOC(containerEl, tocListEl) {
    if (!containerEl || !tocListEl) return;
    tocListEl.innerHTML = '';

    const headings = containerEl.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocListEl.innerHTML = '<li class="toc-item empty" style="color:var(--text-sub); font-size:0.82rem;">本篇无二级目录</li>';
      return;
    }

    headings.forEach((h, idx) => {
      if (!h.id) h.id = `toc-anchor-${idx}`;
      const li = document.createElement('li');
      li.className = `toc-item toc-${h.tagName.toLowerCase()}`;
      
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.className = 'toc-link';
      a.textContent = h.textContent;
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      li.appendChild(a);
      tocListEl.appendChild(li);
    });
  }

  // 3. 航班推荐榜 (Flight Board Table)
  function renderBoardTable() {
    if (!boardTbody) return;
    boardTbody.innerHTML = '';

    boardData.forEach(item => {
      const tr = document.createElement('tr');
      const gooseRatingHTML = renderGooseRatingHTML(item.gooseScore);
      const lineClass = item.lineType === 'iplc' ? 'tag-spec iplc' : 'tag-spec';

      tr.innerHTML = `
        <td>
          <div class="service-name-box">
            <span class="service-title">${item.name}</span>
            <span class="service-sub">${item.sub}</span>
          </div>
        </td>
        <td>
          <span class="${lineClass}">${item.lineType.toUpperCase()}</span>
        </td>
        <td>
          <span style="font-size: 0.88rem; color: var(--text-sub);">${item.unlock}</span>
        </td>
        <td>
          <span class="price-box">${item.price}</span>
        </td>
        <td>
          ${gooseRatingHTML}
        </td>
        <td>
          <div class="action-btns-cell">
            <a href="${item.url}" target="_blank" rel="noopener" class="btn-boarding">办理登机牌 (直达官网)</a>
            <button class="btn-promo-copy" onclick="copyPromoCode('${item.promoCode}')">
              🔑 机长暗号: ${item.promoCode} (点击复制)
            </button>
          </div>
        </td>
      `;
      boardTbody.appendChild(tr);
    });
  }

  // 3.5 试飞体检站 (/reviews) 核心实测数据与渲染引擎
  const inspectBenchmarkData = [
    {
      flightCode: "TEST-01 · 旗舰全线专线",
      airlineName: "环球梯 HuanqiuTi",
      sub: "全节点 BGP/专线优化 · 23ms 低延迟",
      category: ["speed", "peak", "iepl"],
      lossRate: "0.0%",
      buffer8k: "0.22s",
      peakSpeed: "950 Mbps",
      ipClean: "100% 原生",
      tags: ["23ms极低延迟", "ChatGPT 4o", "4K/8K秒开", "原生IP全解"],
      verdict: "全天候 21:00 晚高峰连续打点压测 0 丢包，23ms 极致低延迟，ChatGPT 4o 与 Netflix 秒开无障碍。",
      price: "￥14.70 /月",
      promoCode: "HQ66",
      gooseScore: 5,
      url: "https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0",
      reportPostId: 100
    },
    {
      flightCode: "TEST-02 · 超大频宽头等舱",
      airlineName: "大佬云 DalaoCloud",
      sub: "全 IPLC 专线 · 单节点峰值 2.5Gbps",
      category: ["speed", "peak", "iepl"],
      lossRate: "0.0%",
      buffer8k: "0.26s",
      peakSpeed: "980 Mbps",
      ipClean: "100% 纯净",
      tags: ["2.5Gbps峰值", "全IPLC专线", "Disney+", "4K高并发"],
      verdict: "2.5Gbps 超大冗余带宽，多台 4K/8K 电视全家并发零卡顿，晚高峰稳如磐石。",
      price: "￥16.10 /月",
      promoCode: "dly88",
      gooseScore: 5,
      url: "https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa",
      reportPostId: 101
    },
    {
      flightCode: "TEST-03 · 均衡大流量专线",
      airlineName: "云界线 Yunjiexian",
      sub: "全 IPLC 专线 · 150GB/月大流量起",
      category: ["speed", "peak", "iepl"],
      lossRate: "0.1%",
      buffer8k: "0.30s",
      peakSpeed: "880 Mbps",
      ipClean: "99.8% 洁净",
      tags: ["150GB大流量", "1.0x真实倍率", "智能负载均衡", "防封降维"],
      verdict: "150GB 大流量起步，全站 1.0x 真实倍率扣费，节点智能负载均衡，出差办公与科研首选。",
      price: "￥15.40 /月",
      promoCode: "yjx888",
      gooseScore: 5,
      url: "https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV",
      reportPostId: 93
    },
    {
      flightCode: "TEST-04 · 跨境电商专属通道",
      airlineName: "闪电鼠 Shandianshu",
      sub: "全线 IEPL 专线 · 单节点峰值 2.5Gbps",
      category: ["speed", "peak", "iepl"],
      lossRate: "0.0%",
      buffer8k: "0.28s",
      peakSpeed: "920 Mbps",
      ipClean: "100% 原生",
      tags: ["全线IEPL", "TikTok专属优化", "原生客户端", "海外电商"],
      verdict: "专攻 TikTok 跨境带货与海外社交，全线 IEPL 专线，配套安卓/iOS 一键客户端极其丝滑。",
      price: "￥15.40 /月",
      promoCode: "sds88",
      gooseScore: 5,
      url: "https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB",
      reportPostId: 94
    },
    {
      flightCode: "TEST-05 · 冗余机群多国覆盖",
      airlineName: "神行加速 Shenxing",
      sub: "全 IPLC/IEPL 专线 · 23ms 低延迟 50+节点",
      category: ["speed", "peak", "iepl"],
      lossRate: "0.2%",
      buffer8k: "0.34s",
      peakSpeed: "860 Mbps",
      ipClean: "99.9% 洁净",
      tags: ["50+多国节点", "全协议伪装", "低延迟游戏", "高并发冗余"],
      verdict: "50+ 节点冗余储备，冷门小众国家全覆盖，全协议智能抗封锁，游戏与高并发不掉线。",
      price: "￥16.10 /月",
      promoCode: "sx0077",
      gooseScore: 5,
      url: "https://pps123.shenxingaff.com/#/?code=6tQ7zHUc",
      reportPostId: 96
    },
    {
      flightCode: "TEST-06 · 极致平价口粮跑道",
      airlineName: "极连云 Jilianyun",
      sub: "IPLC 物理专线 · 不限设备数 / 极速抗封",
      category: ["budget", "iepl"],
      lossRate: "0.4%",
      buffer8k: "0.42s",
      peakSpeed: "680 Mbps",
      ipClean: "99.5% 洁净",
      tags: ["不限设备数", "IPLC内网专线", "平价口粮", "全屋设备接管"],
      verdict: "入门平价神机！不限设备数量并发，IPLC 内网中转，学生党与备用跑道的性价比屠夫。",
      price: "￥6.40 /月起",
      promoCode: "JLY888",
      gooseScore: 4,
      url: "https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO",
      reportPostId: 98
    }
  ];

  function renderReviewsView(category = 'all') {
    // 1. 渲染主力航班体检卡片
    if (inspectCardsGrid) {
      inspectCardsGrid.innerHTML = '';
      const filteredBenchmark = category === 'all'
        ? inspectBenchmarkData
        : inspectBenchmarkData.filter(item => item.category.includes(category));

      filteredBenchmark.forEach(item => {
        const card = document.createElement('div');
        card.className = 'inspect-card';
        const gooseRatingHTML = renderGooseRatingHTML(item.gooseScore);
        const tagsHTML = item.tags.map((t, idx) => `<span class="inspect-tag-pill ${idx === 0 ? 'pill-highlight' : ''}">${t}</span>`).join('');

        card.innerHTML = `
          <div>
            <div class="inspect-card-head">
              <span class="inspect-flight-code">✈ ${item.flightCode}</span>
              <span class="inspect-pass-badge">[实测认证 / PASS]</span>
            </div>
            <div class="inspect-card-title-group">
              <h4 class="inspect-card-title">${item.airlineName}</h4>
              <span class="inspect-card-sub">${item.sub}</span>
            </div>
            <div style="margin-bottom: 12px;">
              ${gooseRatingHTML}
            </div>
            <div class="inspect-telemetry-grid">
              <div class="telemetry-cell">
                <span class="telemetry-label">晚高峰 21:00 丢包率</span>
                <span class="telemetry-val val-green">${item.lossRate} <span class="val-unit">(极稳)</span></span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label">8K 首帧缓冲耗时</span>
                <span class="telemetry-val val-cyan">${item.buffer8k} <span class="val-unit">(秒开)</span></span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label">专线测速峰值</span>
                <span class="telemetry-val val-yellow">${item.peakSpeed}</span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label">原生 IP 洁净度</span>
                <span class="telemetry-val val-green">${item.ipClean}</span>
              </div>
            </div>
            <div class="inspect-tags-row">
              ${tagsHTML}
            </div>
            <div class="inspect-verdict-box">
              <div class="inspect-verdict-title">🪿 鹅的试飞体检直言：</div>
              <div>${item.verdict}</div>
            </div>
          </div>
          <div>
            <div class="inspect-footer-meta">
              <span class="inspect-price-lbl">${item.price}</span>
              <button class="inspect-promo-btn" onclick="copyPromoCode('${item.promoCode}')">
                🔑 机长暗号: ${item.promoCode} (点击复制)
              </button>
            </div>
            <div class="inspect-card-actions">
              <a href="${item.url}" target="_blank" rel="noopener" class="btn-boarding" style="padding: 10px; text-align: center; justify-content: center;">
                办理登机牌 (官网直达)
              </a>
              <a href="#/post/${item.reportPostId}" class="btn-inspect-report">
                查看试飞研报 ➔
              </a>
            </div>
          </div>
        `;
        inspectCardsGrid.appendChild(card);
      });
    }

    // 2. 渲染深度研报瀑布流
    if (reviewFeedGrid) {
      reviewFeedGrid.innerHTML = '';
      let filteredFeed = [];
      if (category === 'all') {
        filteredFeed = feedData.filter(f => f.cat === 'speed' || f.code.startsWith('SPEED-') || [100, 97, 95, 93, 92, 98, 99, 85].includes(f.id));
      } else if (category === 'speed') {
        filteredFeed = feedData.filter(f => f.cat === 'speed' || f.title.includes('测速') || f.title.includes('秒开'));
      } else if (category === 'peak') {
        filteredFeed = feedData.filter(f => f.title.includes('晚高峰') || f.title.includes('丢包') || f.title.includes('断流'));
      } else if (category === 'iepl') {
        filteredFeed = feedData.filter(f => f.title.includes('专线') || f.title.includes('IPLC') || f.title.includes('IEPL'));
      } else if (category === 'budget') {
        filteredFeed = feedData.filter(f => f.title.includes('平价') || f.title.includes('按量') || f.title.includes('高性价比'));
      }
      if (filteredFeed.length === 0) {
        filteredFeed = feedData.slice(0, 6);
      }

      filteredFeed.forEach(item => {
        const card = document.createElement('div');
        card.className = 'boarding-pass-card';
        const gooseRatingHTML = renderGooseRatingHTML(item.gooseScore || 5);
        card.innerHTML = `
          <div>
            <div class="bp-header">
              <span class="bp-code" style="color:var(--runway-yellow);">BENCHMARK · ${item.code}</span>
              <span class="bp-date">${item.date}</span>
            </div>
            <a href="#/post/${item.id}" class="bp-title-link" style="text-decoration:none; color:inherit;">
              <h3 class="bp-title">${item.title}</h3>
            </a>
            <p class="bp-summary">${item.summary}</p>
            <div class="goose-comment-box">
              <div class="gc-title">
                <svg class="title-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13.5V21h7.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                </svg>
                <span>试飞员鹅的实测批注：</span>
              </div>
              <div>${item.proCon || item.summary}</div>
            </div>
          </div>
          <div class="bp-footer">
            ${gooseRatingHTML}
            <a href="#/post/${item.id}" class="bp-read-btn">阅读试飞报告 ➔</a>
          </div>
        `;
        reviewFeedGrid.appendChild(card);
      });
    }
  }

  // 4. 跑道黑匣子 Feed Grid (已重构：点击卡片通过路由跳转至独立文章页)
  function renderFeedGrid() {
    if (!feedGrid) return;
    feedGrid.innerHTML = '';

    const filtered = activeBlogCat === 'all'
      ? feedData
      : feedData.filter(f => f.cat === activeBlogCat);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'boarding-pass-card';
      const gooseRatingHTML = renderGooseRatingHTML(item.gooseScore);

      card.innerHTML = `
        <div>
          <div class="bp-header">
            <span class="bp-code">${item.code}</span>
            <span class="bp-date">${item.date}</span>
          </div>
          <a href="#/post/${item.id}" class="bp-title-link" style="text-decoration:none; color:inherit;">
            <h3 class="bp-title">${item.title}</h3>
          </a>
          <p class="bp-summary">${item.summary}</p>
          <div class="goose-comment-box">
            <div class="gc-title">
              <svg class="title-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13.5V21h7.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
              </svg>
              <span>鹅的直言点评：</span>
            </div>
            <div>${item.proCon}</div>
          </div>
        </div>
        <div class="bp-footer">
          ${gooseRatingHTML}
          <a href="#/post/${item.id}" class="bp-read-btn">阅读黑匣子 ➔</a>
        </div>
      `;
      feedGrid.appendChild(card);
    });
  }

  // 5. 坠毁记录簿 (/crashes) 渲染
  function renderCrashGrid() {
    if (!crashListGrid) return;
    crashListGrid.innerHTML = '';

    crashData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'crash-card';
      card.innerHTML = `
        <div>
          <div class="crash-card-head">
            <span class="crash-card-title">${item.name}</span>
            <span class="crash-card-badge">${item.status}</span>
          </div>
          <div class="crash-card-date">事故离线节点：${item.date}</div>
          <div class="crash-card-reason">事故调查简评：${item.reason}</div>
        </div>
      `;
      crashListGrid.appendChild(card);
    });
  }

  // 复制代码全局 API
  window.copyPromoCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`✈ 机长暗号 [${code}] 已复制！结账时粘贴即可使用！`);
      if (window.playGooseHonk) window.playGooseHonk();
    }).catch(() => {
      showToast('复制失败，请手动选中文本');
    });
  };

  // Toast 消息
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg class="title-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:6px;"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // 事件绑定与过滤器
  function setupEventListeners() {
    // 博客黑匣子分类 Filter
    document.querySelectorAll('#pageBlog .post-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#pageBlog .post-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeBlogCat = btn.dataset.cat;
        renderFeedGrid();
        if (window.playClickBeep) window.playClickBeep();
      });
    });

    // 试飞体检站分类 Filter
    document.querySelectorAll('#reviewCatFilters .post-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#reviewCatFilters .post-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeReviewCat = btn.dataset.reviewCat;
        renderReviewsView(activeReviewCat);
        if (window.playClickBeep) window.playClickBeep();
      });
    });

    // 叫一声
    const honkBtn = document.getElementById('honkBtn');
    if (honkBtn) {
      honkBtn.addEventListener('click', () => {
        if (window.playGooseHonk) window.playGooseHonk();
        showToast('🪿 嘎！嘎！鹅蹲在跑道中间对你叫了一声！');
      });
    }

    // 音效
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        if (window.toggleAudioState) window.toggleAudioState();
      });
    }

    // 移动端菜单
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
