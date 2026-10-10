// 跑道上有只鹅 - 核心数据库与黑匣子记录
const boardData = [
  {
    id: 1,
    name: "环球梯 HuanqiuTi",
    sub: "全节点 BGP/专线优化 · 23ms 低延迟",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "ChatGPT / AI服务 / 4K流媒体 / 原生IP",
    price: "￥22.00 /月 (7折码 HQ66)",
    gooseScore: 5,
    promoCode: "HQ66",
    url: "https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0"
  },
  {
    id: 2,
    name: "大佬云 DalaoCloud",
    sub: "全 IPLC 专线 · 单节点峰值 2.5Gbps",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / Netflix / Disney+ / ChatGPT",
    price: "￥23.00 /月 (7折码 dly88)",
    gooseScore: 5,
    promoCode: "dly88",
    url: "https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa"
  },
  {
    id: 3,
    name: "云界线 Yunjiexian",
    sub: "全 IPLC 专线 · 150GB/月大流量",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / Netflix / Disney+ / ChatGPT",
    price: "￥22.00 /月 (7折码 yjx888)",
    gooseScore: 5,
    promoCode: "yjx888",
    url: "https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV"
  },
  {
    id: 4,
    name: "闪电鼠 Shandianshu",
    sub: "全线 IEPL 专线 · 单节点峰值 2.5Gbps",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / Netflix / Disney+ / ChatGPT / TikTok",
    price: "￥22.00 /月 (7折码 sds88)",
    gooseScore: 5,
    promoCode: "sds88",
    url: "https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB"
  },
  {
    id: 5,
    name: "神行加速 Shenxing",
    sub: "全 IPLC/IEPL 专线 · 23ms 低延迟 50+节点",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / Netflix / Disney+ / ChatGPT",
    price: "￥23.00 /月 (7折码 sx0077)",
    gooseScore: 5,
    promoCode: "sx0077",
    url: "https://pps123.shenxingaff.com/#/?code=6tQ7zHUc"
  },
  {
    id: 6,
    name: "榴莲云 LiulianCloud",
    sub: "全 IPLC 专线 · 极速解锁 4K/8K 视频",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "原生 IP / Netflix / Disney+ / ChatGPT / YouTube 8K",
    price: "￥22.00 /月 (7折码 ll88)",
    gooseScore: 5,
    promoCode: "ll88",
    url: "https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G"
  },
  {
    id: 7,
    name: "云图机场 Yuntu",
    sub: "金融级 IPLC 专线 · 极高质量节点",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "ai",
    unlock: "金融级专线 / Netflix / Disney+ / ChatGPT",
    price: "￥25.00 /月起 (8折码 yt88)",
    gooseScore: 5,
    promoCode: "yt88",
    url: "https://super.ytjcok.org/#/register?code=poKwFVTv"
  },
  {
    id: 8,
    name: "光年梯 Guangnianti",
    sub: "三年老牌 IPLC 物理专线 · 高峰期极稳定",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "物理专线 / 4K / 8K / AI 工具解锁",
    price: "￥7.50 /月起 (8折码 GNT80)",
    gooseScore: 5,
    promoCode: "GNT80",
    url: "https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO"
  },
  {
    id: 9,
    name: "极连云 Jilianyun",
    sub: "IPLC 物理专线 · 不限设备数 / 极速抗封",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / ChatGPT / 流媒体全解锁",
    price: "￥8.00 /月起 (8折码 JLY888)",
    gooseScore: 5,
    promoCode: "JLY888",
    url: "https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO"
  },
  {
    id: 10,
    name: "鲲鹏加速 Kunpeng",
    sub: "原生 IP 专线/中转 · 全站 1.0 倍率",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "原生 IP / 支持1元试用 / ChatGPT",
    price: "￥12.00 /月起 (暗号 WPugVZUe)",
    gooseScore: 5,
    promoCode: "WPugVZUe",
    url: "https://kunpengjiasu.com/#/register?code=WPugVZUe"
  },
  {
    id: 11,
    name: "可信云 Kexinyun",
    sub: "IEPL 专线 · 不限速 / 不限设备数",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "稳定高效 IEPL / 流媒体 / AI 工具",
    price: "￥8.00 /月起 (暗号 sFKkfEYs)",
    gooseScore: 5,
    promoCode: "sFKkfEYs",
    url: "https://everett7623.kosingaff.com/#/?code=sFKkfEYs"
  },
  {
    id: 12,
    name: "快狸快狸 Kuaili",
    sub: "高速专线中转 · 提供新手专属客户端",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "新手友好 / 客户端一键连接 / 流媒体解禁",
    price: "￥10.00 /月起 (8折码 vpsknow)",
    gooseScore: 4,
    promoCode: "vpsknow",
    url: "https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F"
  },
  {
    id: 13,
    name: "瞬云 Shunyun",
    sub: "极速专线中转 · 全节点流媒体解锁",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "4K 秒开 / 全节点流媒体 / 极低延迟",
    price: "￥12.00 /月起 (85折码 sy888)",
    gooseScore: 5,
    promoCode: "sy888",
    url: "https://ddd.jichang.best/#/register?code=nldUZaYc"
  },
  {
    id: 14,
    name: "边缘节点 EdgeNode",
    sub: "中转优化加速 · 网络极低丢包率",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "backup",
    unlock: "高性价比中转 / 超低丢包 / 网页秒开",
    price: "￥9.00 /月起 (9折码 edge88)",
    gooseScore: 4,
    promoCode: "edge88",
    url: "https://wep.edgenovaaff.com/#/?code=mLLL6h6F"
  },
  {
    id: 15,
    name: "速界 SpeedWorld",
    sub: "大带宽中转优化 · 自研多平台客户端",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "media",
    unlock: "自研客户端 / 大带宽 4K / 新手推荐",
    price: "￥7.50 /月起 (9折码 2026-99)",
    gooseScore: 4,
    promoCode: "2026-99",
    url: "https://pygllc.speedworldaff.cc/#/?code=kcoensXG"
  },
  {
    id: 16,
    name: "FlowerCloud 花云",
    sub: "联通+移动双入口 · 全线 IEPL 专线/星链落地",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "ai",
    unlock: "Starlink 星链 / Disney+ / HBO / Netflix",
    price: "￥39.00 /月 (8折码 L5R3TJJ8UM)",
    gooseScore: 5,
    promoCode: "L5R3TJJ8UM",
    url: "https://bit.ly/3GXSiVD"
  },
  {
    id: 17,
    name: "FlyingBird 飞鸟云",
    sub: "广州 BGP 入口 · 广港 IEPL 专线",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "Netflix / Disney+ / ChatGPT 解锁",
    price: "￥15.00 /月 (85折码 fbzq2685)",
    gooseScore: 5,
    promoCode: "fbzq2685",
    url: "https://bit.ly/4oJDydt"
  },
  {
    id: 18,
    name: "YToo 歪兔",
    sub: "第一梯队老牌专线 · Akari 优质落地",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "media",
    unlock: "Netflix / DAZN / Disney+ / 8K 秒开",
    price: "￥36.00 /月 (85折码 MV3M88XZM)",
    gooseScore: 5,
    promoCode: "MV3M88XZM",
    url: "https://bit.ly/3RMx8wl"
  },
  {
    id: 19,
    name: "Nexitally 奶昔",
    sub: "高端全线 Anycast 接入 · 火山引擎/移动入口",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "ai",
    unlock: "AnyTLS 协议 / 4K / 8K / 专属游戏加速",
    price: "￥55.00 /月",
    gooseScore: 5,
    promoCode: "NEXIT_GOOSE",
    url: "https://bit.ly/479JoLM"
  },
  {
    id: 20,
    name: "FastLink 快连",
    sub: "4 年老牌机场 · AnyCast / AIA / IPLC 专线",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "ChatGPT / Netflix / Disney+ 全解",
    price: "￥20.00 /月",
    gooseScore: 4,
    promoCode: "zx3c",
    url: "https://bit.ly/3Ju3ie9"
  },
  {
    id: 21,
    name: "AmyTelecom",
    sub: "奶昔分站 · 华为云 BGP + 阿里深港专线",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "香港 Jinx / Akari / HKT 顶级落地",
    price: "￥22.70 /月",
    gooseScore: 5,
    promoCode: "AMY_2026",
    url: "https://bit.ly/477rsS1"
  },
  {
    id: 22,
    name: "ImmTel",
    sub: "第一梯队高端机场 · Anycast + AIA 架构",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "ai",
    unlock: "100+ 节点 / 高端原生 ISP 解锁",
    price: "￥17.30 /月起",
    gooseScore: 5,
    promoCode: "IMM_GOOSE",
    url: "https://bit.ly/479KxD4"
  },
  {
    id: 23,
    name: "库洛米 Kuromis",
    sub: "深港专线/苏日专线 · 自研技术架构",
    budgetGroup: "high",
    lineType: "iplc",
    usageType: "ai",
    unlock: "全节点支持 UDP / AI / 低延迟游戏",
    price: "￥34.00 /月",
    gooseScore: 4,
    promoCode: "KURO_BUG",
    url: "https://bit.ly/4aqnWVG"
  },
  {
    id: 24,
    name: "LinkCube 便利店",
    sub: "北上广 BGP 中转 · 原生/本土 ISP 家宽",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "backup",
    unlock: "AT&T 美家宽 / Virgin / TikTok 养号",
    price: "￥15.00 /月",
    gooseScore: 4,
    promoCode: "LINK_CUBE",
    url: "https://bit.ly/3B5FN7e"
  },
  {
    id: 25,
    name: "CreamData 奶油云",
    sub: "移动 SD-WAN 专线 · Tomorin + Akari 架构",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "media",
    unlock: "100+ 线路 / 密集热门区流媒体全解",
    price: "￥29.00 /月",
    gooseScore: 4,
    promoCode: "CREAM_88",
    url: "https://bit.ly/47ZjWtC"
  },
  {
    id: 26,
    name: "西部数据",
    sub: "三线 BGP 中转 · 原生/本土 ISP 覆盖",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "media",
    unlock: "Netflix / 阿根廷/土耳其冷门区订阅",
    price: "￥20.00 /月",
    gooseScore: 4,
    promoCode: "WEST_DATA",
    url: "https://bit.ly/475KsQI"
  },
  {
    id: 27,
    name: "SSRCloud",
    sub: "广东电信 BGP 中转 + 海外直连容灾",
    budgetGroup: "low",
    lineType: "bgp",
    usageType: "ai",
    unlock: "老牌稳定架构 / 4K / ChatGPT",
    price: "￥14.99 /月",
    gooseScore: 4,
    promoCode: "SSR_CLOUD",
    url: "https://bit.ly/480VOqI"
  },
  {
    id: 28,
    name: "一云梯",
    sub: "专线中转 · 独享 IP/独享带宽定制",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "ai",
    unlock: "TikTok 直播 / 跨境电商专属通道",
    price: "￥15.00 /月",
    gooseScore: 4,
    promoCode: "mx6VTmIv",
    url: "https://bit.ly/4n3YqdU"
  },
  {
    id: 29,
    name: "Luckin 瑞幸云",
    sub: "沪粤 IEPL 专线 · 小而美高稳定架构",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "Netflix / Disney+ / DAZN 稳定解锁",
    price: "￥20.00 /月",
    gooseScore: 4,
    promoCode: "LUCKIN_20",
    url: "https://bit.ly/49HL2Fz"
  },
  {
    id: 30,
    name: "泡芙云",
    sub: "香港全线 IEPL 专线 · 4 年稳定运行",
    budgetGroup: "low",
    lineType: "iplc",
    usageType: "media",
    unlock: "4K 秒开 / 独立内网专线",
    price: "￥12.00 /月",
    gooseScore: 4,
    promoCode: "POFF_GOOSE",
    url: "https://bit.ly/480Yp3W"
  }
];

const feedData = [
  {
    id: 85,
    code: "SEO-ARTICLE-16",
    date: "2026.10",
    cat: "avoid",
    title: "机场节点为什么会失效？从线路维护、拥堵到平台风控的原因解析",
    summary: "深入解析网络代理节点出现连接超时、网速变慢、延迟升高及流媒体地区识别异常的原因。涵盖线路维护、骨干网拥堵、出口 IP 信誉变化、服务平台风控策略、本地网络与客户端配置等维度，并提供科学客观的故障自查排查步骤。",
    proCon: "鹅的直白点评：节点不可用不等于服务商跑路！从物理海缆维护到目标网站 IP 信誉降级，再到系统时间偏差与客户端分流冲突，网络链路极长。学会科学排查五步法，告别节点焦虑。",
    gooseScore: 5,
    content: `【机场节点为什么会失效？从线路维护、拥堵到平台风控的原因解析】

一、节点失效与异常的五大核心原因：
1. 物理与中转链路层：海缆中断、中转/专线机房例行维护及安全策略演进。
2. 传输与容量层：晚高峰骨干网 QoS 限速与 TCP 丢包重传导致实际吞吐下降。
3. 目标服务端与 IP 层：机房出口 IP 信誉降级、并发风控及流媒体 Geo-IP 数据库识别漂移。
4. 服务端策略层：后端服务器迁移、IP/端口变更及 DNS 分流策略调整。
5. 本地设备与客户端层：系统时间不精准（>30秒）导致 TLS 握手失败、DNS 污染及系统代理端口残留。

二、用户基础五步排查法：
确认本地网络/同步时间 -> 切换地区节点 -> 更新订阅/重启客户端 -> 查看官方状态公告 -> 规范收集日志联系售后`
  },
  {
    id: 86,
    code: "SEO-ARTICLE-15",
    date: "2026.10",
    cat: "avoid",
    title: "节点频繁超时红圈？5 大常见订阅更新失败、DNS 污染与分流冲突急救速查手册",
    summary: "拒绝焦虑！整理节点全红超时、订阅更新 HTTP 报错、浏览器网页连接失败、ChatGPT 1020 与 Netflix 降级 5 大核心故障诊断决策树与急救指令。",
    proCon: "鹅的直白点评：遇到节点全红超时，别一上来就在群里喊机场跑路！90% 的故障都是系统时间不准、订阅域名被 DNS 污染或代理端口冲突引起的。存好本手册，30 秒搞定自救。",
    gooseScore: 5,
    content: `【节点频繁超时红圈？5 大常见订阅更新失败、DNS 污染与分流冲突急救速查手册】

一、故障 1：节点全红显示超时 (Timeout)
1. 检查系统时间是否精准到秒 (握手解密时间戳保护)。
2. 检查系统代理端口是否被其他软件占用。
3. 检查 DNS 污染并开启客户端 TUN 模式。

二、故障 2：订阅链接更新失败 (Fetch Error / 403)
• 使用现有可用节点“挂代理更新”，或检查官网最新域名。

三、故障 3：微信网页打不开 / 代理系统残留
• 清除 Windows 系统代理残留，管理员 cmd 执行 netsh winsock reset 重置网络。

四、故障 4/5：ChatGPT 1020 与 Netflix 降级排查
• 切换至原生/住宅 IP 策略组，清理浏览器 Cookie 或开启无痕模式。`
  },
  {
    id: 87,
    code: "SEO-ARTICLE-14",
    date: "2026.10",
    cat: "tech",
    title: "软路由与全屋透明代理搭建：iKuai + OpenWrt 双软路由分流与 DNS 防污染实践",
    summary: "极客家庭终极浪漫！硬核拆解 iKuai 主路由拨号流控与 OpenWrt 旁路由科学上网分流架构，彻底破解网关环路与 Fake-IP DNS 防污染。",
    proCon: "鹅的直白点评：全屋十几台智能设备如果每台都单独装客户端，维护起来简直是灾难！折腾软路由透明代理才是终极浪漫。记住本鹅真言：iKuai 主路由切频宽，OpenWrt 旁路由做分流！",
    gooseScore: 5,
    content: `【软路由与全屋透明代理搭建：iKuai + OpenWrt 双软路由分流与 DNS 防污染实践】

一、黄金双软路由架构拆解：
• iKuai 主路由 (192.168.1.1)：负责多拨、DHCP 分配、DPI 流控分流。
• OpenWrt 旁路由 (192.168.1.2)：运行 OpenClash/PassWall，负责跨国流量分流。

二、防止网关环路与 DHCP 冲突：
• 关闭 OpenWrt 的 DHCP 服务。
• iKuai DHCP 将指定科学上网设备 (Apple TV/PS5) 的网关填为 192.168.1.2。

三、DNS 防污染与 OpenClash 配置：
• 选择 Fake-IP 模式，开启本地 DNS 劫持，禁用 IPv6 解析防止流量绕过泄露。

四、4 家适配软路由高吞吐的老牌专线
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/高并发/全屋流畅，7折码: HQ66)
2. 大佬云 DalaoCloud (￥23.00/月，2.5Gbps 超大频宽/多台电视4K，7折码: dly88)
3. 云界线 Yunjiexian (￥22.00/月，150GB/月起/节点自动负载均衡，7折码: yjx888)
4. 极连云 Jilianyun (￥8.00/月，不限设备数量挂载/极佳口粮，8折码: JLY888)`
  },
  {
    id: 88,
    code: "SEO-ARTICLE-13",
    date: "2026.10",
    cat: "tech",
    title: "Android 平台客户端对比：Sing-box 与 Clash Meta 哪个更省电稳定？",
    summary: "拒绝安卓手机变暖手宝！硬核对比 Sing-box 极简内核与 Clash Meta 规则引擎功耗开销，提供 Sing-box JSON 导入与系统后台保活避坑指南。",
    proCon: "鹅的直白点评：安卓手机变暖手宝，80% 是因为跑了发热的垃圾代理内核！选对 Sing-box 或 Clash Meta 内核并关闭 Debug 日志，能让手机续航多坚挺 2 个小时。",
    gooseScore: 5,
    content: `【Android 平台客户端对比：Sing-box 与 Clash Meta 哪个更省电稳定？】

一、内核架构与功耗对比：
• Sing-box (Sbox)：内存占用极低 (~35MB)，发热与功耗极小，全能协议支持，偏向极客。
• Clash Meta (Flclash/Surfboard)：小白极度友好，支持一键 Clash 订阅，规则引擎丰富。

二、安卓后台保活三部曲：
1. 关闭电池优化 (设为无限制)。
2. 多任务卡片开启“锁定”。
3. 允许系统自启动。

三、4 家适配安卓平台极其稳定省电的服务商
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/后心跳轻量，7折码: HQ66)
2. 闪电鼠 Shandianshu (￥22.00/月，全线 IEPL/原生安卓一键客户端，7折码: sds88)
3. 大佬云 DalaoCloud (￥23.00/月，2.5Gbps 大频宽/视频流拉满，7折码: dly88)
4. 极连云 Jilianyun (￥8.00/月，不限设备数/多安卓机分发，8折码: JLY888)`
  },
  {
    id: 89,
    code: "SEO-ARTICLE-12",
    date: "2026.10",
    cat: "tech",
    title: "iOS 必装神器：小火箭（Shadowrocket）从购买、订阅导入到按域名分流全图解",
    summary: "iPhone/iPad 必备装机神器！避坑美区 Apple ID 登录陷阱，掌握一键唤醒与 Subscribe 订阅导入，详解按域名分流与连通性测试。",
    proCon: "鹅的直白点评：iPhone 用户如果不装小火箭，网络体验相当于断了一只翅膀！别再花几十块去买破解版，美区 App Store 只需要 $2.99 就能买到这款霸榜十年的工具。",
    gooseScore: 5,
    content: `【iOS 必装神器：小火箭（Shadowrocket）从购买、订阅导入到按域名分流全图解】

一、正版小火箭购买避坑：
• 安全警示：切勿在系统【设置】中登录外区 Apple ID，防止锁机变砖！只在 App Store 右上角头像处切换登录。
• 售价：$2.99 美元，支持美区礼品卡或支付宝换区购买。

二、订阅导入两套方案：
1. 一键网页唤醒导入 (Safari 一键跳转)。
2. 复制订阅 URL ➔ ➕ ➔ 类型选择 Subscribe ➔ 粘贴保存。

三、域名分流与配置开启：
• 全局路由：强烈推荐选择【配置 (Config)】模式。
• 首次连接：允许添加 VPN 配置，验证 Face ID。

四、4 家适配小火箭体验爆表的服务商
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/一键唤醒，7折码: HQ66)
2. 闪电鼠 Shandianshu (￥22.00/月，全线 IEPL/扫码导入，7折码: sds88)
3. 大佬云 DalaoCloud (￥23.00/月，2.5Gbps 大频宽/iPad秒开，7折码: dly88)
4. 泡芙云 (￥12.00/月，香港 IEPL 专线/4年稳定口碑，暗号: POFF_GOOSE)`
  },
  {
    id: 90,
    code: "SEO-ARTICLE-11",
    date: "2026.10",
    cat: "tech",
    title: "Windows / Mac 客户端配置教程：Clash Verge Rev 核心使用与订阅自动分流指南",
    summary: "告别停更的旧版 CFW！全方位介绍基于 Mihomo 内核的开源神器 Clash Verge Rev，手把手教你订阅导入、TUN 虚拟网卡接管与规则分流。",
    proCon: "鹅的直白点评：别再死守着已经停止维护的旧版 CFW 了！基于 Mihomo 内核的 Clash Verge Rev 才是桌面端的新王者，内存更低、TUN 模式一键开启、防 DNS 污染。",
    gooseScore: 5,
    content: `【Windows / Mac 客户端配置教程：Clash Verge Rev 核心使用与订阅自动分流指南】

一、软件获取与安装避坑：
• GitHub 官方仓库下载，防止第三方木马。
• macOS 解决“损坏提示”：sudo xattr -r -d com.apple.quarantine /Applications/Clash\ Verge.app。

二、3 步核心配置实操：
1. 复制机场 Clash 订阅链接。
2. 粘贴至 Profiles 并点击 Import。
3. 开启 System Proxy 或 TUN 模式 (游戏/终端接管)。

三、规则分流与策略组：
选择【规则模式 (Rule)】，实现国内流量 DIRECT 直连、海外流量自动走代理。

四、4 家适配 Clash Verge 极佳的服务商
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/一键导入/TUN支持，7折码: HQ66)
2. 闪电鼠 Shandianshu (￥22.00/月，全线 IEPL/策略组划分合理，7折码: sds88)
3. 大佬云 DalaoCloud (￥23.00/月，2.5Gbps 峰值/PC下载拉满，7折码: dly88)
4. 极连云 Jilianyun (￥8.00/月，不限设备数/PC与Mac多开，8折码: JLY888)`
  },
  {
    id: 91,
    code: "SEO-ARTICLE-10",
    date: "2026.10",
    cat: "avoid",
    title: "小白防忽悠手册：什么是 BGP 隧道、入口中继与落地机？拆解商家的画饼术语",
    summary: "拒绝当机场黑话的韭菜！硬核拆解代理链路入口、中继与落地三大件，扒下全网 BGP 专线、永久买断等画饼伪装，掌握去套路选型三看原则。",
    proCon: "鹅的直白点评：机场圈的宣传文案堪称“当代互联网科幻文学”！什么三网 Anycast 金融级物理光纤、宇宙无限频宽……搞不懂入口中继和落地机的区别，花上百块买到的可能只是随时被拔线的共享公网中转。",
    gooseScore: 5,
    content: `【小白防忽悠手册：什么是 BGP 隧道、入口中继与落地机？拆解商家的画饼术语】

一、代理链路三大件拆解
1. 国内入口机房 (Entry)：决定本地 ping 延迟与三网兼容性 (BGP 智能路由)。
2. 跨国传输通道 (Transit)：决定晚高峰是否丢包卡顿 (公网 vs IPLC/IEPL 物理专线)。
3. 海外落地机房 (Exit)：决定流媒体解锁 (Netflix 非自制剧/Disney+) 与 AI 防封 (ChatGPT 1020)。

二、商家画饼黑话大揭秘：
• 全网 BGP 专线：绝大多数只是公网 BGP 中转！
• 永久买断套餐：经典的资金盘跑路前兆！
• 100+ 节点解锁：大多为软路由虚拟广播节点。

三、4 家真实透明老牌专线推荐
1. 环球梯 HuanqiuTi (￥22.00/月，多入口 BGP/23ms 极低延迟，7折码: HQ66)
2. 大佬云 DalaoCloud (￥23.00/月，真实 2.5Gbps 超大峰值，7折码: dly88)
3. 云界线 Yunjiexian (￥22.00/月，150GB 大流量/1.0x 真实扣费，7折码: yjx888)
4. 闪电鼠 Shandianshu (￥22.00/月，全线 IEPL 专线/配套客户端，7折码: sds88)`
  },
  {
    id: 92,
    code: "SEO-ARTICLE-09",
    date: "2026.10",
    cat: "tech",
    title: "主流翻墙协议横评：Hysteria 2、VLESS-Reality 与 Shadowsocks 在弱网环境下的抗封锁表现",
    summary: "拒绝裸奔与盲目神话！硬核拆解传统 TCP、Reality 偷取 TLS 证书与 Hy2 基于 QUIC/UDP 暴力发包机制，提供 Sing-box/Clash 节点配置示例。",
    proCon: "鹅的直白点评：别再以为 SS 协议能在 2026 年的公网上裸奔了！但在高丢包弱网下，盲目拥抱 Hy2 也可能被部分地区运营商粗暴 QoS 限速。理解基于 TCP 的 Reality 伪装与基于 UDP 的 Hy2 暴力发包，才能飞得最稳。",
    gooseScore: 5,
    content: `【主流翻墙协议横评：Hysteria 2、VLESS-Reality 与 Shadowsocks 在弱网环境下的抗封锁表现】

一、三大协议底层机制拆解
1. Shadowsocks (SS-2022)：基于 TCP，适合物理专线 (IPLC/IEPL)，开销极低。
2. VLESS-Reality：基于 TCP+TLS 1.3，偷取真实合规大厂 TLS 证书 (apple.com)，公网抗封锁近乎无解。
3. Hysteria 2 (Hy2)：基于 QUIC/UDP，自定义拥塞控制算法，高丢包弱网暴力发包强行拉满速度，但需注意部分地区 UDP QoS。

二、弱网与抗封锁表现对比
• 公网抗封锁：VLESS-Reality 极强
• 弱网拉速吞吐：Hysteria 2 极强
• CPU/省电效率：Shadowsocks 极佳

三、4 家协议匹配度极佳的服务商
1. 环球梯 HuanqiuTi (￥22.00/月，SS-2022/VLESS 物理专线/23ms 低延迟，7折码: HQ66)
2. 闪电鼠 Shandianshu (￥22.00/月，IEPL 专线/全协议智能伪装，7折码: sds88)
3. 神行加速 Shenxing (￥23.00/月，Hysteria 2/Reality 弱网拉速组，7折码: sx0077)
4. 库洛米 Kuromis (￥34.00/月，深港/苏日专线/低延迟 UDP 游戏，暗号: KURO_BUG)`
  },
  {
    id: 93,
    code: "SEO-ARTICLE-08",
    date: "2026.10",
    cat: "speed",
    title: "晚高峰丢包与断流真相：为什么公网中继在晚上 9 点会集体趴窝？",
    summary: "拆解运营商 QoS 流量整形与加密封包丢弃机制，硬核使用 MTR 工具抓出国际出口断流凶手，实测 4 家晚高峰 0 丢包物理专线。",
    proCon: "鹅的直白点评：白天跑满 1000M 别高兴太早！晚上 21:00 晚高峰公网出口拥堵得像十一高速公路，运营商的 QoS 限速阀门直接给你掐死。想要丝滑起飞，物理 IPLC/IEPL 专线才是唯一出路。",
    gooseScore: 5,
    content: `【晚高峰丢包与断流真相：为什么公网中继在晚上 9 点会集体趴窝？】

一、底层原理：运营商 QoS 策略如何宰杀封包？
晚上 21:00 晚高峰，国际出口利用率 > 95%，电信 (163)/联通 (164)/移动 (CMI) 出口路由器自动激活 QoS 流量整形算法，深度识别加密代理封包并主动丢弃 30%~70% 封包，引发重传和节点超时。

二、架构对比：公网 BGP 中转 vs 物理内网专线
物理内网专线 (IPLC/IEPL) 内网光缆直连、不过 GFW，晚高峰丢包率稳定在 0%~0.5%，延迟波动 ±1ms。

三、MTR 诊断抓凶手实操：
使用 sudo mtr --report -c 100 <节点IP> 诊断，若国际出口跳数 Loss% 瞬间飙升，证明为公网出口 QoS 所致。

四、4 家晚高峰丢包率 < 0.5% 的硬核专线推荐
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/0 丢包，7折码: HQ66)
2. 大佬云 DalaoCloud (￥23.00/月，2.5Gbps 超大峰值，7折码: dly88)
3. 云界线 Yunjiexian (￥22.00/月，150GB 大流量/99.9% 在线率，7折码: yjx888)
4. 神行加速 Shenxing (￥23.00/月，IPLC/IEPL 50+ 多节点均衡，7折码: sx0077)`
  },
  {
    id: 94,
    code: "SEO-ARTICLE-07",
    date: "2026.10",
    cat: "avoid",
    title: "TikTok 跨境运营网络环境搭建：固定原生独享 IP 与多设备防关联配置全攻略",
    summary: "破解 0 播放量与批量黑屏绝症！拆解 TikTok SIM 卡/MCC 识别与 WebRTC 泄露机制，打造 100% 伪装度手机，严选 4 家跨境带货节点。",
    proCon: "鹅的直白点评：用普通公网共享机场去刷 TikTok，相当于在额头上贴着“我是中国 IP 动态代理”。TikTok 的基站 SIM 卡检测和 IP 欺诈度评分能秒杀 90% 的粗糙节点。",
    gooseScore: 5,
    content: `【TikTok 跨境运营网络环境搭建：固定原生独享 IP 与多设备防关联配置全攻略】

一、TikTok 风控底层拆解与四大死因
1. 插入国内 SIM 卡 (MCC 460/461)：致命！直接黑屏/0 播放。
2. IP 剧烈跳变与机房 IP：被判定为异地盗号或自动化脚本。
3. 伪装度测试：必须拔卡、关定位、改语言为英语/目标国语言、关自动时区。

二、100% 伪装度搭建与 Whoer.net 检测
使用 whoer.net 检测，确保伪装度评分达 90%~100%。

三、4 家 TikTok 运营与跨境带货服务商
1. 闪电鼠 Shandianshu (￥22.00/月，全线 IEPL/TikTok 专项优化，7折码: sds88)
2. LinkCube 便利店 (￥15.00/月，美/英本土家宽 AT&T/Virgin IP，暗号: LINK_CUBE)
3. 一云梯 (￥15.00/月，独享 IP/独享带宽直播带货定制，暗号: mx6VTmIv)
4. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/全节点原生，7折码: HQ66)`
  },
  {
    id: 95,
    code: "SEO-ARTICLE-06",
    date: "2026.10",
    cat: "speed",
    title: "2026 流媒体解锁完全指南：Netflix 非自制剧、Disney+ 与 HBO 落地节点体检",
    summary: "拒绝只给看自制剧的假解锁！揭秘流媒体 IP 降级防线与 DNS 住宅重定向技术，实操 Clash 影音策略组，体检 4 家 4K 秒开老牌航线。",
    proCon: "鹅的直白点评：许多机场打着全解 Netflix 的招牌，结果只能看怪奇物语！想追跨国非自制剧，落地节点必须具备原生 IP DNS 住宅重定向能力。",
    gooseScore: 5,
    content: `【2026 流媒体解锁完全指南：Netflix 非自制剧、Disney+ 与 HBO 落地节点体检】

一、版权检测大揭秘：自制剧 vs 非自制剧
• 自制剧 (Originals)：Netflix 独家版权，审查宽松，普通机房 IP 也可看。
• 非自制剧 (Licensed)：有严苛地域版权限制，机房 IP 会被悄悄降级屏蔽，无法搜出剧集。

二、DNS 重定向与落地技术
优质机场采用 DNS 分流重定向 (SNI Proxy) 技术，将流媒体 SNI 流量动态代理至海外原生/家宽落地机上，实现低成本全解锁。

三、4 家影音体验爆表的老牌航线
1. 榴莲云 LiulianCloud (￥22.00/月，极速解锁 4K/8K 与 YouTube 8K 秒开，7折码: ll88)
2. 瞬云 Shunyun (￥12.00/月，全节点流媒体解禁/高性价比，85折码: sy888)
3. YToo 歪兔 (￥36.00/月，Akari 顶级落地/8K 杜比视界秒开，85折码: MV3M88XZM)
4. 泡芙云 (￥12.00/月，香港全线 IEPL/4年稳定老牌，暗号: POFF_GOOSE)`
  },
  {
    id: 96,
    code: "SEO-ARTICLE-05",
    date: "2026.10",
    cat: "tech",
    title: "ChatGPT / Claude 官方防封禁指南：原生住宅 IP、机房 IP 与防 1020 报错全解析",
    summary: "别再怀疑账号风水不好！拆解 Cloudflare 风控拦截与 MaxMind 欺诈评分，实操 Clash Verge Rev 独立 AI 策略组与分流规则，实测 4 家 AI 生产力专线。",
    proCon: "鹅的直白点评：明明买的是正版 Plus/Team 订阅，却天天遇到 1020 报错？罪魁祸首就是你用的节点 IP 早就被上万人揉捏烂了！AI 厂商的风控算法专门盯着数据中心广播 IP 砍。",
    gooseScore: 5,
    content: `【ChatGPT / Claude 官方防封禁指南：原生住宅 IP、机房 IP 与防 1020 报错全解析】

一、风控机制拆解：OpenAI 与 Claude 如何抓到你？
1. 机房广播 IP (IDC)：极高风险，Cloudflare 集中拦截，报 Error 1020。
2. 双 ISP 住宅 IP (Residential)：极低风险，AI 厂商判定为真实家庭用户。
3. 触发三大雷区：同 IP 高并发、跨国节点跳变、廉价节点注册。

二、4 步 IP 纯净度体检法：
1. 查验 ASN 属性 (Hosting vs ISP)
2. MaxMind 欺诈评分 (Risk Score < 15 为佳)
3. 连通性直连测试 (auth.anthropic.com)

三、实测严选 4 家 AI 生产力专线
1. 环球梯 HuanqiuTi (￥22.00/月，23ms 低延迟/纯净解禁，7折码: HQ66)
2. 闪电鼠 Shandianshu (￥22.00/月，TikTok 与 AI 专项优化/全线 IEPL，7折码: sds88)
3. 神行加速 Shenxing (￥23.00/月，50+ 多国家冗余节点/自动切路，7折码: sx0077)
4. 库洛米 Kuromis (￥34.00/月，深港/苏日专线/低延迟 UDP，暗号: KURO_BUG)`
  },
  {
    id: 97,
    code: "SEO-ARTICLE-04",
    date: "2026.10",
    cat: "speed",
    title: "高端头等舱专线深度体检：IEPL 与 IPLC 纯内网专线机场为什么这么贵？",
    summary: "硬核拆解物理内网专线与公网 BGP 传输架构差异，深挖运营商 Mbps 带宽独占计费模型，教你如何 3 步精准鉴别真假专线。",
    proCon: "鹅的直白点评：真纯内网物理专线价格昂贵，是因为运营商按兆（Mbps）收取硬核月租。对于外贸商务、高频交易、AI 研发和追求 0 丢包的飞行员来说，贵的不是节点，而是不掉线的心理安全感！",
    gooseScore: 5,
    content: `【高端头等舱专线深度体检：IEPL 与 IPLC 纯内网专线机场为什么这么贵？】

一、硬核技术拆解：IPLC 与 IEPL 到底有何区别？
• IPLC (国际私有专线)：基于 SDH/WDM 物理传输网络，端到端专用电路，流量完全在运营商内网闭环传输，不经过 GFW 审查节点。
• IEPL (国际以太网专线)：基于 OTN (光传送网) 技术，具备更高带宽弹性与更低抖动，对 UDP 游戏及 RTC 通话更友好。
• 晚高峰丢包率：物理内网专线稳定在 0% ~ 0.5%，而普通公网中转高达 15%~60%。

二、成本迷雾：高端专线为什么这么贵？
• 普通服务器按流量 (GB/TB) 计费，成本极低；
• 物理内网专线按带宽 (Mbps/Gbps) 按月独占计费，一条 1Gbps 广港/沪日 IPLC 月租高达数万至十几万元人民币。

三、真假专线鉴别三部曲：
1. 看 TraceRoute 路由追踪：真专线跳数极少，无公网骨干网 202.97/59.43 IP。
2. 晚高峰 21:30 测试丢包率：真专线丢包率强制 < 0.5%。
3. 观察 UDP 游戏连通性：具备 NAT2/NAT1 环境，无突然掉线。

四、顶流“头等舱”专线航班推荐
1. Nexitally 奶昔 (￥55.00/月，Anycast+火山引擎入口，暗号: NEXIT_GOOSE)
2. FlowerCloud 花云 (￥39.00/月，双入口IEPL/星链落地，8折码: L5R3TJJ8UM)
3. YToo 歪兔 (￥36.00/月，第一梯队老牌IPLC/Akari落地，85折码: MV3M88XZM)
4. ImmTel (￥17.30/月起，Anycast+AIA骨干加速，暗号: IMM_GOOSE)`
  },
  {
    id: 98,
    code: "SEO-ARTICLE-03",
    date: "2026.10",
    cat: "avoid",
    title: "大流量与按量付费备用跑道推荐：不限时流量包机场避坑与选型盘点",
    summary: "拒绝资金盘跑路！深入剖析不限时流量包的现金流衰减迷局，掌握按量付费选型四大铁律，实操 Clash 自动备用切路组。",
    proCon: "鹅的直白点评：按量付费不限时流量包就是保存在机舱底部的紧急弹射座椅和备用轮胎。平时可以不用，但不能没有！挑选按量付费跑道唯一的铁律就是——认准运营 3 年以上的老牌站。",
    gooseScore: 5,
    content: `【大流量与按量付费备用跑道推荐：不限时流量包机场避坑与选型盘点】

一、按量付费的底层商业坑点
1. 商家现金流衰减：不限时流量包一次性收费，用户分摊几年消耗，容易导致商家后续无法覆盖每月固定机房月租，引发跑路风险。
2. 选型四大铁律：严格选择 3 年以上老牌机场；控制单次充值金额在 ￥30~￥80 元；认准全站 1.0x 倍率；仅设为备用策略组。

二、实测优质备用跑道推荐
1. 鲲鹏加速 Kunpeng (￥12.00/月起，全站 1.0x 真实倍率，暗号: WPugVZUe，支持1元试用)
2. 光年梯 Guangnianti (￥7.50/月起，三年老牌 IPLC 物理专线，8折码: GNT80)
3. LinkCube 便利店 (￥15.00/月，多国原生本土家宽 IP/防风控，暗号: LINK_CUBE)
4. 极连云 Jilianyun (￥8.00/月起，不限设备数/IPLC专线，8折码: JLY888)

三、客户端自动备用切路配置 (Fallback)
在 Clash 中设置 fallback 策略组，只有当主力专线超时掉线时，才会毫秒级无缝自动接管至按量付费备用跑道，平时零消耗！`
  },
  {
    id: 99,
    code: "SEO-ARTICLE-02",
    date: "2026.10",
    cat: "avoid",
    title: "平价经济舱实测：月付 15 元以下的高性价比机场到底能不能买？",
    summary: "拆解低价机场超售比例与公网 BGP 成本逻辑，严选 4 家适合学生党与轻度用户的 15 元以下平价好机场。",
    proCon: "鹅的直白点评：几块钱的平价机场不是不能买，关键看你怎么用！认准月付，准备备用轮胎即可安心滑行。",
    gooseScore: 4,
    content: `【平价经济舱实测：月付 15 元以下的高性价比机场到底能不能买？】

一、低价机场的运作机制
1. 带宽超售比例：15元以下的平价机场超售比可能高达 1:20 ~ 1:50，白天速度飞快，晚高峰由于抢带宽会有所抖动。
2. 线路类型：多采用公网 BGP 隧道中转或共享出口，适合网页浏览、1080P/4K 视频及日常 AI 办公。

二、购买 15 元以下低价机场的 4 大生死线
1. 绝对只选月付 (Max 15元/月)
2. 警惕“永久买断/买一年送一年”骗局
3. 关注节点倍率是否全站 1.0x
4. 准备一个按量付费备用跑道

三、实测严选 4 家平价好机场
1. FlyingBird 飞鸟云 (￥15.00/月，IEPL专线/100G流量，85折码: fbzq2685)
2. LinkCube 便利店 (￥15.00/月，北上广BGP/本土ISP家宽)
3. SSRCloud 薯条云 (￥14.99/月，5年老牌双轨架构)
4. 泡芙云 (￥12.00/月，香港IEPL专线/100G流量)`
  },
  {
    id: 100,
    code: "SEO-ARTICLE-01",
    date: "2026.10",
    cat: "speed",
    title: "2026 最新机场推荐与选购指南：晚高峰 4K 不卡顿的 5 家老牌专线航班横评",
    summary: "拒绝套路充值！全方位拆解晚高峰公网 QoS 丢包与 IPLC/IEPL 物理专线硬核差异，实测 5 家真起飞老牌航班。",
    proCon: "鹅的直白点评：白天测速几百兆只是基本功，晚高峰不丢包才是硬实力！请认准 IPLC/IEPL 物理内网专线。",
    gooseScore: 5,
    content: `【2026 最新机场推荐与选购指南：晚高峰 4K 不卡顿的 5 家老牌专线航班横评】

一、为什么 90% 的人会在晚高峰遭遇“假起飞”？
普通的便宜机场大多使用公网 BGP 中转或直连线路。一到晚高峰（20:00 - 23:00），国际出口带宽面临海量数据拥堵，运营商的 QoS 策略会自动丢弃封包，导致丢包率飚升至 30%~80%。

而真正的高端专线使用 IPLC / IEPL 物理内网专线：
- 内网点对点传输，不经过 GFW 公网审查与 QoS
- 晚高峰丢包率稳定在 0%，延迟极低

二、2026 晚高峰 4K 秒开实测：5 家老牌专线航班横评
1. 环球梯 HuanqiuTi (全节点 BGP/专线，23ms 低延迟，7折码: HQ66)
2. 大佬云 DalaoCloud (全 IPLC 专线，单节点 2.5Gbps，7折码: dly88)
3. 云界线 Yunjiexian (IPLC 专线，150GB 大流量，7折码: yjx888)
4. 闪电鼠 Shandianshu (全线 IEPL 专线，TikTok/ChatGPT 全解，7折码: sds88)
5. 神行加速 Shenxing (IPLC/IEPL 50+ 节点，7折码: sx0077)

三、避坑安全守则
1. 坚决月付保平安：严禁购买年付或所谓的“永久买断套餐”！
2. 随时关注跑道动态：前往【航班推荐榜】查看 30 家跑道实时心跳监测与优惠码。`
  },
  {
    id: 101,
    code: "SPEED-REPORT-01",
    date: "2026.10",
    cat: "speed",
    title: "晚高峰 21:00 丢包率实测：哪些 IPLC 专线真能跑满 500M 宽带？",
    summary: "针对当前 6 家热门服务商进行了连续 7 天的晚高峰 (20:00 - 23:00) 丢包率与测速打点。",
    proCon: "鹅的评价：真正的内网 IPLC 专线在晚高峰期间延迟波动 < 3ms，丢包率稳定在 0%。",
    gooseScore: 5,
    content: `【跑道黑匣子实测报告】

在过去的 7 天里，鹅在晚上 21:15 节点高峰期对 6 家服务商进行了持续抽样测试。

【测试环境】：
• 本地宽带：电信 1000M / 联通 500M
• 测速目标：Speedtest 香港/东京/新加坡/洛杉矶节点

【结论要点】：
1. 环球梯等优质专线在晚高峰期间延迟低至 23ms，丢包率稳定在 0%。
2. 普通 BGP 中转在晚上 21 点左右可能受到公网入口 QoS 挤压，速度有 15%-25% 的衰减，但总体依旧可用。
3. 严禁购买任何宣称“百年免费/永久无限流量”的远期套餐！月付才是唯一的安全保障。`
  },
  {
    id: 102,
    code: "AVOID-GUIDE-02",
    date: "2026.09",
    cat: "avoid",
    title: "ChatGPT 与 Claude 官方防封禁 IP 排雷与节点策略指南",
    summary: "为什么你的 OpenAI 账号频繁被强制退登或提示 1020？详解机房 IP 与原生家宽 IP 的区别。",
    proCon: "鹅的评价：请使用固定住宅 IP 或具备纯净分流功能的节点，切忌频繁切换跨国节点登录。 ",
    gooseScore: 4,
    content: `【AI 节点避坑实测】

近期许多飞行员反馈登录 ChatGPT 时出现“Access Denied”或 Cloudflare 无限验证码问题。

【鹅的诊断】：
• 机房广播 IP（如 DataCenter 集中段）被 OpenAI 批量风控标记。
• 解决办法：在 Clash / Surge 中配置分流规则，将 chatgpt.com 与 openai.com 指定走独立的“原生/住宅 IP 策略组”。`
  },
  {
    id: 103,
    code: "TECH-EXPLAIN-03",
    date: "2026.09",
    cat: "tech",
    title: "浅析 Hysteria 2 与 VLESS-Reality 协议在弱网环境下的抗封锁表现",
    summary: "在高丢包环境或公网高峰期，基于 UDP 的 Hysteria 2 协议如何实现快速发包补包？",
    proCon: "鹅的评价：Hysteria 2 在高丢包宽带下优势巨大，但需要注意部分地区运营商对 UDP 协议的 QoS 限制。",
    gooseScore: 5,
    content: `【协议实测对比】

针对移动宽带和晚高峰跨国丢包严重的场景，Hysteria 2 协议通过自定义拥塞控制算法显著提升了跑满速率。`
  }
];

const crashData = [
  {
    id: 1,
    name: "💥 RixCloud 极速云",
    date: "2020年12月",
    reason: "曾经的高端大机场代表，因经营合规风险与团队分歧突然停止运营并清退解散所有节点。",
    status: "[已关站跑路]"
  },
  {
    id: 2,
    name: "💥 喵帕斯 MiaoPass",
    date: "2020年7月",
    reason: "业内老牌知名机场，因上游支付通道被封及不可抗力因素关闭全站并清空数据库。",
    status: "[已关站解散]"
  },
  {
    id: 3,
    name: "💥 跑路云 Express",
    date: "2026年9月",
    reason: "大搞‘买一年送两年’年付大促销后突然解散 Telegram 群组，服务器全部拔线失联。",
    status: "[资金盘跑路]"
  },
  {
    id: 4,
    name: "💥 极光跑道 Air",
    date: "2026年8月",
    reason: "宣称‘永久 8K 无限专线’，上线仅 2 个月后域名挂售出售，机场主直接退群失联。",
    status: "[割韭菜失联]"
  },
  {
    id: 5,
    name: "💥 速云 Express",
    date: "2025年11月",
    reason: "低价招揽万名用户后突然更换域名跳转博彩网站，所有订阅节点彻底瘫痪。",
    status: "[域名跳转/跑路]"
  },
  {
    id: 6,
    name: "💥 云帆 Cloud",
    date: "2025年9月",
    reason: "晚高峰丢包率高达 95%，用户在群组反馈后直接全员禁言，随后清空全站数据库。",
    status: "[摆烂关站]"
  },
  {
    id: 7,
    name: "💥 幻影 Cloud",
    date: "2026年7月",
    reason: "晚高峰丢包率高达 85%，用户在工单提问后屏蔽账户，售后团队全员离线瘫痪。",
    status: "[售后瘫痪]"
  },
  {
    id: 8,
    name: "💥 云梯 Express",
    date: "2025年5月",
    reason: "推出‘99元终身买断套餐’收割流量，吸资金后半个月内关站，客服账号注销。",
    status: "[终身套餐骗局]"
  },
  {
    id: 9,
    name: "💥 极客加速 GeekVPN",
    date: "2024年12月",
    reason: "宣称‘独享 IPLC 金融专线’，促销年付后机房断供拔线，官网提示 404 彻底挂掉。",
    status: "[机房拔线]"
  },
  {
    id: 10,
    name: "💥 黑洞 Cloud",
    date: "2024年10月",
    reason: "上线仅 3 个月，以‘遭遇持续 DDOS 攻击无力维护’为由宣布解散并关站清退。",
    status: "[受击解散]"
  }
];
