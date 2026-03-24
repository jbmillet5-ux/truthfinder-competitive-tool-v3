const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/123.0 Safari/537.36";

const DEFAULT_TIMEOUT_MS = 18000;

const DEFAULT_PORTFOLIO_COMPETITORS = [
  "beenverified.com",
  "spokeo.com",
  "cloaked.com",
  "peoplefinders.com",
  "whitepages.com",
  "fastpeoplesearch.com",
  "truepeoplesearch.com",
  "usphonebook.com",
  "peoplelooker.com",
  "intelius.com",
  "instantcheckmate.com",
  "ussearch.com"
];

const COMMON_QUERY_SETS = [
  "people search",
  "background check",
  "reverse phone lookup",
  "address lookup",
  "email lookup",
  "identity protection",
  "data removal",
  "privacy protection"
];

const PORTFOLIO_IDENTITY = {
  core_keywords: [
    "people search",
    "background check",
    "reverse phone lookup",
    "public records",
    "email lookup",
    "address lookup",
    "phone lookup",
    "criminal records"
  ],
  privacy_keywords: [
    "privacy protection",
    "remove my info online",
    "data broker removal",
    "identity protection",
    "protect my identity",
    "personal data protection"
  ],
  core_problems: [
    "identify someone",
    "verify identity",
    "check safety",
    "find information about a person",
    "who called me",
    "is this person safe",
    "look someone up"
  ],
  adjacent_problems: [
    "protect my identity",
    "who has my data",
    "is my information exposed",
    "can i trust this person",
    "remove my info online",
    "privacy protection",
    "verify before meeting",
    "check before buying"
  ]
};

const SCORE_WEIGHTS = {
  keyword_opportunity: 0.19,
  paid_intent_coverage: 0.16,
  creative_diversity: 0.11,
  use_case_expansion: 0.14,
  offer_strength: 0.08,
  funnel_efficiency: 0.08,
  channel_expansion: 0.05,
  privacy_adjacent: 0.08,
  testability: 0.11
};

const FCRA_BLOCKLIST_PATTERNS = [
  /\bemployment\b/i,
  /\bemployer\b/i,
  /\bjob applicant\b/i,
  /\bpre[- ]employment\b/i,
  /\bhiring\b/i,
  /\brecruiter\b/i,
  /\btenant\b/i,
  /\btenant screening\b/i,
  /\brental\b/i,
  /\blease approval\b/i,
  /\blandlord\b/i,
  /\bhousing\b/i,
  /\bcredit\b/i,
  /\blending\b/i,
  /\bloan approval\b/i,
  /\binsurance\b/i,
  /\bunderwriting\b/i,
  /\beligibility\b/i,
  /\bapprove\b/i,
  /\bapproved\b/i,
  /\bapproval\b/i,
  /\bdeny\b/i,
  /\bdenial\b/i,
  /\bqualification\b/i,
  /\badverse action\b/i,
  /\bconsumer report\b/i,
  /\bfcra\b/i,
  /\bscreen applicant\b/i,
  /\bscreening report\b/i,
  /\bemployment decision\b/i,
  /\bhousing decision\b/i
];

const KEYWORD_CLUSTERS = [
  {
    cluster: "people search",
    intent_type: "core",
    priority: "high",
    keywords: ["people search", "find people", "person search", "people finder", "public records"],
    channels: ["google_ads", "bing_ads", "display"],
    volume_tier: "High"
  },
  {
    cluster: "background check",
    intent_type: "core",
    priority: "high",
    keywords: ["background check", "criminal records", "court records", "background report"],
    channels: ["google_ads", "bing_ads", "display"],
    volume_tier: "High"
  },
  {
    cluster: "reverse phone lookup",
    intent_type: "core",
    priority: "high",
    keywords: ["reverse phone lookup", "phone lookup", "who called me", "unknown caller", "spam caller"],
    channels: ["google_ads", "bing_ads", "meta_ads", "tiktok_ads", "display"],
    volume_tier: "High"
  },
  {
    cluster: "email lookup",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["email lookup", "who owns this email", "reverse email lookup", "email owner lookup"],
    channels: ["google_ads", "bing_ads", "meta_ads", "display"],
    volume_tier: "Medium"
  },
  {
    cluster: "reverse address lookup",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["reverse address lookup", "who lives at this address", "address lookup", "neighbors at address"],
    channels: ["google_ads", "bing_ads", "meta_ads", "display"],
    volume_tier: "Medium"
  },
  {
    cluster: "property records",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["property records", "property owner lookup", "house owner lookup", "real estate records"],
    channels: ["google_ads", "bing_ads", "display"],
    volume_tier: "Medium"
  },
  {
    cluster: "privacy protection",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["privacy protection", "protect my identity", "stop data brokers", "protect my personal data", "identity privacy"],
    channels: ["google_ads", "meta_ads", "display"],
    volume_tier: "Medium"
  },
  {
    cluster: "data broker removal",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["data broker removal", "remove my info online", "delete personal data", "online privacy removal"],
    channels: ["google_ads", "meta_ads", "display"],
    volume_tier: "Medium"
  },
  {
    cluster: "identity protection",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["identity protection", "identity theft prevention", "protect my identity online", "identity monitoring"],
    channels: ["google_ads", "meta_ads", "display", "tiktok_ads"],
    volume_tier: "Medium"
  },
  {
    cluster: "dark web / identity exposure",
    intent_type: "expansion",
    priority: "medium-high",
    keywords: ["dark web scan", "is my information online", "identity exposure", "data breach check"],
    channels: ["meta_ads", "tiktok_ads", "display", "google_ads"],
    volume_tier: "Medium"
  },
  {
    cluster: "dating / personal safety",
    intent_type: "expansion",
    priority: "medium-high",
    keywords: ["background check before dating", "look up someone before meeting", "is this person safe"],
    channels: ["meta_ads", "tiktok_ads", "display", "google_ads"],
    volume_tier: "Low-Medium"
  },
  {
    cluster: "neighbor / neighborhood research",
    intent_type: "expansion",
    priority: "medium",
    keywords: ["who lives near me", "neighborhood lookup", "neighbor lookup", "who lives next door"],
    channels: ["meta_ads", "display", "google_ads"],
    volume_tier: "Low-Medium"
  },
  {
    cluster: "event / guest list recovery",
    intent_type: "expansion",
    priority: "medium",
    keywords: ["find old friends", "find family members", "locate relatives", "find missing addresses"],
    channels: ["google_ads", "meta_ads", "display"],
    volume_tier: "Low-Medium"
  },
  {
    cluster: "private seller verification",
    intent_type: "expansion",
    priority: "medium-high",
    keywords: ["verify seller", "private seller check", "seller lookup", "who is this seller"],
    channels: ["google_ads", "meta_ads", "display"],
    volume_tier: "Low-Medium"
  }
];

const CREATIVE_ANGLES = [
  {
    angle: "Unknown caller resolution",
    triggers: ["reverse phone", "phone lookup", "who called", "unknown caller", "spam caller", "number"],
    user_problem: "I need to identify who is calling me.",
    best_channels: ["google_ads", "bing_ads", "meta_ads", "tiktok_ads"],
    hook_templates: [
      "Who just called you?",
      "Unknown number? Get answers fast.",
      "Find out who is behind that number."
    ]
  },
  {
    angle: "Safety / protect myself",
    triggers: ["safe", "protect", "security", "verify", "background", "criminal", "records"],
    user_problem: "I want to reduce risk before interacting with someone.",
    best_channels: ["google_ads", "meta_ads", "display", "tiktok_ads"],
    hook_templates: [
      "Know more before you meet.",
      "A quick check can save you a major mistake.",
      "Feel more confident before taking the next step."
    ]
  },
  {
    angle: "Privacy / control my data",
    triggers: ["privacy", "protect data", "remove my info", "identity protection", "data broker", "exposed"],
    user_problem: "I want more control over how exposed my personal information is.",
    best_channels: ["google_ads", "meta_ads", "display"],
    hook_templates: [
      "See what your digital footprint is exposing.",
      "Know what others can find about you.",
      "Take back control of your information."
    ]
  },
  {
    angle: "Identity / scam / fraud concern",
    triggers: ["email", "identity", "scam", "fraud", "dark web", "exposure", "verify"],
    user_problem: "I need to validate identity or check for risk.",
    best_channels: ["meta_ads", "tiktok_ads", "display", "google_ads"],
    hook_templates: [
      "Validate before you trust.",
      "Check the identity behind the message.",
      "See what could be putting you at risk."
    ]
  },
  {
    angle: "Reconnection / find someone",
    triggers: ["find people", "people search", "locate", "reconnect", "find someone"],
    user_problem: "I want to find or reconnect with someone.",
    best_channels: ["google_ads", "bing_ads", "meta_ads"],
    hook_templates: [
      "Trying to find someone?",
      "Reconnect with more context.",
      "Find people faster."
    ]
  },
  {
    angle: "Property / address research",
    triggers: ["address", "property", "owner", "reverse address", "residents"],
    user_problem: "I want to know more about a home, address, or the people tied to it.",
    best_channels: ["google_ads", "bing_ads", "display", "meta_ads"],
    hook_templates: [
      "Who lives there?",
      "Research an address before you decide.",
      "Get more context on a property."
    ]
  }
];

const DYNAMIC_IDEA_POOLS = {
  phone: [
    {
      idea_name: "Family Scam Defense",
      marketing_hook: "Help your family know who is really calling.",
      customer_problem: "Unknown-call anxiety spikes when a caller may target older family members or vulnerable loved ones.",
      why_truthfinder_can_help: "Phone and identity context can reduce uncertainty before a scam escalates.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Bottom-funnel unknown-caller landing page",
      why_test_this: "Strong direct-response pain, clear intent, and easy CTA."
    },
    {
      idea_name: "Urgent Caller Resolution",
      marketing_hook: "Unknown number? Get clarity before you call back.",
      customer_problem: "Users want immediate answers before engaging with a number they do not recognize.",
      why_truthfinder_can_help: "Reverse-phone-style utility maps directly to a fast task-completion funnel.",
      suggested_channels: ["google_ads", "bing_ads", "display"],
      test_format: "Search-first DR funnel",
      why_test_this: "This is immediate, transactional, and bottom-funnel by nature."
    },
    {
      idea_name: "Missed Call Confidence Layer",
      marketing_hook: "One search before you answer can save you a headache.",
      customer_problem: "A user does not know whether a missed call is important, risky, or spammy.",
      why_truthfinder_can_help: "The product can turn uncertainty into a quick verification action.",
      suggested_channels: ["google_ads", "meta_ads"],
      test_format: "Mobile-focused search and retargeting",
      why_test_this: "Fast, low-friction intent with clean action language."
    }
  ],
  privacy: [
    {
      idea_name: "Post-Breach Self-Check",
      marketing_hook: "After a leak, see what public context someone could connect back to you.",
      customer_problem: "Users reacting to a breach often feel exposed but do not know how much context is actually discoverable.",
      why_truthfinder_can_help: "Public-record awareness makes abstract exposure concerns more concrete.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Privacy intent landing page",
      why_test_this: "Privacy-aware users have strong problem awareness and urgency."
    },
    {
      idea_name: "Breakup / Move Exposure Reset",
      marketing_hook: "Big life change? See what your old footprint is still revealing.",
      customer_problem: "Users leaving a relationship or moving may want more control over what is easy to find.",
      why_truthfinder_can_help: "Public-record visibility makes the exposure problem legible and urgent.",
      suggested_channels: ["meta_ads", "google_ads", "display"],
      test_format: "Life-event DR landing page",
      why_test_this: "Life transitions heighten urgency and response."
    },
    {
      idea_name: "Digital Footprint Audit",
      marketing_hook: "Know what someone could find before they search you.",
      customer_problem: "Users worry about discoverability but lack a clear next step.",
      why_truthfinder_can_help: "The product can function as a self-audit and awareness tool.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Self-audit funnel",
      why_test_this: "Strong problem language, clean CTA, adjacent to privacy demand."
    }
  ],
  people: [
    {
      idea_name: "Wedding / Reunion Guest Recovery",
      marketing_hook: "Do not leave the right people off the list just because you lost touch.",
      customer_problem: "Hosts planning weddings, reunions, or milestone events often need updated contact paths fast.",
      why_truthfinder_can_help: "Public-record context can help reconnect planners with important people.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Event-planning utility funnel",
      why_test_this: "Task-driven and emotionally motivated."
    },
    {
      idea_name: "Family Milestone Outreach",
      marketing_hook: "When the moment matters, find the people you need to reach.",
      customer_problem: "Major life events create urgency around reconnecting with relatives and old contacts.",
      why_truthfinder_can_help: "Public-record tools can support practical reconnection workflows.",
      suggested_channels: ["google_ads", "meta_ads"],
      test_format: "Milestone-event campaign",
      why_test_this: "High emotional relevance with clear action."
    },
    {
      idea_name: "Old Contact Recovery",
      marketing_hook: "Need to find someone again? Start with the fastest path back.",
      customer_problem: "Users have a real person and a real need, but outdated information.",
      why_truthfinder_can_help: "This is directly aligned to core people-search utility.",
      suggested_channels: ["google_ads", "bing_ads", "display"],
      test_format: "Search-first direct response funnel",
      why_test_this: "Very clean bottom-funnel search behavior."
    }
  ],
  property: [
    {
      idea_name: "Private Seller Confidence Check",
      marketing_hook: "Before you drive, deposit, or decide, know who you are dealing with.",
      customer_problem: "Users making private transactions around property, equipment, or high-value goods often rely on little verified context.",
      why_truthfinder_can_help: "Identity and location context can reduce wasted travel and trust mistakes.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Transaction-risk landing page",
      why_test_this: "High intent, high consequence, strong DR framing."
    },
    {
      idea_name: "Neighborhood Confidence Layer",
      marketing_hook: "Before you move in, know more about where you are landing.",
      customer_problem: "Moving decisions create uncertainty around nearby residents and local context.",
      why_truthfinder_can_help: "Address and resident context can reduce uncertainty during a move decision.",
      suggested_channels: ["google_ads", "display", "meta_ads"],
      test_format: "Move-intent landing page",
      why_test_this: "Life-event urgency plus clear practical utility."
    },
    {
      idea_name: "Rural Buyer / Land Confidence Check",
      marketing_hook: "Before you travel hours or send money, know more.",
      customer_problem: "Land, equipment, trailer, and off-grid buyers often make trust calls on thin information.",
      why_truthfinder_can_help: "Location and identity context can lower fraud and wasted-travel risk.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Niche rural transaction funnel",
      why_test_this: "Specific niche, strong pain, clear CTA."
    }
  ],
  safety: [
    {
      idea_name: "Before-the-Meetup Check",
      marketing_hook: "Before you meet, know more.",
      customer_problem: "Users meeting someone from dating apps, marketplaces, or social networks want reassurance fast.",
      why_truthfinder_can_help: "Public-record context can serve as a trust-check layer before an in-person interaction.",
      suggested_channels: ["google_ads", "meta_ads", "tiktok_ads"],
      test_format: "Scenario-led DR funnel",
      why_test_this: "Immediate user motivation with strong direct-response potential."
    },
    {
      idea_name: "Before-They-Enter-Your-Home Check",
      marketing_hook: "Before they enter your home, know a little more.",
      customer_problem: "Homeowners hiring contractors, cleaners, or repair workers often have limited trust context.",
      why_truthfinder_can_help: "The product can support a practical trust verification step.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Home services trust funnel",
      why_test_this: "Strong emotional consequence and highly legible CTA."
    },
    {
      idea_name: "Marketplace Meetup Safety Layer",
      marketing_hook: "Before the meetup, know who is really showing up.",
      customer_problem: "Peer-to-peer transactions create physical safety and fraud concerns.",
      why_truthfinder_can_help: "Identity context can reduce uncertainty before a meetup or exchange.",
      suggested_channels: ["meta_ads", "google_ads", "display"],
      test_format: "Meetup-risk campaign",
      why_test_this: "High anxiety, clean pain point, strong conversion logic."
    }
  ],
  identity: [
    {
      idea_name: "Email Sender Reality Check",
      marketing_hook: "Before you click back, know who is behind the message.",
      customer_problem: "Users receiving sketchy emails want a fast validation step.",
      why_truthfinder_can_help: "Identity-linked context can reduce fraud uncertainty.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Message-verification DR funnel",
      why_test_this: "Very direct pain, action, and payoff."
    },
    {
      idea_name: "Suspicious Contact Verification",
      marketing_hook: "Before you trust the message, check the person.",
      customer_problem: "Text, email, and social message contacts can feel ambiguous and risky.",
      why_truthfinder_can_help: "Public-record context can support a verification step before engagement.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Verify-before-reply funnel",
      why_test_this: "High concern, immediate intent."
    }
  ]
};

const DIRECT_RESPONSE_PATTERN_BANK = [
  {
    pattern_name: "Problem + Immediate Payoff",
    formula: "[Pain point]? [Fast relief].",
    why_it_works: "It gets to the problem immediately and promises a near-term outcome.",
    examples: [
      "Unknown number? Get answers fast.",
      "Need to know who called? Start here.",
      "Before you trust them, know more."
    ]
  },
  {
    pattern_name: "Consequence + Prevention",
    formula: "[Bad outcome] can happen. [Simple action] helps prevent it.",
    why_it_works: "This structure raises stakes without wasting words.",
    examples: [
      "A quick check can save you a major mistake.",
      "One search now can prevent a bad decision later.",
      "Do the check before the damage is done."
    ]
  },
  {
    pattern_name: "Specific Moment-of-Need",
    formula: "Before [moment], [action/result].",
    why_it_works: "Moment framing tends to outperform generic feature language in direct response.",
    examples: [
      "Before you meet, know more.",
      "Before you call back, get clarity.",
      "Before you send the deposit, check first."
    ]
  },
  {
    pattern_name: "Curiosity + Utility",
    formula: "[Question]? [Utility answer].",
    why_it_works: "This combines natural curiosity with clear functional benefit.",
    examples: [
      "Who just called you?",
      "Who lives there?",
      "What can someone find about you?"
    ]
  },
  {
    pattern_name: "Direct Command CTA",
    formula: "[Verb] [object] now.",
    why_it_works: "When intent is bottom-funnel, clarity often beats cleverness.",
    examples: [
      "Search the number now.",
      "Check the person first.",
      "See the public footprint."
    ]
  }
];

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return Promise.race([fetch(url, options), timeoutPromise(timeoutMs)]);
}

function normalizeInput(urlOrDomain) {
  const raw = String(urlOrDomain || "").trim();
  if (!raw) return "";
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) return `https://${raw}`;
  return raw;
}

function normalizeDomain(value) {
  let v = String(value || "").trim().toLowerCase();
  v = v.replace(/^https?:\/\//, "");
  v = v.replace(/^www\./, "");
  v = v.split("/")[0];
  return v;
}

function domainFromUrl(url) {
  const parsed = new URL(url);
  let host = parsed.hostname.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);
  return host;
}

function cleanText(str) {
  return String(str || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function uniqueObjectsByKey(arr, key) {
  const seen = new Set();
  const out = [];
  for (const item of arr || []) {
    const k = String(item?.[key] || "");
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function hashString(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function deterministicPick(items, seed, count = 3) {
  const arr = [...(items || [])];
  if (!arr.length) return [];
  const scored = arr.map((item, idx) => ({
    item,
    score: hashString(`${seed}|${idx}|${JSON.stringify(item)}`)
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, Math.min(count, scored.length)).map((x) => x.item);
}

function extractMetaByName(html, name) {
  const regex1 = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([\\s\\S]*?)["'][^>]*>`,
    "i"
  );
  const regex2 = new RegExp(
    `<meta[^>]+content=["']([\\s\\S]*?)["'][^>]+name=["']${name}["'][^>]*>`,
    "i"
  );
  return cleanText(html.match(regex1)?.[1] || html.match(regex2)?.[1] || "");
}

function extractAllMatches(html, regex, limit = 10) {
  return [...html.matchAll(regex)]
    .slice(0, limit)
    .map((m) => cleanText(m[1]))
    .filter(Boolean);
}

async function fetchHtml(url) {
  const response = await fetchWithTimeout(url, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow"
  });

  if (!response.ok) throw new Error(`Failed to fetch page: HTTP ${response.status}`);

  const html = await response.text();
  const finalUrl = response.url;

  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const meta_description = extractMetaByName(html, "description");
  const h1 = cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const h2s = extractAllMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 10);
  const h3s = extractAllMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 10);
  const button_texts = extractAllMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 20);
  const anchor_texts = extractAllMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 30);
  const body_text = cleanText(html).slice(0, 45000);

  const links = [];
  const pageUrl = new URL(finalUrl);

  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    const href = String(match[1] || "").trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    try {
      const abs = new URL(href, finalUrl).toString();
      if (new URL(abs).hostname === pageUrl.hostname && !links.includes(abs)) links.push(abs);
    } catch {
      // ignore malformed urls
    }
  }

  return {
    final_url: finalUrl,
    title,
    meta_description,
    h1,
    h2s,
    h3s,
    button_texts: uniq(button_texts),
    anchor_texts: uniq(anchor_texts),
    links: links.slice(0, 50),
    body_text,
    status_code: response.status
  };
}

function isFcraSensitiveText(value) {
  const text = String(value || "");
  return FCRA_BLOCKLIST_PATTERNS.some((pattern) => pattern.test(text));
}

function filterOutFcraSensitiveIdeas(items) {
  return (items || []).filter((item) => {
    const combined = [
      item.idea_name,
      item.marketing_hook,
      item.customer_problem,
      item.why_truthfinder_can_help,
      item.test_format,
      item.why_test_this,
      item.use_case,
      item.suggested_angle,
      item.what_to_test,
      item.hypothesis,
      item.expected_outcome,
      item.why_fund,
      item.title,
      item.test_name,
      item.play_name
    ].join(" ");
    return !isFcraSensitiveText(combined);
  });
}

function buildPortfolioCompetitors(payload) {
  const incoming = Array.isArray(payload?.portfolio_competitors)
    ? payload.portfolio_competitors
    : DEFAULT_PORTFOLIO_COMPETITORS;

  const cleaned = uniq(incoming.map(normalizeDomain).filter(Boolean));
  return cleaned.length ? cleaned : [...DEFAULT_PORTFOLIO_COMPETITORS];
}

function countMatches(text, terms) {
  const lower = String(text || "").toLowerCase();
  let hits = 0;
  for (const term of terms) {
    const escaped = String(term || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = lower.match(new RegExp(escaped, "g"));
    hits += matches ? matches.length : 0;
  }
  return hits;
}

function classifyBand(score) {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium-High";
  if (score >= 40) return "Medium";
  return "Low-Medium";
}

function round2(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

function titleCase(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getFullText(scrape) {
  return [
    scrape.title,
    scrape.meta_description,
    scrape.h1,
    ...(scrape.h2s || []),
    ...(scrape.h3s || []),
    ...(scrape.button_texts || []),
    ...(scrape.anchor_texts || []),
    scrape.body_text
  ].join(" ");
}

function buildEvidenceExtracts(scrape) {
  const extracts = [];
  if (scrape.h1) extracts.push(`Primary headline: ${scrape.h1}`);
  if (scrape.meta_description) extracts.push(`Meta description: ${scrape.meta_description}`);
  if (scrape.h2s?.length) extracts.push(`Subheadings: ${scrape.h2s.slice(0, 6).join(" | ")}`);
  if (scrape.button_texts?.length) extracts.push(`Buttons / CTAs: ${scrape.button_texts.slice(0, 8).join(" | ")}`);
  if (scrape.anchor_texts?.length) extracts.push(`Top link text: ${scrape.anchor_texts.slice(0, 10).join(" | ")}`);
  return extracts.slice(0, 10);
}

function getClusterPresence(fullText, scrape) {
  return KEYWORD_CLUSTERS.map((clusterDef) => {
    const termHits = countMatches(fullText, clusterDef.keywords);
    const linkHits = countMatches((scrape.links || []).join(" "), clusterDef.keywords);
    const headingHits = countMatches(
      [scrape.h1, ...(scrape.h2s || []), ...(scrape.h3s || [])].join(" "),
      clusterDef.keywords
    );
    const visibilityScore = Math.min(100, termHits * 8 + linkHits * 8 + headingHits * 14);

    return {
      ...clusterDef,
      detected: visibilityScore > 0,
      visibility_score: visibilityScore,
      term_hits: termHits,
      link_hits: linkHits,
      heading_hits: headingHits
    };
  });
}

function extractObservedQueryUniverse(scrape, clusterPresence) {
  const text = [
    scrape.title,
    scrape.meta_description,
    scrape.h1,
    ...(scrape.h2s || []),
    ...(scrape.h3s || []),
    ...(scrape.button_texts || []),
    ...(scrape.anchor_texts || [])
  ].join(" ").toLowerCase();

  const queries = [];

  for (const cluster of clusterPresence) {
    if (cluster.detected || cluster.heading_hits > 0 || cluster.term_hits > 1) {
      for (const keyword of cluster.keywords.slice(0, 4)) {
        queries.push(keyword);
      }
    }
  }

  const heuristics = [
    { term: "phone", query: "who called me" },
    { term: "lookup", query: "reverse lookup" },
    { term: "people", query: "people search" },
    { term: "records", query: "public records search" },
    { term: "privacy", query: "protect my personal data" },
    { term: "remove", query: "remove my info online" },
    { term: "identity", query: "identity protection" },
    { term: "address", query: "who lives at this address" },
    { term: "email", query: "who owns this email" },
    { term: "caller", query: "unknown caller lookup" },
    { term: "neighbor", query: "who lives next door" }
  ];

  for (const h of heuristics) {
    if (text.includes(h.term)) queries.push(h.query);
  }

  return uniq(queries).slice(0, 30);
}

function buildKeywordClusters(clusterPresence, benchmarkLabel) {
  return clusterPresence
    .map((c) => {
      let opportunity = 55;
      if (!c.detected) opportunity += 25;
      else if (c.visibility_score < 30) opportunity += 15;
      if (c.intent_type === "adjacent") opportunity += 8;
      if (c.intent_type === "expansion") opportunity += 12;
      if (c.intent_type === "privacy_adjacent") opportunity += 15;
      if (c.priority === "high") opportunity += 5;
      opportunity = Math.min(100, opportunity);

      return {
        cluster: c.cluster,
        intent_type: c.intent_type,
        priority: c.priority,
        competitor_visibility_score: c.visibility_score,
        detected_on_competitor: c.detected,
        opportunity_score: opportunity,
        opportunity_level: classifyBand(opportunity),
        representative_keywords: c.keywords.slice(0, 6),
        recommended_channels: c.channels,
        volume_tier: c.volume_tier,
        why_it_matters: c.detected
          ? `${c.cluster} appears present on the analyzed brand and likely maps to monetizable demand.`
          : `${c.cluster} looks underrepresented, which may create white-space opportunity versus ${benchmarkLabel}.`
      };
    })
    .sort((a, b) => b.opportunity_score - a.opportunity_score);
}

function buildUnderutilizedKeywords(clusterPresence, benchmarkLabel) {
  const rows = [];
  for (const c of clusterPresence) {
    const underutilized = !c.detected || c.visibility_score < 25 || c.intent_type !== "core";
    if (!underutilized) continue;

    for (const keyword of c.keywords.slice(0, 4)) {
      rows.push({
        keyword,
        cluster: c.cluster,
        priority: c.priority,
        opportunity_level:
          c.intent_type === "privacy_adjacent" || c.intent_type === "expansion" ? "Medium-High" : "High",
        recommended_channel: c.channels[0] || "google_ads",
        why: !c.detected
          ? `This appears missing from the analyzed brand’s emphasis, giving room to test ownership versus ${benchmarkLabel}.`
          : `This appears lightly represented and may support better PPC segmentation.`
      });
    }
  }
  return rows.slice(0, 24);
}

function detectCreativeAngles(fullText, scrape) {
  const text = `${fullText} ${(scrape.button_texts || []).join(" ")}`.toLowerCase();
  return CREATIVE_ANGLES.map((angle) => {
    const hits = countMatches(text, angle.triggers);
    return {
      angle: angle.angle,
      detected: hits > 0,
      trigger_hits: hits,
      user_problem: angle.user_problem,
      best_channels: angle.best_channels,
      hook_templates: angle.hook_templates,
      reason: hits > 0
        ? `Detected ${hits} visible language hit(s) related to this angle.`
        : "Not strongly detected on-page, but relevant to the category."
    };
  }).sort((a, b) => b.trigger_hits - a.trigger_hits);
}

function buildBrandStrengths(scrape, keywordClusters, creativeAngles) {
  const strengths = [];

  const topClusters = keywordClusters
    .filter((k) => k.detected_on_competitor)
    .sort((a, b) => b.competitor_visibility_score - a.competitor_visibility_score)
    .slice(0, 4);

  for (const c of topClusters) {
    strengths.push({
      strength: c.cluster,
      why: `Visible emphasis around ${c.cluster} with visibility score ${c.competitor_visibility_score}.`
    });
  }

  const topAngles = creativeAngles.filter((a) => a.detected).slice(0, 3);
  for (const a of topAngles) {
    strengths.push({
      strength: a.angle,
      why: a.reason
    });
  }

  const ctaText = [...(scrape.button_texts || []), ...(scrape.anchor_texts || [])].join(" ").toLowerCase();
  if (ctaText.includes("protect") || ctaText.includes("privacy")) {
    strengths.push({
      strength: "Privacy-led CTA posture",
      why: "Visible CTA language suggests stronger privacy or protection framing."
    });
  }
  if (ctaText.includes("search") || ctaText.includes("find")) {
    strengths.push({
      strength: "Direct utility CTA posture",
      why: "Visible CTA language emphasizes quick task completion and lookup utility."
    });
  }

  return uniqueObjectsByKey(strengths, "strength").slice(0, 8);
}

function detectSignalFamilies(keywordClusters, creativeAngles, scrape, observedQueries) {
  const signals = new Set();
  const text = getFullText(scrape).toLowerCase();

  if (keywordClusters.some((k) => k.cluster === "reverse phone lookup" && k.detected_on_competitor)) signals.add("phone");
  if (keywordClusters.some((k) => k.intent_type === "privacy_adjacent" && k.detected_on_competitor)) signals.add("privacy");
  if (keywordClusters.some((k) => k.cluster === "people search" && k.detected_on_competitor)) signals.add("people");
  if (keywordClusters.some((k) => ["property records", "reverse address lookup"].includes(k.cluster) && k.detected_on_competitor)) signals.add("property");
  if (creativeAngles.some((a) => a.angle === "Safety / protect myself" && a.detected)) signals.add("safety");
  if (creativeAngles.some((a) => a.angle === "Identity / scam / fraud concern" && a.detected)) signals.add("identity");
  if (creativeAngles.some((a) => a.angle === "Reconnection / find someone" && a.detected)) signals.add("people");
  if ((observedQueries || []).some((q) => q.includes("phone") || q.includes("caller"))) signals.add("phone");
  if ((observedQueries || []).some((q) => q.includes("privacy") || q.includes("remove my info"))) signals.add("privacy");
  if ((observedQueries || []).some((q) => q.includes("people") || q.includes("find"))) signals.add("people");
  if ((observedQueries || []).some((q) => q.includes("address") || q.includes("property"))) signals.add("property");
  if (text.includes("verify")) signals.add("identity");

  if (!signals.size) {
    signals.add("people");
    signals.add("identity");
  }

  return [...signals];
}

function buildDynamicWhitespaceUseCases(keywordClusters, creativeAngles, brandStrengths, scrape, observedQueries, seed) {
  const signalFamilies = detectSignalFamilies(keywordClusters, creativeAngles, scrape, observedQueries);
  const ideas = [];

  for (const family of signalFamilies) {
    const familyIdeas = deterministicPick(DYNAMIC_IDEA_POOLS[family] || [], `${seed}|whitespace|${family}`, 2);
    for (const idea of familyIdeas) {
      ideas.push({
        use_case: idea.customer_problem,
        suggested_angle: idea.marketing_hook,
        channels: idea.suggested_channels,
        why_it_is_white_space: `This expands from the brand’s visible ${family} strength into a more specific buying moment.`,
        why_fund: idea.why_test_this
      });
    }
  }

  const topBrandStrength = brandStrengths[0];
  if (topBrandStrength) {
    ideas.push({
      use_case: `${topBrandStrength.strength} carried into a narrower decision moment`,
      suggested_angle: `Take the visible strength in ${topBrandStrength.strength.toLowerCase()} and make it more scenario-specific.`,
      channels: ["google_ads", "meta_ads", "display"],
      why_it_is_white_space: "Many brands stop at category language instead of moving into the real-life moment behind the search.",
      why_fund: `The analyzed brand appears strong in ${topBrandStrength.strength.toLowerCase()}, which suggests real audience resonance.`
    });
  }

  return filterOutFcraSensitiveIdeas(uniqueObjectsByKey(ideas, "use_case")).slice(0, 10);
}

function buildCreativeSummary(detectedAngles) {
  const top = detectedAngles.filter((a) => a.detected).slice(0, 3).map((a) => a.angle);
  if (!top.length) return "No strong creative angles were detected from visible on-page messaging.";
  return `Top visible creative angles: ${top.join(", ").toLowerCase()}.`;
}

function buildAdCreativeCards(detectedAngles, competitorName) {
  return detectedAngles.slice(0, 6).map((a) => ({
    headline: a.hook_templates[0] || a.angle,
    platform: a.best_channels.join(", "),
    cta: "Learn More / Search Now",
    copy: `${competitorName} appears relevant for "${a.angle}" based on visible site language.`,
    notes: a.reason,
    image_url: ""
  }));
}

function scoreModel(clusterPresence, detectedAngles, scrape) {
  const coreDetected = clusterPresence.filter((c) => c.intent_type === "core" && c.detected).length;
  const allDetected = clusterPresence.filter((c) => c.detected).length;
  const expansionDetected = clusterPresence.filter((c) => c.intent_type === "expansion" && c.detected).length;
  const privacyDetected = clusterPresence.filter((c) => c.intent_type === "privacy_adjacent" && c.detected).length;
  const angleDetected = detectedAngles.filter((a) => a.detected).length;
  const ctaText = [...(scrape.button_texts || []), ...(scrape.anchor_texts || [])].join(" ").toLowerCase();
  const offerHits = countMatches(ctaText, ["start", "learn more", "try", "protect", "privacy", "get", "search"]);
  const funnelSignals = countMatches(getFullText(scrape), ["search", "results", "report", "pricing", "trial", "privacy", "protect"]);
  const monetizationLinks = (scrape.links || []).filter((u) => /pricing|plans|trial|checkout|subscribe|membership/i.test(u)).length;
  const multiChannelSignals = clusterPresence.filter((c) => c.channels.length >= 3).length;

  const keyword_opportunity_score = Math.min(
    100,
    45 + clusterPresence.filter((c) => !c.detected || c.visibility_score < 25).length * 6
  );
  const paid_intent_coverage_score = Math.min(100, coreDetected * 22 + Math.min(12, allDetected * 2));
  const creative_angle_diversity_score = Math.min(100, 30 + angleDetected * 12);
  const use_case_expansion_score = Math.min(100, 35 + expansionDetected * 12 + privacyDetected * 10);
  const offer_cta_strength_score = Math.min(100, 25 + offerHits * 10);
  const funnel_monetization_efficiency_score = Math.min(100, 20 + funnelSignals * 6 + monetizationLinks * 10);
  const channel_expansion_score = Math.min(100, 30 + multiChannelSignals * 7);
  const privacy_adjacent_score = Math.min(100, 30 + privacyDetected * 18);
  const testability_score = Math.min(100, 35 + angleDetected * 8 + expansionDetected * 8 + privacyDetected * 8);

  const keyword_pressure_score = Math.min(
    100,
    Math.round(
      keyword_opportunity_score * SCORE_WEIGHTS.keyword_opportunity +
      paid_intent_coverage_score * SCORE_WEIGHTS.paid_intent_coverage +
      creative_angle_diversity_score * SCORE_WEIGHTS.creative_diversity +
      use_case_expansion_score * SCORE_WEIGHTS.use_case_expansion +
      offer_cta_strength_score * SCORE_WEIGHTS.offer_strength +
      funnel_monetization_efficiency_score * SCORE_WEIGHTS.funnel_efficiency +
      channel_expansion_score * SCORE_WEIGHTS.channel_expansion +
      privacy_adjacent_score * SCORE_WEIGHTS.privacy_adjacent +
      testability_score * SCORE_WEIGHTS.testability
    )
  );

  return {
    keyword_opportunity_score,
    paid_intent_coverage_score,
    creative_angle_diversity_score,
    use_case_expansion_score,
    offer_cta_strength_score,
    funnel_monetization_efficiency_score,
    channel_expansion_score,
    privacy_adjacent_score,
    testability_score,
    keyword_pressure_score,
    pressure_band: classifyBand(keyword_pressure_score)
  };
}

function buildScoreExplanations(scores, clusterPresence, detectedAngles) {
  const underrepresented = clusterPresence.filter((c) => !c.detected || c.visibility_score < 25).length;
  const privacyDetected = clusterPresence.filter((c) => c.intent_type === "privacy_adjacent" && c.detected).length;
  const angleCount = detectedAngles.filter((a) => a.detected).length;

  return {
    keyword_opportunity_score: `Scored ${scores.keyword_opportunity_score} because ${underrepresented} clusters appear underrepresented or missing.`,
    paid_intent_coverage_score: `Scored ${scores.paid_intent_coverage_score} based on visible core demand coverage.`,
    creative_angle_diversity_score: `Scored ${scores.creative_angle_diversity_score} because ${angleCount} distinct angle families were detected.`,
    use_case_expansion_score: `Scored ${scores.use_case_expansion_score} from adjacent, expansion, and privacy-overlap use cases.`,
    privacy_adjacent_score: `Scored ${scores.privacy_adjacent_score} because ${privacyDetected} privacy-adjacent clusters were detected or inferred.`,
    testability_score: `Scored ${scores.testability_score} from the number of differentiated experiments that could be launched cleanly.`,
    keyword_pressure_score: `Composite score built from opportunity, coverage, expansion, privacy adjacency, and testability.`
  };
}

function buildPressureDrivers(scores) {
  const drivers = [];
  if (scores.keyword_opportunity_score >= 70) drivers.push("Large keyword white-space opportunity");
  if (scores.paid_intent_coverage_score >= 60) drivers.push("Strong paid-intent overlap");
  if (scores.creative_angle_diversity_score >= 60) drivers.push("Multiple creative angle families");
  if (scores.use_case_expansion_score >= 60) drivers.push("Expanded use-case positioning");
  if (scores.privacy_adjacent_score >= 55) drivers.push("Privacy / data-protection overlap");
  if (scores.testability_score >= 60) drivers.push("High number of testable ideas");
  return uniq(drivers).slice(0, 8);
}

function buildPressureSummary(scores, drivers, benchmarkLabel) {
  if (!drivers.length) {
    return `The analyzed brand shows limited explicit PPC-intent depth from the landing page alone, which may create room to win through sharper segmentation versus ${benchmarkLabel}.`;
  }
  return `Relative pressure appears ${scores.pressure_band.toLowerCase()}, driven by ${drivers.join(", ").toLowerCase()}.`;
}

function buildChannelRecommendations(keywordClusters, detectedAngles) {
  const topSearch = keywordClusters.filter((k) => k.recommended_channels.includes("google_ads")).slice(0, 4);
  const topSocial = detectedAngles.filter((a) => a.best_channels.includes("meta_ads") || a.best_channels.includes("tiktok_ads")).slice(0, 4);

  return {
    google_ads: [
      `Prioritize clusters such as ${topSearch.map((x) => x.cluster).join(", ") || "reverse phone lookup, privacy protection, people search"}.`,
      "Build tightly segmented ad groups and landing pages by use case, not just by broad category.",
      "Use short, specific, low-friction headlines with the problem and payoff in the first line."
    ],
    bing_ads: [
      "Port high-intent Google structures first.",
      "Focus on exact and phrase match to find efficient demand pockets."
    ],
    meta_ads: [
      `Lead with user-problem angles such as ${topSocial.map((x) => x.angle).join(", ") || "privacy / control my data, safety / protect myself"}.`,
      "Use scenario-led ads rather than feature-led ads.",
      "Keep hooks concrete and consequence-led."
    ],
    tiktok_ads: [
      "Use short narrative hooks around scam concern, exposed data, unknown caller anxiety, and dating safety.",
      "Keep the problem concrete and the payoff immediate."
    ],
    display: [
      "Retarget by intent cluster and funnel stage.",
      "Use reassurance, trust, and exposed-information proof themes."
    ]
  };
}

function buildTestHypotheses(whitespaceUseCases, creativeAngles) {
  const rows = [];

  for (const item of whitespaceUseCases.slice(0, 5)) {
    rows.push({
      title: item.use_case,
      hypothesis: `The business could win by framing around ${item.use_case.toLowerCase()} instead of generic search language.`,
      why_spend_here: item.why_fund,
      primary_kpi: "CTR, CVR, first-sale efficiency"
    });
  }

  for (const angle of creativeAngles.filter((a) => a.detected).slice(0, 3)) {
    rows.push({
      title: angle.angle,
      hypothesis: `This angle already shows signs of resonance and can be made more specific.`,
      why_spend_here: `The angle maps to a real user problem and is adaptable across ${angle.best_channels.join(", ")}.`,
      primary_kpi: "CTR and landing-page CVR"
    });
  }

  return filterOutFcraSensitiveIdeas(rows).slice(0, 8);
}

function buildPriorityTests(keywordClusters, whitespaceUseCases, underutilizedKeywords, detectedAngles) {
  const tests = [];

  const topCluster = keywordClusters[0];
  if (topCluster) {
    tests.push({
      test_name: `Launch search cluster: ${topCluster.cluster}`,
      channel: topCluster.recommended_channels[0] || "google_ads",
      what_to_test: `Build a dedicated campaign and landing page around ${topCluster.cluster}.`,
      hypothesis: `${topCluster.cluster} represents demand that can be captured with stronger specificity and better positioning.`,
      expected_outcome: "Incremental qualified clicks and conversions.",
      why_fund: topCluster.why_it_matters
    });
  }

  const topKeyword = underutilizedKeywords[0];
  if (topKeyword) {
    tests.push({
      test_name: `White-space keyword test: ${topKeyword.keyword}`,
      channel: topKeyword.recommended_channel || "google_ads",
      what_to_test: `Launch exact and phrase match against "${topKeyword.keyword}".`,
      hypothesis: "Lower-competition white-space terms can create efficient incremental volume.",
      expected_outcome: "Incremental clicks and potentially lower blended CPA.",
      why_fund: topKeyword.why
    });
  }

  const topUseCase = whitespaceUseCases[0];
  if (topUseCase) {
    tests.push({
      test_name: `New use-case test: ${topUseCase.use_case}`,
      channel: topUseCase.channels[0] || "meta_ads",
      what_to_test: `Launch creative using the angle "${topUseCase.suggested_angle}".`,
      hypothesis: "New buyer motivations can unlock demand competitors are not directly targeting.",
      expected_outcome: "Net-new demand and differentiated traffic.",
      why_fund: topUseCase.why_fund
    });
  }

  const privacyAngle = detectedAngles.find((a) => a.angle === "Privacy / control my data");
  if (privacyAngle) {
    tests.push({
      test_name: "Privacy-adjacent bridge test",
      channel: privacyAngle.best_channels[0] || "meta_ads",
      what_to_test: `Create ad variants using hooks like "${privacyAngle.hook_templates[0]}" and "${privacyAngle.hook_templates[1]}".`,
      hypothesis: "Privacy-aware users may respond if the product is framed as a self-exposure and awareness tool.",
      expected_outcome: "Broader category reach and incremental audience penetration.",
      why_fund: privacyAngle.reason
    });
  }

  return filterOutFcraSensitiveIdeas(tests).slice(0, 6);
}

function buildOpportunityModel(priorityTests, assumptions) {
  const ctr = Number(assumptions.benchmark_ctr_pct || 4);
  const cvr = Number(assumptions.benchmark_cvr_pct || 3);
  const cpc = Number(assumptions.benchmark_cpc || 2.5);
  const monthlyImpr = Number(assumptions.benchmark_monthly_impressions || 10000);

  const scenarios = priorityTests.map((test, idx) => {
    const multiplier = idx === 0 ? 1.0 : idx === 1 ? 0.7 : 0.5;
    const impressions = Math.round(monthlyImpr * multiplier);
    const clicks = Math.round(impressions * (ctr / 100));
    const sales = Math.round(clicks * (cvr / 100));
    const spend = round2(clicks * cpc);

    return {
      scenario: `Scenario ${idx + 1}`,
      target: test.test_name,
      monthly_impressions: impressions,
      assumed_ctr_pct: ctr,
      estimated_clicks: clicks,
      assumed_cvr_pct: cvr,
      estimated_sales: sales,
      assumed_cpc: round2(cpc),
      estimated_spend: spend,
      why: test.hypothesis
    };
  });

  return {
    assumptions: {
      benchmark_ctr_pct: ctr,
      benchmark_cvr_pct: cvr,
      benchmark_cpc: round2(cpc),
      benchmark_monthly_impressions: monthlyImpr
    },
    total_estimated_incremental_sales: scenarios.reduce((sum, x) => sum + x.estimated_sales, 0),
    total_estimated_test_spend: round2(scenarios.reduce((sum, x) => sum + x.estimated_spend, 0)),
    scenarios
  };
}

function calculateQueryOverlapMetrics(observedQueries, portfolioCompetitors) {
  const lowerQueries = uniq((observedQueries || []).map((q) => String(q).toLowerCase()));
  const overlapGroups = [];

  for (const competitor of portfolioCompetitors) {
    const compLower = competitor.toLowerCase();

    let keywordSet = [...PORTFOLIO_IDENTITY.core_keywords];
    if (compLower.includes("cloaked")) keywordSet = [...PORTFOLIO_IDENTITY.privacy_keywords, ...PORTFOLIO_IDENTITY.adjacent_problems];
    if (compLower.includes("whitepages")) keywordSet = [...PORTFOLIO_IDENTITY.core_keywords, "people finder", "address lookup"];
    if (compLower.includes("spokeo")) keywordSet = [...PORTFOLIO_IDENTITY.core_keywords, "people finder", "email lookup"];
    if (compLower.includes("beenverified")) keywordSet = [...PORTFOLIO_IDENTITY.core_keywords, "background check", "reverse phone lookup"];

    const matchedQueries = [];
    for (const query of lowerQueries) {
      for (const kw of keywordSet) {
        if (query.includes(kw) || kw.includes(query)) {
          matchedQueries.push(query);
          break;
        }
      }
    }

    const overlap_pct = lowerQueries.length
      ? Math.round((uniq(matchedQueries).length / lowerQueries.length) * 100)
      : 0;

    overlapGroups.push({
      competitor,
      overlap_pct,
      matched_queries: uniq(matchedQueries).slice(0, 8)
    });
  }

  return overlapGroups.sort((a, b) => b.overlap_pct - a.overlap_pct);
}

function classifyCompetition(fullText, clusterPresence, detectedAngles, observedQueries, portfolioCompetitors) {
  const keywordOverlapHits = countMatches(fullText, PORTFOLIO_IDENTITY.core_keywords);
  const keyword_overlap = Math.min(100, keywordOverlapHits * 15);

  const problemOverlapHits = countMatches(
    fullText,
    [...PORTFOLIO_IDENTITY.core_problems, ...PORTFOLIO_IDENTITY.adjacent_problems]
  );
  const problem_overlap = Math.min(100, problemOverlapHits * 12);

  const audience_overlap = Math.min(
    100,
    detectedAngles.filter((a) =>
      ["Safety / protect myself", "Identity / scam / fraud concern", "Privacy / control my data"].includes(a.angle)
    ).length * 28
  );

  const query_overlap_rows = calculateQueryOverlapMetrics(observedQueries, portfolioCompetitors);
  const avg_query_overlap = query_overlap_rows.length
    ? Math.round(query_overlap_rows.reduce((sum, r) => sum + r.overlap_pct, 0) / query_overlap_rows.length)
    : 0;
  const top_query_overlap = query_overlap_rows[0]?.overlap_pct || 0;

  const overlap_score = Math.round(
    keyword_overlap * 0.22 +
    problem_overlap * 0.22 +
    audience_overlap * 0.16 +
    avg_query_overlap * 0.40
  );

  let competitor_type = "Indirect";
  let direct = false;

  if (top_query_overlap >= 55 || overlap_score >= 65) {
    competitor_type = "Direct";
    direct = true;
  } else if (avg_query_overlap >= 35 || problem_overlap > 60 || audience_overlap > 55) {
    competitor_type = "Privacy-Adjacent / Problem Competitor";
  }

  return {
    direct_competitor: direct,
    indirect_competitor: true,
    competitor_type,
    overlap_score,
    overlap_breakdown: {
      keyword_overlap,
      problem_overlap,
      audience_overlap,
      avg_query_overlap,
      top_query_overlap
    },
    keyword_query_overlap: query_overlap_rows,
    why_they_compete: direct
      ? "They compete directly on similar search-query themes and likely monetize closely related intent."
      : "They compete by solving adjacent or upstream versions of the same user problems.",
    how_they_steal_budget:
      top_query_overlap >= 55
        ? "They likely show up in materially overlapping search queries, raising CPC and absorbing high-intent traffic."
        : "They may intercept users earlier with privacy, protection, or trust framing before users search directly for portfolio-style solutions.",
    recommended_response:
      top_query_overlap >= 55
        ? "Defend shared query themes and improve landing-page specificity and conversion."
        : "Expand messaging into their angle and capture upstream demand before it gets framed away from the portfolio."
  };
}

function buildAuctionOverlapEstimator(keywordClusters, competition, observedQueries) {
  const top_overlap_keywords = keywordClusters
    .filter((k) => ["core", "privacy_adjacent", "adjacent"].includes(k.intent_type))
    .slice(0, 6)
    .map((k) => ({
      keyword: k.representative_keywords[0] || k.cluster,
      volume_tier: k.volume_tier || "Medium",
      reason: k.detected_on_competitor
        ? "Analyzed brand appears to have visible relevance here."
        : "This is a category keyword that could still indicate likely auction proximity."
    }));

  const auction_overlap_score = Math.round(
    ((competition.overlap_breakdown?.avg_query_overlap || 0) * 0.7) +
    ((competition.overlap_breakdown?.audience_overlap || 0) * 0.15) +
    ((competition.overlap_breakdown?.keyword_overlap || 0) * 0.15)
  );

  let interpretation = "Low expected auction overlap.";
  if (auction_overlap_score >= 70) interpretation = "High expected auction overlap on top-volume search-query themes.";
  else if (auction_overlap_score >= 45) interpretation = "Moderate expected auction overlap, especially on shared search queries.";

  return {
    auction_overlap_score,
    interpretation,
    observed_query_count: (observedQueries || []).length,
    top_overlap_keywords
  };
}

function buildSearchTermAlignment(searchTerms, keywordClusters) {
  const normalized = (searchTerms || []).map((x) => String(x || "").trim()).filter(Boolean);

  const matches = normalized.map((term) => {
    const lower = term.toLowerCase();

    let bestCluster = null;
    let bestScore = 0;

    for (const cluster of keywordClusters) {
      const score =
        countMatches(lower, [cluster.cluster]) +
        countMatches(lower, cluster.representative_keywords || []);
      if (score > bestScore) {
        bestScore = score;
        bestCluster = cluster;
      }
    }

    return {
      search_term: term,
      matched_cluster: bestCluster ? bestCluster.cluster : "No strong match",
      competition_signal: bestCluster
        ? `${bestCluster.opportunity_level} competition / opportunity`
        : "Unknown"
    };
  });

  const alignedCount = matches.filter((m) => m.matched_cluster !== "No strong match").length;
  const alignment_score = normalized.length ? Math.round((alignedCount / normalized.length) * 100) : 0;

  let interpretation = "No search terms were provided.";
  if (normalized.length) {
    if (alignment_score >= 75) interpretation = "Your search terms line up strongly to modeled category themes.";
    else if (alignment_score >= 45) interpretation = "Your search terms partially line up to the modeled themes.";
    else interpretation = "Your search terms show limited alignment to the modeled themes.";
  }

  return {
    alignment_score,
    interpretation,
    matches
  };
}

function buildStealTheirTrafficEngine(keywordClusters, creativeAngles, competition, brandStrengths) {
  const plays = [];

  const topKeywordCluster = keywordClusters[0];
  if (topKeywordCluster) {
    plays.push({
      play_name: `Own the sharper version of ${topKeywordCluster.cluster}`,
      target_cluster: topKeywordCluster.cluster,
      what_to_launch: `Build more specific ad groups and landing pages than the analyzed brand for ${topKeywordCluster.cluster}.`,
      why_this_can_work: "Sharper intent matching often beats broader competitor positioning.",
      expected_outcome: "Higher CTR and better conversion quality on shared demand."
    });
  }

  const privacyCluster = keywordClusters.find((k) => k.intent_type === "privacy_adjacent");
  if (privacyCluster) {
    plays.push({
      play_name: "Bridge lookup intent with privacy concern",
      target_cluster: privacyCluster.cluster,
      what_to_launch: "Launch campaigns that frame your public-records product as both a lookup tool and a self-exposure awareness tool.",
      why_this_can_work: "This lets the portfolio compete against privacy brands without abandoning its core utility edge.",
      expected_outcome: "Access to adjacent demand that privacy-only brands currently frame first."
    });
  }

  const strongestDetectedAngle = creativeAngles.find((a) => a.detected);
  if (strongestDetectedAngle) {
    plays.push({
      play_name: `Counter their best visible angle: ${strongestDetectedAngle.angle}`,
      target_cluster: strongestDetectedAngle.angle,
      what_to_launch: `Launch more specific, scenario-led variants of "${strongestDetectedAngle.hook_templates[0]}".`,
      why_this_can_work: `The analyzed brand already shows visible strength in ${strongestDetectedAngle.angle.toLowerCase()}, which suggests real audience resonance.`,
      expected_outcome: "Share gain from proven message territory."
    });
  }

  const privacyStrength = brandStrengths.find((s) => /privacy/i.test(s.strength));
  if (privacyStrength && competition.competitor_type !== "Direct") {
    plays.push({
      play_name: "Capture upstream privacy-aware traffic",
      target_cluster: "privacy-aware audience",
      what_to_launch: "Create campaigns and landing pages for users asking what others can find about them online.",
      why_this_can_work: "Indirect competitors often reshape demand before it reaches direct lookup auctions.",
      expected_outcome: "Incremental audience reach and earlier funnel capture."
    });
  }

  return filterOutFcraSensitiveIdeas(plays).slice(0, 6);
}

function estimatePortfolioSimilarity(domain, portfolioCompetitors, keywordClusters, competition) {
  return portfolioCompetitors
    .map((competitor) => {
      const samePeoplePattern = competitor.includes("people") && domain.includes("people");

      let similarity = 20;
      similarity += Math.round((competition.overlap_score || 0) * 0.45);

      if (samePeoplePattern) similarity += 10;
      if (competitor.includes("cloaked") && keywordClusters.some((k) => k.intent_type === "privacy_adjacent")) similarity += 10;
      if (competitor.includes("whitepages") && keywordClusters.some((k) => k.cluster === "people search")) similarity += 8;
      if (competitor === domain) similarity = 100;

      similarity = Math.min(100, similarity);

      let reason = "Moderate thematic overlap.";
      if (similarity >= 75) reason = "Strong likely overlap in audience, search-query themes, or auction pressure.";
      else if (similarity >= 50) reason = "Some overlap in use cases or customer demand.";
      else reason = "More limited overlap versus the current portfolio assumptions.";

      return {
        competitor,
        similarity_score: similarity,
        reason
      };
    })
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 12);
}

function buildPortfolioBenchmark(domain, portfolioCompetitors, keywordClusters, competition) {
  return {
    portfolio_competitors: portfolioCompetitors,
    analyzed_domain_in_portfolio: portfolioCompetitors.includes(domain),
    overlap_by_competitor: estimatePortfolioSimilarity(
      domain,
      portfolioCompetitors,
      keywordClusters,
      competition
    )
  };
}

function buildAngleGenerator(keywordClusters, creativeAngles, whitespaceUseCases, competition, brandStrengths, scrape, observedQueries, seed) {
  const signalFamilies = detectSignalFamilies(keywordClusters, creativeAngles, scrape, observedQueries);
  const ideas = [];

  for (const family of signalFamilies) {
    const selected = deterministicPick(DYNAMIC_IDEA_POOLS[family] || [], `${seed}|angle|${family}`, 2);
    for (const idea of selected) {
      ideas.push({
        ...idea,
        direct_response_fit: "High",
        why_brand_specific: `Selected because the analyzed brand shows visible ${family}-oriented demand or messaging.`
      });
    }
  }

  const strongestAngle = creativeAngles.find((a) => a.detected);
  if (strongestAngle) {
    ideas.push({
      idea_name: `${strongestAngle.angle} — sharpened bottom-funnel expansion`,
      marketing_hook: strongestAngle.hook_templates[0],
      customer_problem: strongestAngle.user_problem,
      why_truthfinder_can_help: "The analyzed brand already signals that this theme resonates, but it can be made more specific to a moment-of-need.",
      suggested_channels: strongestAngle.best_channels || ["google_ads"],
      test_format: "Ad family split by scenario and urgency",
      why_test_this: `This particular brand appears to do ${strongestAngle.angle.toLowerCase()} relatively well already.`,
      direct_response_fit: "High",
      why_brand_specific: strongestAngle.reason
    });
  }

  const topBrandStrength = brandStrengths[0];
  if (topBrandStrength) {
    ideas.push({
      idea_name: `${topBrandStrength.strength} into a narrower buying moment`,
      marketing_hook: `Take "${topBrandStrength.strength}" and make it more specific.`,
      customer_problem: `The analyzed brand appears strong in ${topBrandStrength.strength.toLowerCase()}, but not necessarily in the decision moments around it.`,
      why_truthfinder_can_help: "Public-record context can move from a lookup feature into a decision-confidence layer.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Bottom-funnel scenario landing page",
      why_test_this: topBrandStrength.why,
      direct_response_fit: "Medium-High",
      why_brand_specific: `Selected from the brand’s strongest visible theme: ${topBrandStrength.strength}.`
    });
  }

  if (competition?.competitor_type && competition.competitor_type !== "Direct") {
    ideas.push({
      idea_name: "Privacy-to-Lookup Bridge",
      marketing_hook: "Not just privacy. Know what’s actually out there.",
      customer_problem: "Privacy-aware users may want understanding and context before they act.",
      why_truthfinder_can_help: "Public-record context can serve as the understand-first step before users decide what to remove, protect, or investigate.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Bridge-message campaign",
      why_test_this: "This can help the product compete upstream against privacy brands without pretending to be the same product.",
      direct_response_fit: "Medium",
      why_brand_specific: "Chosen because the analyzed brand competes on adjacent privacy/problem framing."
    });
  }

  for (const item of whitespaceUseCases.slice(0, 3)) {
    ideas.push({
      idea_name: `${item.use_case} Expansion`,
      marketing_hook: item.suggested_angle,
      customer_problem: item.use_case,
      why_truthfinder_can_help: "Public-record context can reduce uncertainty and provide real-world signals before a trust decision is made.",
      suggested_channels: item.channels || ["meta_ads"],
      test_format: "Single-problem campaign test",
      why_test_this: item.why_fund,
      direct_response_fit: "Medium-High",
      why_brand_specific: "Selected from the dynamic whitespace engine built off brand signals."
    });
  }

  return filterOutFcraSensitiveIdeas(uniqueObjectsByKey(ideas, "idea_name")).slice(0, 12);
}

function buildDirectResponseLanguage(keywordClusters, creativeAngles, brandStrengths, observedQueries) {
  const topCluster = keywordClusters[0];
  const topAngle = creativeAngles.find((a) => a.detected) || creativeAngles[0];
  const topStrength = brandStrengths[0]?.strength || (topCluster?.cluster || "core lookup intent");
  const queryExample = observedQueries[0] || topCluster?.representative_keywords?.[0] || "people search";

  const universal_patterns = DIRECT_RESPONSE_PATTERN_BANK.map((p) => ({
    ...p,
    industry_translation: "These are evergreen direct-response structures adapted for short-form search ads, social hooks, and landing-page openers."
  }));

  const search_headlines = [
    `${titleCase(queryExample)}? Get Answers Fast`,
    `Before You Trust, Know More`,
    `Need To Check First? Start Here`,
    `Get Clarity In Minutes`,
    `Search Now. Know More Soon.`
  ];

  const paid_social_hooks = [
    `If ${queryExample.toLowerCase()} matters right now, make the fast check before you act.`,
    `The mistake is not always obvious until it is expensive. Check first.`,
    `One search now can save you a bad decision later.`,
    `Before the meetup, callback, deposit, or reply, know more.`,
    `You do not need more content. You need clarity.`
  ];

  const landing_page_openers = [
    `You are here because you need clarity on ${queryExample.toLowerCase()}.`,
    `When the decision matters, the fastest path is a clear check first.`,
    `The goal is simple: reduce uncertainty before you move forward.`,
    `If you are trying to figure out ${queryExample.toLowerCase()}, start with the most direct next step.`
  ];

  const cta_lines = [
    "Start the search now",
    "Check first",
    "Get answers fast",
    "See what you can find",
    "Search before you decide"
  ];

  const brand_specific_swipes = [
    {
      swipe_name: `${topStrength} — search ad swipe`,
      best_use: "Google / Bing bottom-funnel RSA testing",
      examples: [
        `${titleCase(topCluster?.cluster || queryExample)}? Get Answers Fast`,
        `Before You Move Forward, Check First`,
        `The Fast Way To Get Clarity`,
        `Search Now. Know More Soon.`
      ]
    },
    {
      swipe_name: `${topAngle?.angle || "Core angle"} — paid social swipe`,
      best_use: "Meta / TikTok direct-response hooks",
      examples: [
        topAngle?.hook_templates?.[0] || "Before you trust, know more.",
        topAngle?.hook_templates?.[1] || "One quick check can save you a bigger mistake.",
        "The fastest way to reduce uncertainty is to check first."
      ]
    },
    {
      swipe_name: "Cross-industry direct-response copy rules",
      best_use: "Any performance channel",
      examples: [
        "Lead with the problem, not the brand.",
        "Make the consequence legible in one sentence.",
        "Use one concrete CTA, not three vague ones.",
        "Say what happens next and how fast."
      ]
    }
  ];

  return {
    methodology_note:
      "These are modeled high-probability direct-response language patterns built from evergreen DR principles: specificity, urgency, consequence, payoff, and low-friction CTA.",
    universal_patterns,
    best_in_market_examples: {
      search_headlines,
      paid_social_hooks,
      landing_page_openers,
      cta_lines
    },
    brand_specific_swipes
  };
}

async function analyzeSerps(domain, env) {
  const apiKey = String(env.SERPAPI_KEY || "").trim();
  const results = [];

  for (const query of [domain, ...COMMON_QUERY_SETS]) {
    if (!apiKey) {
      results.push({
        query,
        source: "Not connected",
        ads_count: null,
        top_organic_titles: [],
        notes: "SERPAPI_KEY is not configured."
      });
      continue;
    }

    try {
      const url = new URL("https://serpapi.com/search.json");
      url.searchParams.set("engine", "google");
      url.searchParams.set("q", query);
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("num", "10");

      const resp = await fetchWithTimeout(url.toString(), {}, DEFAULT_TIMEOUT_MS);
      if (!resp.ok) throw new Error(`SERP API failed: ${resp.status}`);

      const payload = await resp.json();
      const ads = payload.ads || [];
      const organic = payload.organic_results || [];

      results.push({
        query,
        source: "SerpAPI",
        ads_count: ads.length,
        top_organic_titles: organic.slice(0, 3).map((o) => o.title || ""),
        notes:
          ads.length > 0
            ? `Detected ${ads.length} paid placements in returned snapshot.`
            : "No paid placements detected in returned snapshot."
      });
    } catch (err) {
      results.push({
        query,
        source: "Unavailable",
        ads_count: null,
        top_organic_titles: [],
        notes: `SERP lookup failed: ${err.message}`
      });
    }
  }

  return results;
}

async function maybeCreativeFeed(domain, env) {
  const base = String(env.AD_CREATIVE_API_BASE || "").trim();

  if (!base) {
    return {
      creative_summary: "No creative feed configured.",
      ad_creatives: []
    };
  }

  try {
    const url = new URL("/creatives", base);
    url.searchParams.set("domain", domain);

    const resp = await fetchWithTimeout(url.toString(), {}, 20000);
    if (!resp.ok) throw new Error(`Creative feed failed: ${resp.status}`);

    const payload = await resp.json();

    return {
      creative_summary:
        payload.creative_summary ||
        `Returned ${Array.isArray(payload.ad_creatives) ? payload.ad_creatives.length : 0} creatives`,
      ad_creatives: Array.isArray(payload.ad_creatives) ? payload.ad_creatives.slice(0, 10) : []
    };
  } catch (err) {
    return {
      creative_summary: `Creative feed failed: ${err.message}`,
      ad_creatives: []
    };
  }
}

function buildDataSources(scrape, serps, adCreatives) {
  const serpConnected = serps.some((s) => s.source === "SerpAPI");
  const creativesConnected = (adCreatives || []).length > 0;

  return [
    {
      name: "Homepage Crawl",
      status: "Connected",
      detail: `Parsed ${scrape.final_url}`
    },
    {
      name: "SERP Data",
      status: serpConnected ? "Connected" : "Not connected",
      detail: serpConnected ? "Live SERP data available" : "No SERP connection"
    },
    {
      name: "Ad Creatives",
      status: creativesConnected ? "Connected" : "Not connected",
      detail: creativesConnected ? `${adCreatives.length} creatives returned` : "No creative data"
    }
  ];
}

function buildSummary(domain, scores, keywordClusters, detectedAngles, brandStrengths) {
  const topClusters = keywordClusters.slice(0, 3).map((k) => k.cluster);
  const topAngles = detectedAngles.filter((a) => a.detected).slice(0, 2).map((a) => a.angle);
  const topStrength = brandStrengths[0]?.strength || "no single dominant theme";

  return `${domain} shows ${scores.pressure_band.toLowerCase()} competitive pressure. Its clearest visible strengths appear to be ${topStrength.toLowerCase()}, with the biggest opportunities centered on ${topClusters.join(", ") || "core lookup intent"}. The most visible creative angles are ${topAngles.join(", ").toLowerCase() || "not strongly differentiated"}, which creates room to compete with sharper segmentation, stronger search-query mapping, and adjacent-market expansion.`;
}

async function analyzeCompetitor(inputUrl, env, payload = {}) {
  const market = String(payload.market || "people_search");
  const device = String(payload.device || "mobile");
  const analystQuestions = String(payload.questions || "").trim();
  const searchTerms = Array.isArray(payload.search_terms) ? payload.search_terms : [];
  const portfolioCompetitors = buildPortfolioCompetitors(payload);

  const assumptions = {
    benchmark_ctr_pct: Number(payload.benchmark_ctr_pct || 4),
    benchmark_cvr_pct: Number(payload.benchmark_cvr_pct || 3),
    benchmark_cpc: Number(payload.benchmark_cpc || 2.5),
    benchmark_monthly_impressions: Number(payload.benchmark_monthly_impressions || 10000)
  };

  const url = normalizeInput(inputUrl);
  if (!url) throw new Error("Please enter a competitor URL or domain.");

  const scrape = await fetchHtml(url);
  const domain = domainFromUrl(scrape.final_url);
  const competitorName = titleCase(domain.replace(".com", "").replace(/-/g, " "));
  const seed = `${domain}|${scrape.h1}|${scrape.title}|${scrape.meta_description}`;

  const fullText = getFullText(scrape).toLowerCase();
  const clusterPresence = getClusterPresence(fullText, scrape);
  const observedQueries = extractObservedQueryUniverse(scrape, clusterPresence);
  const keyword_clusters = buildKeywordClusters(clusterPresence, "the portfolio");
  const underutilized_keywords = buildUnderutilizedKeywords(clusterPresence, "the portfolio");
  const detectedAngles = detectCreativeAngles(fullText, scrape);
  const creative_angles = detectedAngles.slice(0, 8);
  const brand_strengths = buildBrandStrengths(scrape, keyword_clusters, creative_angles);
  const whitespace_use_cases = buildDynamicWhitespaceUseCases(
    keyword_clusters,
    creative_angles,
    brand_strengths,
    scrape,
    observedQueries,
    seed
  );
  const scores = scoreModel(clusterPresence, detectedAngles, scrape);

  const competition_classification = classifyCompetition(
    fullText,
    clusterPresence,
    detectedAngles,
    observedQueries,
    portfolioCompetitors
  );

  const auction_overlap_estimator = buildAuctionOverlapEstimator(
    keyword_clusters,
    competition_classification,
    observedQueries
  );

  const search_term_alignment = buildSearchTermAlignment(searchTerms, keyword_clusters);

  const steal_their_traffic_engine = buildStealTheirTrafficEngine(
    keyword_clusters,
    detectedAngles,
    competition_classification,
    brand_strengths
  );

  const portfolio_benchmark = buildPortfolioBenchmark(
    domain,
    portfolioCompetitors,
    keyword_clusters,
    competition_classification
  );

  const angle_generator = buildAngleGenerator(
    keyword_clusters,
    creative_angles,
    whitespace_use_cases,
    competition_classification,
    brand_strengths,
    scrape,
    observedQueries,
    seed
  );

  const direct_response_language = buildDirectResponseLanguage(
    keyword_clusters,
    creative_angles,
    brand_strengths,
    observedQueries
  );

  const score_explanations = buildScoreExplanations(scores, clusterPresence, detectedAngles);
  const pressure_drivers = buildPressureDrivers(scores);
  const pressure_summary = buildPressureSummary(scores, pressure_drivers, "the portfolio");

  const creative_summary_base = buildCreativeSummary(detectedAngles);
  let ad_creatives = buildAdCreativeCards(detectedAngles, competitorName);

  const liveCreativePayload = await maybeCreativeFeed(domain, env).catch(() => ({
    creative_summary: "Creative feed unavailable.",
    ad_creatives: []
  }));

  if ((liveCreativePayload.ad_creatives || []).length) {
    ad_creatives = liveCreativePayload.ad_creatives;
  }

  const creative_summary = (liveCreativePayload.ad_creatives || []).length
    ? liveCreativePayload.creative_summary
    : creative_summary_base;

  const serps = await analyzeSerps(domain, env).catch(() => []);
  const channel_recommendations = buildChannelRecommendations(keyword_clusters, detectedAngles);
  const test_hypotheses = buildTestHypotheses(whitespace_use_cases, creative_angles);
  const priority_tests = buildPriorityTests(
    keyword_clusters,
    whitespace_use_cases,
    underutilized_keywords,
    detectedAngles
  );
  const opportunity_model = buildOpportunityModel(priority_tests, assumptions);
  const data_sources = buildDataSources(scrape, serps, ad_creatives);

  const key_observations = [
    `Competitor type vs portfolio: ${competition_classification.competitor_type}.`,
    `Average keyword-query overlap vs portfolio: ${competition_classification.overlap_breakdown.avg_query_overlap}.`,
    `Estimated auction overlap score: ${auction_overlap_estimator.auction_overlap_score}.`,
    `Observed query universe size: ${observedQueries.length}.`,
    `Top visible strength: ${brand_strengths[0]?.strength || "not obvious"}.`,
    `Estimated incremental sales across priority tests: ${opportunity_model.total_estimated_incremental_sales}.`
  ];

  const action_plan = [
    "Defend the highest-overlap search-query themes with more specific segmentation and tighter landing-page matching.",
    "Build message families around what this brand appears to do well, then out-specific them on scenario and user problem.",
    "Use the observed query universe and search term alignment to decide which themes are worth protecting or expanding.",
    "Run at least one steal-their-traffic play in search and one in paid social.",
    "Test 3 to 5 fresh generated hooks from the angle generator, especially adjacent-market and life-event ideas.",
    "Use the direct-response language section to upgrade search ads, paid social hooks, and landing-page openers."
  ];

  return {
    competitor_name: competitorName,
    domain,
    input_url: url,
    market,
    device,
    analyst_questions: analystQuestions,
    page_title: scrape.title,
    meta_description: scrape.meta_description,
    headline: scrape.h1,
    summary: buildSummary(domain, scores, keyword_clusters, detectedAngles, brand_strengths),

    observed_query_universe: observedQueries,
    brand_strengths,
    portfolio_benchmark,
    competition_classification,
    auction_overlap_estimator,
    search_term_alignment,
    steal_their_traffic_engine,
    direct_response_language,

    keyword_opportunity_score: scores.keyword_opportunity_score,
    paid_intent_coverage_score: scores.paid_intent_coverage_score,
    creative_angle_diversity_score: scores.creative_angle_diversity_score,
    use_case_expansion_score: scores.use_case_expansion_score,
    offer_cta_strength_score: scores.offer_cta_strength_score,
    funnel_monetization_efficiency_score: scores.funnel_monetization_efficiency_score,
    channel_expansion_score: scores.channel_expansion_score,
    privacy_adjacent_score: scores.privacy_adjacent_score,
    testability_score: scores.testability_score,
    keyword_pressure_score: scores.keyword_pressure_score,
    pressure_band: scores.pressure_band,

    score_explanations,
    pressure_summary,
    pressure_drivers,
    keyword_clusters,
    underutilized_keywords,
    whitespace_use_cases,
    angle_generator,
    creative_angles,
    channel_recommendations,
    test_hypotheses,
    priority_tests,
    opportunity_model,
    data_sources,
    creative_summary,
    ad_creatives,
    serps,
    evidence_extracts: buildEvidenceExtracts(scrape),
    key_observations,
    action_plan,
    crawl_notes: [
      `Fetched ${scrape.final_url} with HTTP ${scrape.status_code}`,
      `Parsed ${(scrape.links || []).length} internal links, ${(scrape.button_texts || []).length} buttons, and ${(scrape.anchor_texts || []).length} anchor texts`,
      `Detected ${keyword_clusters.filter((k) => k.detected_on_competitor).length} keyword clusters and ${creative_angles.filter((a) => a.detected).length} angle families`,
      `Observed query universe: ${observedQueries.join(", ") || "none"}`,
      `Portfolio benchmark competitors: ${portfolioCompetitors.join(", ")}`,
      `Analysis context: market=${market}, device=${device}`,
      `Benchmark assumptions: CTR=${assumptions.benchmark_ctr_pct}%, CVR=${assumptions.benchmark_cvr_pct}%, CPC=$${assumptions.benchmark_cpc}, monthly_impr=${assumptions.benchmark_monthly_impressions}`,
      searchTerms.length ? `Search terms supplied: ${searchTerms.length}` : "No search terms supplied.",
      analystQuestions ? `Analyst focus questions: ${analystQuestions}` : "No custom analyst questions supplied.",
      "Angle generation is dynamically selected from brand signal families rather than static recommendations.",
      "FCRA-sensitive ideas and eligibility-style use cases were filtered out of generated outputs.",
      "No persistent storage is used; each analysis is generated fresh per request."
    ]
  };
}

export async function onRequestPost(context) {
  try {
    console.log("ANALYZE VERSION: dynamic-dr-language-v3");
    const payload = await context.request.json();
    const result = await analyzeCompetitor(payload?.url || "", context.env, payload);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || String(err) || "Analysis failed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
