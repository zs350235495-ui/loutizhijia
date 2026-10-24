const fs = require('fs');
const path = require('path');

let errors = [];
let passed = 0;

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error('❌ ' + message);
  } else {
    passed++;
    console.log('✅ ' + message);
  }
}

console.log('=== 开始 SEO 架构与 E-E-A-T 完整性审计 ===\n');

// 1. 检查 index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('https://schema.org'), 'index.html 包含 Schema.org 上下文');
assert(indexHtml.includes('"@type": "WebSite"'), 'index.html 包含 WebSite 实体');
assert(indexHtml.includes('"@type": "Organization"'), 'index.html 包含 Organization 实体');
assert(indexHtml.includes('"@type": "Person"'), 'index.html 包含权威作者 Person 实体');
assert(indexHtml.includes('https://t.me/huanqiuti8899'), 'index.html 声明了官方 Telegram 触点');
assert(indexHtml.includes('"@type": "CollectionPage"'), 'index.html 包含 CollectionPage 实体');
assert(indexHtml.includes('"@type": "ItemList"'), 'index.html 包含 ItemList 实体');
assert(indexHtml.includes('"@type": "FAQPage"'), 'index.html 包含 FAQPage 实体');
assert(indexHtml.includes('<link rel="canonical" href="https://tizizhijia.com/">'), 'index.html 规范 Canonical Clean URL');
assert(indexHtml.includes('href="/styles.css"'), 'index.html 样式表使用根绝对路径');
assert(indexHtml.includes('href="/favicon.svg"'), 'index.html Favicon 使用根绝对路径');
assert(!indexHtml.includes('href="post/'), 'index.html 杜绝了相对路径 post/*.html');
assert(indexHtml.includes('href="/post/82.html"'), 'index.html 底层内链使用根绝对路径');

// 标题数量检查
const indexH1Matches = indexHtml.match(/<h1[^>]*>/gi) || [];
assert(indexH1Matches.length === 1, 'index.html 严格仅包含 1 个 <h1> 顶级标题 (当前: ' + indexH1Matches.length + ')');

// 2. 检查 404.html
const errHtml = fs.readFileSync('404.html', 'utf8');
assert(errHtml.includes('<meta name="robots" content="noindex, follow">'), '404.html 正确声明 noindex, follow');
assert(errHtml.includes('href="/styles.css"'), '404.html 样式表采用根绝对路径');
assert(errHtml.includes('href="/favicon.svg"'), '404.html Favicon 采用根绝对路径');
assert(errHtml.includes('href="/"'), '404.html 提供指向首页的根绝对路径有效内链');

// 3. 检查 robots.txt
const robotsTxt = fs.readFileSync('robots.txt', 'utf8');
assert(robotsTxt.includes('User-agent: Googlebot'), 'robots.txt 显式支持 Googlebot');
assert(robotsTxt.includes('User-agent: GPTBot'), 'robots.txt 显式支持 GPTBot');
assert(robotsTxt.includes('User-agent: ClaudeBot'), 'robots.txt 显式支持 ClaudeBot');
assert(robotsTxt.includes('User-agent: PerplexityBot'), 'robots.txt 显式支持 PerplexityBot');
assert(robotsTxt.includes('User-agent: Applebot-Extended'), 'robots.txt 显式支持 Applebot-Extended');
assert(robotsTxt.includes('Sitemap: https://tizizhijia.com/sitemap.xml'), 'robots.txt 声明标准 Sitemap');

// 4. 检查 sitemap.xml
const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
assert(!sitemapXml.includes('#'), 'sitemap.xml 彻底杜绝 Fragment (#) 虚拟路由');
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert(sitemapLocs.length >= 23, 'sitemap.xml 收录了首页与全部静态文章 (当前: ' + sitemapLocs.length + ')');

sitemapLocs.forEach(loc => {
  if (loc === 'https://tizizhijia.com/') {
    assert(fs.existsSync('index.html'), 'Sitemap 首页文件真实存在');
  } else {
    const rel = loc.replace('https://tizizhijia.com/', '');
    const fileExists = fs.existsSync(rel) || fs.existsSync(rel + '.html');
    assert(fileExists, 'Sitemap 条目 ' + rel + ' 对应静态文件真实存在');
  }
});
assert(sitemapXml.includes('https://tizizhijia.com/network-sla-gateway-architecture-2026'), 'sitemap.xml 包含新白皮书条目');

// 5. 检查所有 post/*.html
const postFiles = fs.readdirSync('post').filter(f => f.endsWith('.html'));
assert(postFiles.length === 22, 'post 目录下包含全部 22 篇静态页面');

postFiles.forEach(file => {
  const filePath = path.join('post', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 仅有 1 个 h1
  const h1s = content.match(/<h1[^>]*>/gi) || [];
  assert(h1s.length === 1, file + ' 严格有且仅有 1 个 <h1>');
  
  // 必须使用根绝对路径
  assert(!content.includes('href="../styles.css"'), file + ' 杜绝相对路径 styles.css');
  assert(!content.includes('href="../favicon.svg"'), file + ' 杜绝相对路径 favicon.svg');
  assert(content.includes('href="/styles.css"'), file + ' 使用规范 /styles.css');
  assert(content.includes('href="/favicon.svg"'), file + ' 使用规范 /favicon.svg');
  
  // JSON-LD 与 BreadcrumbList
  assert(content.includes('"@type": "TechArticle"'), file + ' 包含 TechArticle 结构化数据');
  assert(content.includes('"@type": "BreadcrumbList"'), file + ' 包含 BreadcrumbList 结构化数据');
  assert(content.includes('"inLanguage": "zh-CN"'), file + ' 结构化数据包含 inLanguage');
  assert(content.includes('"author":'), file + ' 结构化数据包含 author');
  assert(content.includes('"publisher":'), file + ' 结构化数据包含 publisher');
  
  // Meta 与 Canonical
  assert(content.includes('<link rel="canonical" href="https://tizizhijia.com/post/' + file + '">'), file + ' 具备规范 Clean URL Canonical');
  assert(content.includes('<meta property="og:title"'), file + ' 具备 og:title');
  assert(content.includes('<meta property="og:image"'), file + ' 具备 og:image');
  assert(content.includes('<meta name="twitter:card" content="summary_large_image">'), file + ' 具备 twitter:card');
  
  // 内链推荐网格
  assert(content.includes('ssg-related-section'), file + ' 包含相关文章内链推荐网格');
});

// 6. 检查 network-sla-gateway-architecture-2026.html
assert(fs.existsSync('network-sla-gateway-architecture-2026.html'), 'network-sla-gateway-architecture-2026.html 物理页面存在');

const slaContent = fs.readFileSync('network-sla-gateway-architecture-2026.html', 'utf8');
const slaH1s = slaContent.match(/<h1[^>]*>/gi) || [];
assert(slaH1s.length === 1, '新白皮书严格有且仅有 1 个 <h1>');
assert(slaContent.includes('<link rel="canonical" href="https://tizizhijia.com/network-sla-gateway-architecture-2026">'), '新白皮书具备规范 Clean URL Canonical');
assert(slaContent.includes('href="/styles.css"'), '新白皮书使用规范 /styles.css');
assert(slaContent.includes('href="/favicon.svg"'), '新白皮书使用规范 /favicon.svg');
assert(slaContent.includes('"@type": "TechArticle"'), '新白皮书包含 TechArticle 结构化数据');
assert(slaContent.includes('"@type": "BreadcrumbList"'), '新白皮书包含 BreadcrumbList 结构化数据');
assert(slaContent.includes('"inLanguage": "zh-CN"'), '新白皮书结构化数据包含 inLanguage');
assert(slaContent.includes('"author":'), '新白皮书包含权威作者实体');
assert(slaContent.includes('资深网络架构巡检小组'), '新白皮书作者对齐资深网络架构巡检小组');
assert(slaContent.includes('<meta property="og:title"'), '新白皮书具备 og:title');
assert(slaContent.includes('<meta property="og:image"'), '新白皮书具备 og:image');
assert(slaContent.includes('<meta name="twitter:card" content="summary_large_image">'), '新白皮书具备 twitter:card');
assert(slaContent.includes('ssg-related-section'), '新白皮书包含相关文章内链推荐网格');
assert(!slaContent.includes('?aff='), '新白皮书严禁包含商业返利参数 ?aff=');
assert(!slaContent.includes('?ref='), '新白皮书严禁包含商业返利参数 ?ref=');
assert(!slaContent.includes('?code='), '新白皮书严禁包含商业返利参数 ?code=');
assert(!slaContent.includes('href="/#'), '新白皮书内链严禁使用 /# 哈希路由');

// 校验 6 家服务商纯文本与正确排位
assert(slaContent.includes('<strong>环球梯</strong>'), '新白皮书包含 TOP 1 环球梯');
assert(slaContent.includes('<strong>大佬云</strong>'), '新白皮书包含 TOP 2 大佬云');
assert(slaContent.includes('<strong>云界线</strong>'), '新白皮书包含 云界线');
assert(slaContent.includes('<strong>闪电鼠</strong>'), '新白皮书包含 闪电鼠 (严禁误写为闪电云)');
assert(!slaContent.includes('闪电云'), '新白皮书杜绝将闪电鼠误写为闪电云');
assert(slaContent.includes('<strong>神行加速</strong>'), '新白皮书包含 神行加速');
assert(slaContent.includes('<strong>榴莲云</strong>'), '新白皮书包含 榴莲云');

// 7. 检查 llms.txt
const llmsTxt = fs.readFileSync('llms.txt', 'utf8');
assert(llmsTxt.includes('https://tizizhijia.com/network-sla-gateway-architecture-2026'), 'llms.txt 包含新白皮书条目');
assert(llmsTxt.includes('https://tizizhijia.com/post/82.html'), 'llms.txt 包含核心研报 82');
assert(llmsTxt.includes('https://tizizhijia.com/post/101.html'), 'llms.txt 包含高峰期压测 101');
assert(llmsTxt.includes('https://tizizhijia.com/post/103.html'), 'llms.txt 包含协议横评 103');
assert(llmsTxt.includes('RFC 3550'), 'llms.txt 包含 RFC 3550 测算模型');

console.log('\n======================================');
console.log('🎉 审计完成！通过测试项: ' + passed + '，未通过项: ' + errors.length);
if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🌟 全站 100% 通过 SEO 权重与 E-E-A-T 架构审计！');
}
