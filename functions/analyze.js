const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/123.0 Safari/537.36";

const DEFAULT_TIMEOUT_MS = 18000;

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

const TRUTHFINDER_IDENTITY = {
  core_keywords: [
    "people search",
    "background check",
    "reverse phone lookup",
    "public records",
    "email lookup",
    "address lookup"
  ],
  core_problems: [
    "identify someone",
    "verify identity",
    "check safety",
    "find information about a person",
    "who called me",
    "is this person safe"
  ],
  adjacent_problems: [
    "protect my identity",
    "who has my data",
    "is my information exposed",
    "can i trust this person",
    "remove my info online",
    "privacy protection"
  ]
};

const SCORE_WEIGHTS = {
  keyword_opportunity: 0.20,
  paid_intent_coverage: 0.16,
  creative_diversity: 0.12,
  use_case_expansion: 0.15,
  offer_strength: 0.07,
  funnel_efficiency: 0.08,
  channel_expansion: 0.05,
  privacy_adjacent: 0.08,
  testability: 0.09
};

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
  }
];

const CREATIVE_ANGLES = [
  {
    angle: "Unknown caller resolution",
    triggers: ["reverse phone", "phone lookup", "who called", "unknown caller", "spam caller", "number"],
    user_problem: "I need to identify who is calling me.",
    best_channels: ["google_ads", "bing_ads", "meta_ads", "tiktok_ads"],
    hook_templates: ["Who just called you?", "Unknown number? Get answers fast.", "Find out who is behind that number."]
  },
  {
    angle: "Safety / protect myself",
    triggers: ["safe", "protect", "security", "verify", "background", "criminal", "records"],
    user_problem: "I want to reduce risk before interacting with someone.",
    best_channels: ["google_ads", "meta_ads", "display", "tiktok_ads"],
    hook_templates: ["Know more before you meet.", "A quick check can save you a major mistake.", "Feel more confident before taking the next step."]
  },
  {
    angle: "Privacy / control my data",
    triggers: ["privacy", "protect data", "remove my info", "identity protection", "data broker", "exposed"],
    user_problem: "I want more control over how exposed my personal information is.",
    best_channels: ["google_ads", "meta_ads", "display"],
    hook_templates: ["See what your digital footprint is exposing.", "Know what others can find about you.", "Take back control of your information."]
  },
  {
    angle: "Identity / scam / fraud concern",
    triggers: ["email", "identity", "scam", "fraud", "dark web", "exposure", "verify"],
    user_problem: "I need to validate identity or check for risk.",
    best_channels: ["meta_ads", "tiktok_ads", "display", "google_ads"],
    hook_templates: ["Validate before you trust.", "Check the identity behind the message.", "See what could be putting you at risk."]
  },
  {
    angle: "Reconnection / find someone",
    triggers: ["find people", "people search", "locate", "reconnect", "find someone"],
    user_problem: "I want to find or reconnect with someone.",
    best_channels: ["google_ads", "bing_ads", "meta_ads"],
    hook_templates: ["Trying to find someone?", "Reconnect with more context.", "Find people faster."]
  },
  {
    angle: "Property / address research",
    triggers: ["address", "property", "owner", "reverse address", "residents"],
    user_problem: "I want to know more about a home, address, or the people tied to it.",
    best_channels: ["google_ads", "bing_ads", "display", "meta_ads"],
    hook_templates: ["Who lives there?", "Research an address before you decide.", "Get more context on a property."]
  }
];

const WHITE_SPACE_USE_CASES = [
  {
    use_case: "Find out what a scammer could learn about you before they target you",
    suggested_angle: "Use TruthFinder as a digital self-exposure check.",
    channels: ["meta_ads", "google_ads", "display"],
    why_it_is_white_space: "Most competitors separate search and privacy instead of blending self-exposure awareness with discoverability.",
    why_fund: "This creates new demand by turning TruthFinder into both a lookup and self-protection insight tool."
  },
  {
    use_case: "Protect elderly parents from unknown callers and suspicious contacts",
    suggested_angle: "Help your family know who is behind the number.",
    channels: ["meta_ads", "display", "google_ads"],
    why_it_is_white_space: "Most messaging is self-focused instead of family-protection focused.",
    why_fund: "Family-protection angles are emotionally strong and can convert higher-intent users."
  },
  {
    use_case: "Check a new roommate, tenant, or subletter before you commit",
    suggested_angle: "Know more before you share a home.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "The category rarely narrows messaging to everyday trust decisions like roommates and sublets.",
    why_fund: "Specific life-event angles can outperform broad generic lookup messaging."
  },
  {
    use_case: "Marketplace safety before meeting a buyer or seller",
    suggested_angle: "Verify before you meet or transact.",
    channels: ["meta_ads", "tiktok_ads", "display"],
    why_it_is_white_space: "Peer-to-peer transaction risk is under-modeled in most category advertising.",
    why_fund: "This is story-friendly, emotionally vivid, and well suited for paid social."
  },
  {
    use_case: "See your own digital footprint before a job search or first date",
    suggested_angle: "Know what others could find before they search you.",
    channels: ["meta_ads", "google_ads", "display"],
    why_it_is_white_space: "Most players focus on searching others, not helping users understand their own discoverability.",
    why_fund: "This expands category demand and bridges directly into privacy competitor territory."
  },
  {
    use_case: "Contractor or in-home worker trust check",
    suggested_angle: "Before they enter your home, know a little more.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "Homeowner trust is not a common direct-response angle in the category.",
    why_fund: "It maps to high perceived risk and clear trust intent."
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

function extractMetaByName(html, name) {
  const regex1 = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([\\s\\S]*?)["'][^>]*>`, "i");
  const regex2 = new RegExp(`<meta[^>]+content=["']([\\s\\S]*?)["'][^>]+name=["']${name}["'][^>]*>`, "i");
  return cleanText(html.match(regex1)?.[1] || html.match(regex2)?.[1] || "");
}

function extractAllMatches(html, regex, limit = 10) {
  return [...html.matchAll(regex)].slice(0, limit).map((m) => cleanText(m[1])).filter(Boolean);
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
  const h2s = extractAllMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 8);
  const h3s = extractAllMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 8);
  const button_texts = extractAllMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 20);
  const anchor_texts = extractAllMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 30);
  const body_text = cleanText(html).slice(0, 40000);

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
    links: links.slice(0, 40),
    body_text,
    status_code: response.status
  };
}

function countMatches(text, terms) {
  const lower = String(text || "").toLowerCase();
  let hits = 0;
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  if (scrape.h2s?.length) extracts.push(`Subheadings: ${scrape.h2s.join(" | ")}`);
  if (scrape.button_texts?.length) extracts.push(`Buttons / CTAs: ${scrape.button_texts.slice(0, 8).join(" | ")}`);
  if (scrape.anchor_texts?.length) extracts.push(`Top link text: ${scrape.anchor_texts.slice(0, 10).join(" | ")}`);
  return extracts.slice(0, 10);
}

function getClusterPresence(fullText, scrape) {
  return KEYWORD_CLUSTERS.map((clusterDef) => {
    const termHits = countMatches(fullText, clusterDef.keywords);
    const linkHits = countMatches((scrape.links || []).join(" "), clusterDef.keywords);
    const visibilityScore = Math.min(100, termHits * 10 + linkHits * 8);

    return {
      ...clusterDef,
      detected: visibilityScore > 0,
      visibility_score: visibilityScore,
      term_hits: termHits,
      link_hits: linkHits
    };
  });
}

function buildKeywordClusters(clusterPresence, brandDomain) {
  return clusterPresence.map((c) => {
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
        ? `${c.cluster} appears present on the competitor site and likely maps to monetizable demand.`
        : `${c.cluster} looks underrepresented, which may create white-space opportunity for ${brandDomain}.`
    };
  }).sort((a, b) => b.opportunity_score - a.opportunity_score);
}

function buildUnderutilizedKeywords(clusterPresence, brandDomain) {
  const rows = [];
  for (const c of clusterPresence) {
    const underutilized = !c.detected || c.visibility_score < 25 || c.intent_type !== "core";
    if (!underutilized) continue;

    for (const keyword of c.keywords.slice(0, 4)) {
      rows.push({
        keyword,
        cluster: c.cluster,
        priority: c.priority,
        opportunity_level: c.intent_type === "privacy_adjacent" || c.intent_type === "expansion" ? "Medium-High" : "High",
        recommended_channel: c.channels[0] || "google_ads",
        why: !c.detected
          ? `This appears missing from competitor emphasis, giving ${brandDomain} room to test ownership.`
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

  const keyword_opportunity_score = Math.min(100, 45 + clusterPresence.filter((c) => !c.detected || c.visibility_score < 25).length * 6);
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

function buildPressureSummary(scores, drivers, brandDomain) {
  if (!drivers.length) {
    return `The competitor shows limited explicit PPC-intent depth from the landing page alone, which may create room for ${brandDomain} to win through sharper segmentation.`;
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
      "Test privacy-adjacent copy that frames TruthFinder as a self-exposure awareness tool."
    ],
    bing_ads: [
      "Port high-intent Google structures first.",
      "Focus on exact and phrase match to find efficient demand pockets."
    ],
    meta_ads: [
      `Lead with user-problem angles such as ${topSocial.map((x) => x.angle).join(", ") || "privacy / control my data, safety / protect myself"}.`,
      "Use scenario-led ads rather than feature-led ads.",
      "Test family-protection and self-audit creative."
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

function buildWhitespaceUseCases() {
  return WHITE_SPACE_USE_CASES;
}

function buildTestHypotheses(whitespaceUseCases, creativeAngles) {
  const rows = [];
  for (const item of whitespaceUseCases.slice(0, 5)) {
    rows.push({
      title: item.use_case,
      hypothesis: `TruthFinder could win by framing around ${item.use_case.toLowerCase()} instead of generic search language.`,
      why_spend_here: item.why_fund,
      primary_kpi: "CTR, CVR, first-sale efficiency"
    });
  }

  for (const angle of creativeAngles.filter((a) => a.detected).slice(0, 3)) {
    rows.push({
      title: angle.angle,
      hypothesis: `This angle already shows signs of resonance and can be made more specific for TruthFinder.`,
      why_spend_here: `The angle maps to a real user problem and is adaptable across ${angle.best_channels.join(", ")}.`,
      primary_kpi: "CTR and landing-page CVR"
    });
  }

  return rows.slice(0, 8);
}

function buildPriorityTests(keywordClusters, whitespaceUseCases, underutilizedKeywords, detectedAngles) {
  const tests = [];

  const topCluster = keywordClusters[0];
  if (topCluster) {
    tests.push({
      test_name: `Launch search cluster: ${topCluster.cluster}`,
      channel: topCluster.recommended_channels[0] || "google_ads",
      what_to_test: `Build a dedicated campaign and LP around ${topCluster.cluster}.`,
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
      hypothesis: "Privacy-aware users may respond to TruthFinder if it is framed as a self-exposure and awareness tool.",
      expected_outcome: "Broader category reach and incremental audience penetration.",
      why_fund: privacyAngle.reason
    });
  }

  return tests.slice(0, 6);
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

function classifyCompetition(fullText, clusterPresence, detectedAngles) {
  const keywordOverlapHits = countMatches(fullText, TRUTHFINDER_IDENTITY.core_keywords);
  const keyword_overlap = Math.min(100, keywordOverlapHits * 15);

  const problemOverlapHits = countMatches(
    fullText,
    [...TRUTHFINDER_IDENTITY.core_problems, ...TRUTHFINDER_IDENTITY.adjacent_problems]
  );
  const problem_overlap = Math.min(100, problemOverlapHits * 12);

  const audience_overlap = Math.min(
    100,
    detectedAngles.filter(a =>
      ["Safety / protect myself", "Identity / scam / fraud concern", "Privacy / control my data"].includes(a.angle)
    ).length * 28
  );

  const overlap_score = Math.round(
    keyword_overlap * 0.4 +
    problem_overlap * 0.4 +
    audience_overlap * 0.2
  );

  let competitor_type = "Indirect";
  let direct = false;

  if (keyword_overlap > 50) {
    competitor_type = "Direct";
    direct = true;
  } else if (problem_overlap > 60 || audience_overlap > 55) {
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
      audience_overlap
    },
    why_they_compete: direct
      ? "They compete directly on similar high-intent keyword themes and monetize closely related intent."
      : "They compete by solving adjacent or upstream versions of the same user problems.",
    how_they_steal_budget: keyword_overlap > 50
      ? "They likely show up in overlapping auctions, raising CPC and absorbing high-intent traffic."
      : "They may intercept users earlier with privacy, protection, or trust framing before users search directly for TruthFinder-style solutions.",
    recommended_response: keyword_overlap > 50
      ? "Defend shared keywords and improve LP specificity and conversion."
      : "Expand messaging into their angle and capture upstream demand before it gets framed away from TruthFinder."
  };
}

function buildAuctionOverlapEstimator(keywordClusters, competition) {
  const top_overlap_keywords = keywordClusters
    .filter(k => ["core", "privacy_adjacent", "adjacent"].includes(k.intent_type))
    .slice(0, 6)
    .map(k => ({
      keyword: k.representative_keywords[0] || k.cluster,
      volume_tier: k.volume_tier || "Medium",
      reason: k.detected_on_competitor
        ? "Competitor appears to have visible relevance here."
        : "This is a category keyword that could still indicate likely auction proximity."
    }));

  const auction_overlap_score = Math.round(
    ((competition.overlap_breakdown?.keyword_overlap || 0) * 0.7) +
    ((competition.overlap_breakdown?.audience_overlap || 0) * 0.3)
  );

  let interpretation = "Low expected auction overlap.";
  if (auction_overlap_score >= 70) interpretation = "High expected auction overlap on top-volume themes.";
  else if (auction_overlap_score >= 45) interpretation = "Moderate expected auction overlap, especially on shared intent themes.";

  return {
    auction_overlap_score,
    interpretation,
    top_overlap_keywords
  };
}

function buildSearchTermAlignment(searchTerms, keywordClusters) {
  const normalized = (searchTerms || []).map(x => String(x || "").trim()).filter(Boolean);

  const matches = normalized.map(term => {
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

  const alignedCount = matches.filter(m => m.matched_cluster !== "No strong match").length;
  const alignment_score = normalized.length
    ? Math.round((alignedCount / normalized.length) * 100)
    : 0;

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

function buildStealTheirTrafficEngine(keywordClusters, creativeAngles, competition) {
  const plays = [];

  const topKeywordCluster = keywordClusters[0];
  if (topKeywordCluster) {
    plays.push({
      play_name: `Own the sharper version of ${topKeywordCluster.cluster}`,
      target_cluster: topKeywordCluster.cluster,
      what_to_launch: `Build more specific ad groups and landing pages than the competitor for ${topKeywordCluster.cluster}.`,
      why_this_can_work: "Sharper intent matching often beats broader competitor positioning.",
      expected_outcome: "Higher CTR and better conversion quality on shared demand."
    });
  }

  const privacyCluster = keywordClusters.find(k => k.intent_type === "privacy_adjacent");
  if (privacyCluster) {
    plays.push({
      play_name: "Bridge lookup intent with privacy concern",
      target_cluster: privacyCluster.cluster,
      what_to_launch: "Launch campaigns that frame TruthFinder as both a lookup tool and a self-exposure awareness tool.",
      why_this_can_work: "This lets TruthFinder compete against privacy brands without abandoning its core utility edge.",
      expected_outcome: "Access to adjacent demand that privacy-only brands currently frame first."
    });
  }

  const safetyAngle = creativeAngles.find(a => a.angle === "Safety / protect myself");
  if (safetyAngle) {
    plays.push({
      play_name: "Win on emotional specificity",
      target_cluster: safetyAngle.angle,
      what_to_launch: `Use hooks like "${safetyAngle.hook_templates[0]}" with scenario-led ad copy.`,
      why_this_can_work: "Scenario-led ads often outperform generic feature messaging in paid social and upper-funnel search.",
      expected_outcome: "More qualified traffic from users with urgent, emotionally clear needs."
    });
  }

  if (competition.competitor_type !== "Direct") {
    plays.push({
      play_name: "Capture upstream privacy-aware traffic",
      target_cluster: "privacy-aware audience",
      what_to_launch: "Create campaigns and LPs for users asking what others can find about them online.",
      why_this_can_work: "Indirect competitors often reshape demand before it reaches direct lookup auctions.",
      expected_outcome: "Incremental audience reach and earlier funnel capture."
    });
  }

  return plays.slice(0, 6);
}

async function analyzeSerps(domain, env) {
  const apiKey = String(env.SERPAPI_KEY || "").trim();
  const rows = [];

  for (const query of [domain, ...COMMON_QUERY_SETS]) {
    if (!apiKey) {
      rows.push({
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

      rows.push({
        query,
        source: "SerpAPI",
        ads_count: ads.length,
        top_organic_titles: organic.slice(0, 3).map((o) => o.title || ""),
        notes: ads.length > 0
          ? `Detected ${ads.length} paid placements in returned snapshot.`
          : "No paid placements detected in returned snapshot."
      });
    } catch (err) {
      rows.push({
        query,
        source: "Unavailable",
        ads_count: null,
        top_organic_titles: [],
        notes: `SERP lookup failed: ${err.message}`
      });
    }
  }

  return rows;
}

async function maybeCreativeFeed(domain, env) {
  const base = String(env.AD_CREATIVE_API_BASE || "").trim();
  if (!base) {
    return {
      creative_summary: "No ad creative feed configured.",
      ad_creatives: []
    };
  }

  try {
    const url = new URL("/creatives", base);
    url.searchParams.set("domain", domain);

    const resp = await fetchWithTimeout(url.toString(), {}, 25000);
    if (!resp.ok) throw new Error(`Creative feed failed: ${resp.status}`);

    const payload = await resp.json();
    return {
      creative_summary: payload.creative_summary || `Creative feed returned ${Array.isArray(payload.ad_creatives) ? payload.ad_creatives.length : 0} creatives.`,
      ad_creatives: Array.isArray(payload.ad_creatives) ? payload.ad_creatives.slice(0, 10) : []
    };
  } catch (err) {
    return {
      creative_summary: `Creative feed configured but request failed: ${err.message}`,
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
      detail: `Fetched ${scrape.final_url} and parsed visible content.`
    },
    {
      name: "SERP Data",
      status: serpConnected ? "Connected" : "Not connected",
      detail: serpConnected ? "Live SERP snapshots returned." : "No live SERP source returned."
    },
    {
      name: "Ad Creatives",
      status: creativesConnected ? "Connected" : "Not connected",
      detail: creativesConnected ? `${adCreatives.length} creative assets returned.` : "No live creative source returned."
    }
  ];
}

function buildSummary(domain, scores, keywordClusters, detectedAngles, brandDomain) {
  const topClusters = keywordClusters.slice(0, 3).map((k) => k.cluster);
  const topAngles = detectedAngles.filter((a) => a.detected).slice(0, 2).map((a) => a.angle);
  return `${domain} shows ${scores.pressure_band.toLowerCase()} competitive pressure with the biggest opportunities centered on ${topClusters.join(", ") || "core lookup intent"}. The most visible creative angles are ${topAngles.join(", ").toLowerCase() || "not strongly differentiated"}, which creates room for ${brandDomain} to compete on sharper segmentation, privacy-adjacent positioning, and more specific use-case messaging.`;
}

async function analyzeCompetitor(inputUrl, env, payload = {}) {
  const brandDomain = String(env.BRAND_DOMAIN || "truthfinder.com").trim();
  const market = String(payload.market || "people_search");
  const device = String(payload.device || "mobile");
  const analystQuestions = String(payload.questions || "").trim();
  const searchTerms = Array.isArray(payload.search_terms) ? payload.search_terms : [];

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
  const competitorName = domain.replace(".com", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const fullText = getFullText(scrape).toLowerCase();
  const clusterPresence = getClusterPresence(fullText, scrape);
  const keyword_clusters = buildKeywordClusters(clusterPresence, brandDomain);
  const underutilized_keywords = buildUnderutilizedKeywords(clusterPresence, brandDomain);
  const detectedAngles = detectCreativeAngles(fullText, scrape);
  const creative_angles = detectedAngles.slice(0, 8);
  const whitespace_use_cases = buildWhitespaceUseCases();
  const scores = scoreModel(clusterPresence, detectedAngles, scrape);

  const competition_classification = classifyCompetition(fullText, clusterPresence, detectedAngles);
  const auction_overlap_estimator = buildAuctionOverlapEstimator(keyword_clusters, competition_classification);
  const search_term_alignment = buildSearchTermAlignment(searchTerms, keyword_clusters);
  const steal_their_traffic_engine = buildStealTheirTrafficEngine(keyword_clusters, detectedAngles, competition_classification);

  const score_explanations = buildScoreExplanations(scores, clusterPresence, detectedAngles);
  const pressure_drivers = buildPressureDrivers(scores);
  const pressure_summary = buildPressureSummary(scores, pressure_drivers, brandDomain);

  const creative_summary_base = buildCreativeSummary(detectedAngles);
  let ad_creatives = buildAdCreativeCards(detectedAngles, competitorName);
  const liveCreativePayload = await maybeCreativeFeed(domain, env);
  if ((liveCreativePayload.ad_creatives || []).length) {
    ad_creatives = liveCreativePayload.ad_creatives;
  }
  const creative_summary = (liveCreativePayload.ad_creatives || []).length
    ? liveCreativePayload.creative_summary
    : creative_summary_base;

  const serps = await analyzeSerps(domain, env);
  const channel_recommendations = buildChannelRecommendations(keyword_clusters, detectedAngles);
  const test_hypotheses = buildTestHypotheses(whitespace_use_cases, creative_angles);
  const priority_tests = buildPriorityTests(keyword_clusters, whitespace_use_cases, underutilized_keywords, detectedAngles);
  const opportunity_model = buildOpportunityModel(priority_tests, assumptions);
  const data_sources = buildDataSources(scrape, serps, ad_creatives);

  const key_observations = [
    `Competitor type vs TruthFinder: ${competition_classification.competitor_type}.`,
    `Estimated auction overlap score: ${auction_overlap_estimator.auction_overlap_score}.`,
    `Search term alignment score: ${search_term_alignment.alignment_score}.`,
    `Estimated incremental sales across priority tests: ${opportunity_model.total_estimated_incremental_sales}.`
  ];

  const action_plan = [
    "Defend the highest-overlap demand themes with more specific segmentation and tighter landing-page matching.",
    "Launch at least one privacy-adjacent bridge campaign to compete with identity / privacy brands.",
    "Use search term alignment results to decide which existing terms are worth protecting or expanding.",
    "Run at least one steal-their-traffic play in search and one in paid social.",
    "Measure winners at the use-case and term level, not just campaign level."
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
    summary: buildSummary(domain, scores, keyword_clusters, detectedAngles, brandDomain),

    competition_classification,
    auction_overlap_estimator,
    search_term_alignment,
    steal_their_traffic_engine,

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
      `Brand comparison anchor: ${brandDomain}`,
      `Analysis context: market=${market}, device=${device}`,
      `Benchmark assumptions: CTR=${assumptions.benchmark_ctr_pct}%, CVR=${assumptions.benchmark_cvr_pct}%, CPC=$${assumptions.benchmark_cpc}, monthly_impr=${assumptions.benchmark_monthly_impressions}`,
      searchTerms.length ? `Search terms supplied: ${searchTerms.length}` : "No search terms supplied.",
      analystQuestions ? `Analyst focus questions: ${analystQuestions}` : "No custom analyst questions supplied.",
      "No persistent storage is used; each analysis is generated fresh per request."
    ]
  };
}

export async function onRequestPost(context) {
  try {
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
