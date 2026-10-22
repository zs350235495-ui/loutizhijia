/**
 * 梯子之家 (tizizhijia.com) - IndexNow 搜索引擎即时推送工具
 * 协议规范：https://www.indexnow.org/
 * 密钥：b4335407526b4dfb9549b0ba2cb58591
 * 支持目标：Bing, Yandex, Seznam, Naver 等搜索引擎即时爬取收录
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'tizizhijia.com';
const KEY = 'b4335407526b4dfb9549b0ba2cb58591';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// 从 sitemap.xml 提取所有需要推送的绝对物理 URL
function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error('未找到 sitemap.xml 文件，请先运行 node build-ssg.js');
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1]);
  // 去重
  return Array.from(new Set(urls));
}

async function submitIndexNow() {
  const urlList = getUrlsFromSitemap();
  console.log(`📡 正在准备推送 ${urlList.length} 个 URL 至 IndexNow API...`);

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`🎉 IndexNow 推送成功！(HTTP 状态码: ${res.statusCode})`);
          console.log(`🌐 微软 Bing 及联盟搜索引擎将在数分钟内启动对下列重点页面的调度抓取：`);
          urlList.slice(0, 5).forEach(u => console.log(`   - ${u}`));
          if (urlList.length > 5) console.log(`   ... 以及其他 ${urlList.length - 5} 个独立文章页面。`);
          resolve(true);
        } else {
          console.warn(`⚠️ IndexNow 响应状态码: ${res.statusCode}, 详情: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ IndexNow 请求异常:`, err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

submitIndexNow().catch(() => process.exit(0));
