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

const PPC_SCORE_WEIGHTS = {
  keyword_opportunity_score: 0.20,
  paid_intent_coverage_score: 0.16,
  creative_angle_diversity_score: 0.12,
  use_case_expansion_score: 0.15,
  offer_cta_strength_score: 0.07,
  funnel_monetization_efficiency_score: 0.08,
  channel_expansion_score: 0.05,
  privacy_adjacent_score: 0.08,
  testability_score: 0.09
};

const INDUSTRY_KEYWORD_MAP = [
  {
    cluster: "people search",
    intent_type: "core",
    priority: "high",
    keywords: ["people search", "find people", "person search", "people finder", "find a person", "public records"],
    use_cases: ["find someone", "reconnect", "identity lookup"],
    channels: ["google_ads", "bing_ads", "display"]
  },
  {
    cluster: "background check",
    intent_type: "core",
    priority: "high",
    keywords: ["background check", "criminal records", "arrest records", "court records", "background report"],
    use_cases: ["safety screening", "verification", "due diligence"],
    channels: ["google_ads", "bing_ads", "display"]
  },
  {
    cluster: "reverse phone lookup",
    intent_type: "core",
    priority: "high",
    keywords: ["reverse phone lookup", "phone lookup", "who called me", "unknown caller", "spam caller", "who owns this number"],
    use_cases: ["unknown caller resolution", "scam prevention", "identity verification"],
    channels: ["google_ads", "bing_ads", "meta_ads", "tiktok_ads", "display"]
  },
  {
    cluster: "email lookup",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["email lookup", "email owner lookup", "who owns this email", "email search", "reverse email lookup"],
    use_cases: ["identity verification", "scam prevention", "contact validation"],
    channels: ["google_ads", "bing_ads", "meta_ads", "display"]
  },
  {
    cluster: "reverse address lookup",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["reverse address lookup", "who lives at this address", "address lookup", "property address search", "neighbors at address"],
    use_cases: ["new neighborhood research", "property research", "resident lookup"],
    channels: ["google_ads", "bing_ads", "meta_ads", "display"]
  },
  {
    cluster: "property records",
    intent_type: "adjacent",
    priority: "medium-high",
    keywords: ["property records", "property owner lookup", "owner of property", "house owner lookup", "real estate records"],
    use_cases: ["property research", "owner verification", "neighborhood validation"],
    channels: ["google_ads", "bing_ads", "display"]
  },
  {
    cluster: "privacy protection",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["privacy protection", "protect my identity", "stop data brokers", "protect my personal data", "identity privacy"],
    use_cases: ["privacy-first identity concern", "control exposed personal data", "digital safety"],
    channels: ["google_ads", "meta_ads", "display"]
  },
  {
    cluster: "data broker removal",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["data broker removal", "remove my info online", "delete personal data", "remove public records from internet", "online privacy removal"],
    use_cases: ["privacy cleanup", "data exposure concern", "online information control"],
    channels: ["google_ads", "meta_ads", "display"]
  },
  {
    cluster: "identity protection",
    intent_type: "privacy_adjacent",
    priority: "high",
    keywords: ["identity protection", "identity theft prevention", "protect my identity online", "identity monitoring", "data exposure protection"],
    use_cases: ["identity defense", "fraud awareness", "security reassurance"],
    channels: ["google_ads", "meta_ads", "display", "tiktok_ads"]
  },
  {
    cluster: "dark web / identity exposure",
    intent_type: "expansion",
    priority: "medium-high",
    keywords: ["dark web scan", "is my information online", "identity exposure", "personal data leak", "data breach check"],
    use_cases: ["identity protection", "fraud awareness", "personal data monitoring"],
    channels: ["meta_ads", "tiktok_ads", "display", "google_ads"]
  },
  {
    cluster: "dating / personal safety",
    intent_type: "expansion",
    priority: "medium-high",
    keywords: ["background check before dating", "look up someone before meeting", "is this person safe", "check someone before date", "verify someone online dating"],
    use_cases: ["dating safety", "trust validation", "pre-meeting verification"],
    channels: ["meta_ads", "tiktok_ads", "display", "google_ads"]
  },
  {
    cluster: "neighbor / neighborhood research",
    intent_type: "expansion",
    priority: "medium",
    keywords: ["who lives near me", "neighborhood lookup", "neighbor lookup", "who lives next door", "research neighborhood"],
    use_cases: ["moving research", "neighborhood confidence", "property context"],
    channels: ["meta_ads", "display", "google_ads"]
  }
];

const CREATIVE_ANGLE_LIBRARY = [
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
    triggers: ["privacy", "protect data", "my data", "remove my info", "identity protection", "data broker", "exposed"],
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
  },
  {
    angle: "Report depth / hidden details",
    triggers: ["records", "history", "report", "details", "comprehensive", "public records"],
    user_problem: "I want more complete information, not just surface-level answers.",
    best_channels: ["google_ads", "bing_ads", "display"],
    hook_templates: ["Go beyond the basics.", "See more than just a name.", "Unlock deeper context."]
  },
  {
    angle: "Fast answers / instant clarity",
    triggers: ["fast", "quick", "instantly", "immediately", "now", "today"],
    user_problem: "I want answers quickly.",
    best_channels: ["google_ads", "bing_ads", "meta_ads", "tiktok_ads"],
    hook_templates: ["Answers in minutes.", "Get clarity fast.", "Search now. Know more sooner."]
  }
];

const WHITE_SPACE_USE_CASES = [
  {
    use_case: "Find out what a scammer could learn about you before they target you",
    suggested_angle: "Use TruthFinder as a digital self-exposure check.",
    channels: ["meta_ads", "google_ads", "display"],
    why_it_is_white_space: "Competitors often market search or privacy separately instead of blending self-exposure awareness with public-record visibility.",
    why_fund: "This can create net-new demand by turning TruthFinder into both a lookup and self-protection insight tool."
  },
  {
    use_case: "Protect elderly parents from unknown callers and suspicious contacts",
    suggested_angle: "Help your family know who is behind the number.",
    channels: ["meta_ads", "display", "google_ads"],
    why_it_is_white_space: "Most messaging is self-focused instead of family-protection focused.",
    why_fund: "Family-protection angles are emotionally strong and can convert higher-intent problem-aware users."
  },
  {
    use_case: "Check what a new tenant, roommate, or subletter is signaling before you commit",
    suggested_angle: "Know more before you share a home or a property.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "The category rarely narrows messaging to everyday trust decisions like roommates and sublets.",
    why_fund: "Specific life-event angles can outperform broad generic lookup messaging."
  },
  {
    use_case: "Marketplace safety before meeting a buyer or seller",
    suggested_angle: "Verify before you meet or transact.",
    channels: ["meta_ads", "tiktok_ads", "display"],
    why_it_is_white_space: "Peer-to-peer transaction risk is under-modeled in most category advertising.",
    why_fund: "This is story-friendly, emotionally vivid, and suited for paid-social testing."
  },
  {
    use_case: "See your own digital footprint before a job search or first date",
    suggested_angle: "Know what others could find before they search you.",
    channels: ["meta_ads", "google_ads", "display"],
    why_it_is_white_space: "Most players focus on searching others, not helping users understand their own discoverability.",
    why_fund: "Self-audit framing expands category demand and bridges into privacy competitor territory."
  },
  {
    use_case: "Contractor or in-home worker trust check",
    suggested_angle: "Before they enter your home, know a little more.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "Homeowner trust is not a common direct-response angle in the category.",
    why_fund: "It maps to high perceived risk and clear intent."
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
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return `https://${raw}`;
  }
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

  if (!response.ok) {
    throw new Error(`Failed to fetch page: HTTP ${response.status}`);
  }

  const html = await response.text();
  const finalUrl = response.url;

  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const meta_description = extractMetaByName(html, "description") || extractMetaByName(html, "Description");
  const h1 = cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const h2s = extractAllMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 10);
  const h3s = extractAllMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 10);
  const button_texts = extractAllMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 20);
  const anchor_texts = extractAllMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 30);
  const body_text = cleanText(html).slice(0, 40000);

  const links = [];
  const pageUrl = new URL(finalUrl);

  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    const href = String(match[1] || "").trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      continue;
    }
    try {
      const abs = new URL(href, finalUrl).toString();
      if (new URL(abs).hostname === pageUrl.hostname && !links.includes(abs)) {
        links.push(abs);
      }
    } catch {
      // ignore malformed URLs
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
  if (scrape.h2s?.length) extracts.push(`Subheadings: ${scrape.h2s.slice(0, 5).join(" | ")}`);
  if (scrape.button_texts?.length) extracts.push(`Buttons / CTAs: ${scrape.button_texts.slice(0, 8).join(" | ")}`);
  if (scrape.anchor_texts?.length) extracts.push(`Top link text: ${scrape.anchor_texts.slice(0, 10).join(" | ")}`);
  return extracts.slice(0, 12);
}

function getClusterPresence(fullText, scrape) {
  return INDUSTRY_KEYWORD_MAP.map((clusterDef) => {
    const termHits = countMatches(fullText, clusterDef.keywords);
    const visibleLinkHits = countMatches((scrape.links || []).join(" "), clusterDef.keywords);
    const score = Math.min(100, termHits * 10 + visibleLinkHits * 8);

    return {
      ...clusterDef,
      detected: score > 0,
      term_hits: termHits,
      visible_link_hits: visibleLinkHits,
      visibility_score: score
    };
  });
}

function buildKeywordClusters(clusterPresence, brandDomain) {
  return clusterPresence.map((c) => {
    let opportunityScore = 55;

    if (!c.detected) opportunityScore += 25;
    else if (c.visibility_score < 30) opportunityScore += 15;
    if (c.intent_type === "adjacent") opportunityScore += 8;
    if (c.intent_type === "expansion") opportunityScore += 12;
    if (c.intent_type === "privacy_adjacent") opportunityScore += 15;
    if (c.priority === "high") opportunityScore += 5;

    opportunityScore = Math.min(100, opportunityScore);

    return {
      cluster: c.cluster,
      intent_type: c.intent_type,
      priority: c.priority,
      detected_on_competitor: c.detected,
      competitor_visibility_score: c.visibility_score,
      opportunity_score: opportunityScore,
      opportunity_level: classifyBand(opportunityScore),
      representative_keywords: c.keywords.slice(0, 6),
      use_cases: c.use_cases,
      recommended_channels: c.channels,
      why_it_matters: c.detected
        ? `${c.cluster} appears to be actively surfaced by the competitor and represents monetizable PPC intent.`
        : `${c.cluster} is relevant to the category but appears underrepresented on the competitor site, creating a potential expansion or white-space opportunity for ${brandDomain}.`
    };
  }).sort((a, b) => b.opportunity_score - a.opportunity_score);
}

function buildUnderutilizedKeywords(clusterPresence, brandDomain) {
  const ideas = [];

  for (const c of clusterPresence) {
    const underutilized = !c.detected || c.visibility_score < 25 || c.intent_type !== "core";
    if (!underutilized) continue;

    for (const keyword of c.keywords.slice(0, 4)) {
      ideas.push({
        keyword,
        cluster: c.cluster,
        priority: c.priority,
        opportunity_level: c.intent_type === "expansion" || c.intent_type === "privacy_adjacent" ? "Medium-High" : "High",
        why: !c.detected
          ? `This relevant cluster is not clearly surfaced by the competitor, which may give ${brandDomain} room to build coverage and message ownership.`
          : `This cluster appears only lightly surfaced, suggesting room to attack with more specific PPC segmentation and creative alignment.`,
        recommended_channel: c.channels[0] || "google_ads"
      });
    }
  }

  return ideas.slice(0, 24);
}

function detectCreativeAngles(fullText, scrape) {
  const text = `${fullText} ${(scrape.button_texts || []).join(" ")}`.toLowerCase();

  return CREATIVE_ANGLE_LIBRARY.map((angle) => {
    const trigger_hits = countMatches(text, angle.triggers);
    return {
      angle: angle.angle,
      trigger_hits,
      detected: trigger_hits > 0,
      user_problem: angle.user_problem,
      best_channels: angle.best_channels,
      hook_templates: angle.hook_templates,
      reason: trigger_hits > 0
        ? `Detected ${trigger_hits} trigger hit(s) related to this angle in visible site language.`
        : "Not strongly detected on-page, but still relevant to the category."
    };
  }).sort((a, b) => b.trigger_hits - a.trigger_hits);
}

function buildCreativeSummary(detectedAngles) {
  const top = detectedAngles.filter((a) => a.detected).slice(0, 3).map((a) => a.angle);
  if (!top.length) {
    return "No strong on-page creative angles were detected.";
  }
  return `The strongest visible creative angles are ${top.join(", ").toLowerCase()}, which should inform both search copy and paid social hooks.`;
}

function buildAdCreativeCards(detectedAngles, competitorName) {
  return detectedAngles.slice(0, 6).map((a) => ({
    headline: a.hook_templates[0] || a.angle,
    platform: a.best_channels.join(", "),
    cta: "Learn More / Search Now",
    copy: `${competitorName} appears relevant for the "${a.angle}" angle based on visible messaging tied to ${a.user_problem.toLowerCase()}.`,
    notes: a.reason,
    image_url: ""
  }));
}

function scorePpcModel(clusterPresence, detectedAngles, scrape) {
  const coreDetected = clusterPresence.filter((c) => c.intent_type === "core" && c.detected).length;
  const allDetected = clusterPresence.filter((c) => c.detected).length;
  const highIntentDetected = clusterPresence.filter((c) => c.priority === "high" && c.detected).length;
  const expansionDetected = clusterPresence.filter((c) => c.intent_type !== "core" && c.detected).length;
  const privacyDetected = clusterPresence.filter((c) => c.intent_type === "privacy_adjacent" && c.detected).length;
  const angleCount = detectedAngles.filter((a) => a.detected).length;
  const ctaText = [...(scrape.button_texts || []), ...(scrape.anchor_texts || [])].join(" ").toLowerCase();
  const monetizationLinks = (scrape.links || []).filter((u) => /pricing|plans|trial|checkout|subscribe|membership/i.test(u));
  const offerHits = countMatches(ctaText, ["start", "search now", "try", "unlock", "view report", "get report", "see results", "learn more", "protect", "privacy"]);
  const funnelSignals = countMatches(getFullText(scrape), ["search", "results", "report", "pricing", "trial", "checkout", "unlock", "privacy", "protect"]);
  const multiChannelSignals = clusterPresence.filter((c) => c.channels.length >= 3).length;
  const testabilityScore = Math.min(100, 35 + angleCount * 8 + expansionDetected * 10 + privacyDetected * 8);

  const keyword_opportunity_score = Math.min(100, 45 + clusterPresence.filter((c) => !c.detected || c.visibility_score < 25).length * 6);
  const paid_intent_coverage_score = Math.min(100, coreDetected * 22 + highIntentDetected * 8 + Math.min(12, allDetected * 2));
  const creative_angle_diversity_score = Math.min(100, 30 + angleCount * 12);
  const use_case_expansion_score = Math.min(100, 35 + expansionDetected * 12 + privacyDetected * 10);
  const offer_cta_strength_score = Math.min(100, 25 + offerHits * 10);
  const funnel_monetization_efficiency_score = Math.min(100, 20 + funnelSignals * 6 + monetizationLinks.length * 10);
  const channel_expansion_score = Math.min(100, 30 + multiChannelSignals * 7);
  const privacy_adjacent_score = Math.min(100, 30 + privacyDetected * 18);

  const composite = Math.min(
    100,
    Math.round(
      keyword_opportunity_score * PPC_SCORE_WEIGHTS.keyword_opportunity_score +
      paid_intent_coverage_score * PPC_SCORE_WEIGHTS.paid_intent_coverage_score +
      creative_angle_diversity_score * PPC_SCORE_WEIGHTS.creative_angle_diversity_score +
      use_case_expansion_score * PPC_SCORE_WEIGHTS.use_case_expansion_score +
      offer_cta_strength_score * PPC_SCORE_WEIGHTS.offer_cta_strength_score +
      funnel_monetization_efficiency_score * PPC_SCORE_WEIGHTS.funnel_monetization_efficiency_score +
      channel_expansion_score * PPC_SCORE_WEIGHTS.channel_expansion_score +
      privacy_adjacent_score * PPC_SCORE_WEIGHTS.privacy_adjacent_score +
      testabilityScore * PPC_SCORE_WEIGHTS.testability_score
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
    testability_score: testabilityScore,
    keyword_pressure_score: composite,
    pressure_band: classifyBand(composite)
  };
}

function buildScoreExplanations(ppcScores, clusterPresence, detectedAngles, scrape) {
  const underutilizedCount = clusterPresence.filter((c) => !c.detected || c.visibility_score < 25).length;
  const coreDetected = clusterPresence.filter((c) => c.intent_type === "core" && c.detected).length;
  const expansionDetected = clusterPresence.filter((c) => c.intent_type !== "core" && c.detected).length;
  const privacyDetected = clusterPresence.filter((c) => c.intent_type === "privacy_adjacent" && c.detected).length;
  const angleCount = detectedAngles.filter((a) => a.detected).length;
  const monetizationLinks = (scrape.links || []).filter((u) => /pricing|plans|trial|checkout|subscribe|membership/i.test(u)).length;

  return {
    keyword_opportunity_score:
      `Keyword Opportunity scored ${ppcScores.keyword_opportunity_score} because ${underutilizedCount} relevant clusters appear underrepresented or missing.`,
    paid_intent_coverage_score:
      `Paid Intent Coverage scored ${ppcScores.paid_intent_coverage_score} based on ${coreDetected} detected core high-intent category clusters.`,
    creative_angle_diversity_score:
      `Creative Angle Diversity scored ${ppcScores.creative_angle_diversity_score} because ${angleCount} angle families were detected.`,
    use_case_expansion_score:
      `Use-Case Expansion scored ${ppcScores.use_case_expansion_score} based on ${expansionDetected} adjacent / expansion themes plus privacy overlap.`,
    offer_cta_strength_score:
      `Offer / CTA Strength scored ${ppcScores.offer_cta_strength_score} from visible CTA language and action prompts.`,
    funnel_monetization_efficiency_score:
      `Funnel Monetization Efficiency scored ${ppcScores.funnel_monetization_efficiency_score} based on result-promise and monetization signals, including ${monetizationLinks} pricing-like links.`,
    channel_expansion_score:
      `Channel Expansion scored ${ppcScores.channel_expansion_score} based on how broadly detected use cases map across search, social, and display.`,
    privacy_adjacent_score:
      `Privacy Adjacent scored ${ppcScores.privacy_adjacent_score} because ${privacyDetected} privacy / data-protection clusters were detected or inferred.`,
    testability_score:
      `Testability scored ${ppcScores.testability_score} based on how many differentiated experiments can be launched with clear hypotheses.`,
    keyword_pressure_score:
      `Composite Pressure scored ${ppcScores.keyword_pressure_score} using weighted PPC dimensions including keyword opportunity, use-case expansion, privacy adjacency, and testability.`
  };
}

function buildScoringMethodology() {
  return {
    keyword_opportunity_score: "Scores the amount of adjacent or underrepresented keyword white space visible relative to the category opportunity map.",
    paid_intent_coverage_score: "Scores how many core, monetizable paid-intent clusters the competitor appears to surface on-page.",
    creative_angle_diversity_score: "Scores how many distinct creative hook families are visible in the page language and CTA structure.",
    use_case_expansion_score: "Scores how far the site expands beyond generic category terms into more specific user jobs-to-be-done.",
    offer_cta_strength_score: "Scores the clarity and directness of CTA, search-start, report-access, and offer framing language.",
    funnel_monetization_efficiency_score: "Scores whether the page appears to move users from intent capture toward results and monetization with minimal friction.",
    channel_expansion_score: "Scores how broadly the detected use cases and hooks can extend across Google Ads, Bing Ads, Meta, TikTok, and display.",
    privacy_adjacent_score: "Scores how strongly the brand overlaps privacy, identity protection, or data-protection positioning.",
    testability_score: "Scores how many differentiated experiments can be launched with measurable outcomes.",
    keyword_pressure_score: "Composite PPC model score weighted toward keyword opportunity, use-case expansion, privacy adjacency, and testability."
  };
}

function buildPressureDrivers(detectedAngles, scrape, ppcScores) {
  const drivers = [];
  if (ppcScores.keyword_opportunity_score >= 70) drivers.push("Large keyword white-space opportunity");
  if (ppcScores.paid_intent_coverage_score >= 65) drivers.push("Strong paid-intent cluster coverage");
  if (ppcScores.creative_angle_diversity_score >= 60) drivers.push("Multiple creative angle families");
  if (ppcScores.use_case_expansion_score >= 60) drivers.push("Expanded use-case merchandising");
  if (ppcScores.privacy_adjacent_score >= 55) drivers.push("Privacy / data-protection overlap");
  if ((scrape.links || []).some((u) => /pricing|plans|trial|checkout|subscribe|membership/i.test(u))) {
    drivers.push("Visible monetization path");
  }
  return uniq(drivers).slice(0, 8);
}

function buildPressureSummary(ppcScores, drivers, brandDomain) {
  if (!drivers.length) {
    return `The competitor presents limited explicit PPC-intent depth from the landing page alone, which may create room for ${brandDomain} to win through stronger segmentation and message specificity.`;
  }
  return `Relative PPC pressure appears ${ppcScores.pressure_band.toLowerCase()}, driven by ${drivers.join(", ").toLowerCase()}.`;
}

function buildActionPlan(keywordClusters, underutilizedKeywords, detectedAngles, ppcScores, brandDomain) {
  const actions = [];

  if (ppcScores.keyword_opportunity_score >= 70) {
    actions.push("Break out white-space search campaigns for underutilized adjacent intents before competitors scale harder into them.");
  }

  const topKeywordClusters = keywordClusters.slice(0, 4).map((k) => k.cluster);
  if (topKeywordClusters.length) actions.push(`Build segmented search structures around: ${topKeywordClusters.join(", ")}.`);

  const topUnder = underutilizedKeywords.slice(0, 4).map((k) => k.keyword);
  if (topUnder.length) actions.push(`Launch exploratory exact / phrase match testing for: ${topUnder.join(", ")}.`);

  const topAngles = detectedAngles.filter((a) => a.detected).slice(0, 3).map((a) => a.angle);
  if (topAngles.length) actions.push(`Test new ad creative around these angle families: ${topAngles.join(", ")}.`);

  actions.push("Build at least one TruthFinder campaign theme that bridges lookup intent with privacy / self-exposure insight.");
  actions.push("Create cross-channel message maps so Google/Bing copy, Meta/TikTok hooks, and display retargeting all align to the same user problem.");
  actions.push(`Use ${brandDomain} as the message anchor for stronger trust, report depth, and practical problem-solving instead of generic category copy.`);
  actions.push("Track query-level winners by use case, not just by campaign, so budgets can move toward the highest-intent problem clusters.");

  return uniq(actions).slice(0, 10);
}

function buildChannelRecommendations(keywordClusters, detectedAngles) {
  const topSearchClusters = keywordClusters.filter((k) => k.recommended_channels.includes("google_ads")).slice(0, 4);
  const topSocialAngles = detectedAngles.filter((a) => a.best_channels.includes("meta_ads") || a.best_channels.includes("tiktok_ads")).slice(0, 4);
  const displayClusters = keywordClusters.filter((k) => k.recommended_channels.includes("display")).slice(0, 4);

  return {
    google_ads: [
      "Segment campaigns by use case, not just by generic category term.",
      `Prioritize keyword clusters: ${topSearchClusters.map((c) => c.cluster).join(", ") || "reverse phone lookup, people search, privacy protection"}.`,
      "Test privacy-adjacent landing pages that frame TruthFinder as a self-exposure and identity-awareness tool.",
      "Defend branded and problem-solution queries with stronger trust + utility combinations."
    ],
    bing_ads: [
      "Replicate the highest-intent Google structures first before broadening coverage.",
      "Bias toward exact and phrase match where CPC efficiency allows deeper experimentation.",
      "Use safety, trust, and family-protection framing where appropriate."
    ],
    meta_ads: [
      `Lead with user-problem hooks like: ${topSocialAngles.map((a) => a.angle).join(", ") || "privacy / control my data, unknown caller resolution, safety / protect myself"}.`,
      "Use scenario-led creatives rather than feature-only messaging.",
      "Test self-audit and family-protection angles alongside standard lookup messages."
    ],
    tiktok_ads: [
      "Use short narrative hooks tied to scam concern, unknown caller anxiety, exposed-data awareness, and dating safety.",
      "Test creator-style storytelling with strong first-3-second hooks and clear payoff.",
      "Keep offers simple and use cases concrete."
    ],
    display: [
      `Build retargeting around clusters like: ${displayClusters.map((c) => c.cluster).join(", ") || "reverse phone lookup, identity protection, privacy protection"}.`,
      "Retarget by funnel stage: homepage visitor, search starter, pricing visitor, and report abandoner.",
      "Use reassurance, risk-reduction, and exposed-information proof angles."
    ]
  };
}

function buildWhitespaceUseCases() {
  return WHITE_SPACE_USE_CASES;
}

function buildTestHypotheses(whitespaceUseCases, creativeAngles) {
  const ideas = [];

  for (const item of whitespaceUseCases.slice(0, 5)) {
    ideas.push({
      title: item.use_case,
      hypothesis: `TruthFinder could win by framing around ${item.use_case.toLowerCase()} instead of generic search language.`,
      why_spend_here: item.why_fund,
      primary_kpi: "CTR, CVR, first-sale efficiency"
    });
  }

  for (const angle of creativeAngles.filter((a) => a.detected).slice(0, 3)) {
    ideas.push({
      title: angle.angle,
      hypothesis: `This angle already shows signs of resonance and can be made more specific and more emotional for TruthFinder.`,
      why_spend_here: `The angle maps cleanly to a real user problem and is adaptable across ${angle.best_channels.join(", ")}.`,
      primary_kpi: "CTR and landing-page CVR"
    });
  }

  return ideas.slice(0, 8);
}

function buildPriorityTests(keywordClusters, whitespaceUseCases, underutilizedKeywords, detectedAngles) {
  const tests = [];

  const topCluster = keywordClusters[0];
  if (topCluster) {
    tests.push({
      test_name: `Search launch for ${topCluster.cluster}`,
      channel: (topCluster.recommended_channels || [])[0] || "google_ads",
      what_to_test: `Build a tightly segmented campaign around ${topCluster.cluster} with dedicated copy and landing-page framing.`,
      hypothesis: `${topCluster.cluster} represents high-intent demand and can be won with sharper specificity and clearer TruthFinder differentiation.`,
      expected_outcome: "Higher qualified click-through and incremental conversion volume from under-defended intent.",
      why_fund: topCluster.why_it_matters
    });
  }

  const topUnder = underutilizedKeywords[0];
  if (topUnder) {
    tests.push({
      test_name: `Keyword white-space test: ${topUnder.keyword}`,
      channel: topUnder.recommended_channel || "google_ads",
      what_to_test: `Launch exact and phrase match around "${topUnder.keyword}" with problem-led ad copy.`,
      hypothesis: "Lower-competition white-space terms can create cheaper incremental volume than crowded head terms.",
      expected_outcome: "Incremental clicks and a lower blended CPA test lane.",
      why_fund: topUnder.why
    });
  }

  const topWhite = whitespaceUseCases[0];
  if (topWhite) {
    tests.push({
      test_name: `New use-case expansion: ${topWhite.use_case}`,
      channel: (topWhite.channels || [])[0] || "meta_ads",
      what_to_test: `Launch creative themed around "${topWhite.suggested_angle}" with audience-specific landing support.`,
      hypothesis: "New buyer motivations can unlock demand that competitors are not directly bidding into or messaging toward.",
      expected_outcome: "Incremental net-new demand and differentiated traffic.",
      why_fund: topWhite.why_fund
    });
  }

  const privacyAngle = detectedAngles.find((a) => a.angle === "Privacy / control my data");
  if (privacyAngle) {
    tests.push({
      test_name: `Privacy-adjacent angle bridge`,
      channel: (privacyAngle.best_channels || [])[0] || "meta_ads",
      what_to_test: `Create ad variants using hooks like: ${(privacyAngle.hook_templates || []).slice(0, 2).join(" / ")}.`,
      hypothesis: "Privacy-aware users may respond to TruthFinder when positioned as a self-exposure awareness tool, not only a lookup tool.",
      expected_outcome: "Incremental audience reach and broader category relevance.",
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
    const testImpr = Math.round(monthlyImpr * multiplier);
    const clicks = Math.round(testImpr * (ctr / 100));
    const sales = Math.round(clicks * (cvr / 100));
    const spend = round2(clicks * cpc);

    return {
      scenario: `Scenario ${idx + 1}`,
      target: test.test_name,
      monthly_impressions: testImpr,
      assumed_ctr_pct: ctr,
      estimated_clicks: clicks,
      assumed_cvr_pct: cvr,
      estimated_sales: sales,
      assumed_cpc: round2(cpc),
      estimated_spend: spend,
      why: test.hypothesis
    };
  });

  const total_sales = scenarios.reduce((sum, s) => sum + s.estimated_sales, 0);
  const total_spend = round2(scenarios.reduce((sum, s) => sum + s.estimated_spend, 0));

  return {
    assumptions: {
      benchmark_ctr_pct: ctr,
      benchmark_cvr_pct: cvr,
      benchmark_cpc: round2(cpc),
      benchmark_monthly_impressions: monthlyImpr
    },
    total_estimated_incremental_sales: total_sales,
    total_estimated_test_spend: total_spend,
    scenarios
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
        notes: ads.length > 0
          ? `Detected ${ads.length} paid placements in returned SERP snapshot.`
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

async function maybeScreenshot(url, label, stage, env) {
  const base = String(env.SCREENSHOT_API_BASE || "").trim();
  if (!base) return null;

  try {
    const endpoint = new URL("/capture", base).toString();
    const reqUrl = new URL(endpoint);
    reqUrl.searchParams.set("url", url);

    const resp = await fetchWithTimeout(reqUrl.toString(), {}, 30000);
    if (!resp.ok) throw new Error(`Screenshot failed: ${resp.status}`);

    const data = await resp.json();
    return {
      label,
      stage,
      notes: "Screenshot successfully captured from configured screenshot service.",
      url: data.image_url || ""
    };
  } catch (err) {
    return {
      label,
      stage,
      notes: `Screenshot service attempted but failed: ${err.message}`,
      url: ""
    };
  }
}

async function maybeCreativeFeed(domain, env) {
  const base = String(env.AD_CREATIVE_API_BASE || "").trim();
  if (!base) {
    return {
      creative_summary: "No ad creative feed configured. Set AD_CREATIVE_API_BASE to return real competitor ad creative screenshots and metadata.",
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
      creative_summary:
        payload.creative_summary ||
        `Creative feed returned ${Array.isArray(payload.ad_creatives) ? payload.ad_creatives.length : 0} ad creatives.`,
      ad_creatives: Array.isArray(payload.ad_creatives) ? payload.ad_creatives.slice(0, 10) : []
    };
  } catch (err) {
    return {
      creative_summary: `Creative feed configured but request failed: ${err.message}`,
      ad_creatives: []
    };
  }
}

function buildDataSources(scrape, serps, screenshots, adCreatives) {
  const serpConnected = serps.some((s) => s.source === "SerpAPI");
  const screenshotConnected = (screenshots || []).some((s) => s.url);
  const creativesConnected = (adCreatives || []).length > 0;

  return [
    {
      name: "Homepage Crawl",
      status: "Connected",
      detail: `Fetched ${scrape.final_url} and parsed visible PPC-relevant content.`
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
    },
    {
      name: "Screenshot Capture",
      status: screenshotConnected ? "Connected" : "Not connected",
      detail: screenshotConnected ? "One or more screenshots were returned." : "No screenshot source returned."
    }
  ];
}

function buildDetectedHooks(detectedAngles) {
  return detectedAngles.filter((a) => a.detected).slice(0, 6).map((a) => a.angle);
}

function buildFunnelSteps(scrape) {
  const text = getFullText(scrape).toLowerCase();
  const steps = ["Homepage / intent capture"];

  if (["search", "lookup", "find", "start"].some((k) => text.includes(k))) steps.push("Search input / lookup start");
  if (["results", "report", "records", "details", "matches"].some((k) => text.includes(k))) steps.push("Perceived results / value build");
  if (["pricing", "plans", "trial", "checkout", "subscribe", "membership"].some((k) => text.includes(k))) steps.push("Monetization / paywall handoff");

  return uniq(steps).slice(0, 5);
}

function buildSummary(domain, ppcScores, keywordClusters, detectedAngles, brandDomain) {
  const topClusters = keywordClusters.slice(0, 3).map((k) => k.cluster);
  const topAngles = detectedAngles.filter((a) => a.detected).slice(0, 2).map((a) => a.angle);

  return `${domain} shows ${ppcScores.pressure_band.toLowerCase()} PPC pressure with the biggest opportunities centered on ${topClusters.join(", ") || "core lookup intent"}. The most visible creative angles are ${topAngles.join(", ").toLowerCase() || "not strongly differentiated"}, creating room for ${brandDomain} to compete more aggressively on keyword segmentation, privacy-adjacent positioning, and cross-channel message alignment.`;
}

async function analyzeCompetitor(inputUrl, env, payload = {}) {
  const brandDomain = String(env.BRAND_DOMAIN || "truthfinder.com").trim();
  const market = String(payload.market || "people_search");
  const device = String(payload.device || "mobile");
  const analystQuestions = String(payload.questions || "").trim();

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

  const fullText = getFullText(scrape);
  const clusterPresence = getClusterPresence(fullText, scrape);
  const keyword_clusters = buildKeywordClusters(clusterPresence, brandDomain);
  const underutilized_keywords = buildUnderutilizedKeywords(clusterPresence, brandDomain);
  const detectedAngles = detectCreativeAngles(fullText, scrape);
  const creative_angles = detectedAngles.slice(0, 8);
  const whitespace_use_cases = buildWhitespaceUseCases();
  const ppcScores = scorePpcModel(clusterPresence, detectedAngles, scrape);

  const score_explanations = buildScoreExplanations(ppcScores, clusterPresence, detectedAngles, scrape);
  const scoring_methodology = buildScoringMethodology();
  const pressure_drivers = buildPressureDrivers(detectedAngles, scrape, ppcScores);
  const pressure_summary = buildPressureSummary(ppcScores, pressure_drivers, brandDomain);
  const detected_hooks = buildDetectedHooks(detectedAngles);
  const detected_funnel_steps = buildFunnelSteps(scrape);
  const evidence_extracts = buildEvidenceExtracts(scrape);
  const creative_summary = buildCreativeSummary(detectedAngles);

  let ad_creatives = buildAdCreativeCards(detectedAngles, competitorName);
  const liveCreativePayload = await maybeCreativeFeed(domain, env);
  if ((liveCreativePayload.ad_creatives || []).length) ad_creatives = liveCreativePayload.ad_creatives;

  const creativeSummaryFinal = (liveCreativePayload.ad_creatives || []).length
    ? liveCreativePayload.creative_summary
    : creative_summary;

  const screenshots = [];
  const homepageShot = await maybeScreenshot(scrape.final_url, "Homepage Above the Fold", "Intent Capture", env);
  if (homepageShot) screenshots.push(homepageShot);

  const serps = await analyzeSerps(domain, env);
  const channel_recommendations = buildChannelRecommendations(keyword_clusters, detectedAngles);
  const data_sources = buildDataSources(scrape, serps, screenshots, ad_creatives);
  const test_hypotheses = buildTestHypotheses(whitespace_use_cases, creative_angles);
  const priority_tests = buildPriorityTests(keyword_clusters, whitespace_use_cases, underutilized_keywords, detectedAngles);
  const opportunity_model = buildOpportunityModel(priority_tests, assumptions);

  const key_observations = [
    `Top keyword opportunity areas: ${keyword_clusters.slice(0, 3).map((k) => k.cluster).join(", ") || "not enough data"}.`,
    `Top creative angle signals: ${creative_angles.filter((a) => a.detected).slice(0, 3).map((a) => a.angle).join(", ") || "not strongly differentiated"}.`,
    `${underutilized_keywords.length} underutilized keyword ideas were generated from the category map and competitor surface analysis.`,
    `Estimated incremental sales across proposed priority tests: ${opportunity_model.total_estimated_incremental_sales}.`
  ];

  const action_plan = buildActionPlan(keyword_clusters, underutilized_keywords, detectedAngles, ppcScores, brandDomain);

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
    summary: buildSummary(domain, ppcScores, keyword_clusters, detectedAngles, brandDomain),

    keyword_opportunity_score: ppcScores.keyword_opportunity_score,
    paid_intent_coverage_score: ppcScores.paid_intent_coverage_score,
    creative_angle_diversity_score: ppcScores.creative_angle_diversity_score,
    use_case_expansion_score: ppcScores.use_case_expansion_score,
    offer_cta_strength_score: ppcScores.offer_cta_strength_score,
    funnel_monetization_efficiency_score: ppcScores.funnel_monetization_efficiency_score,
    channel_expansion_score: ppcScores.channel_expansion_score,
    privacy_adjacent_score: ppcScores.privacy_adjacent_score,
    testability_score: ppcScores.testability_score,

    keyword_pressure_score: ppcScores.keyword_pressure_score,
    pressure_band: ppcScores.pressure_band,

    trust_score: Math.round((ppcScores.paid_intent_coverage_score + ppcScores.offer_cta_strength_score) / 2),
    urgency_score: Math.round((ppcScores.offer_cta_strength_score + ppcScores.funnel_monetization_efficiency_score) / 2),
    utility_score: ppcScores.keyword_opportunity_score,
    value_score: Math.round((ppcScores.keyword_opportunity_score + ppcScores.use_case_expansion_score) / 2),
    emotional_score: Math.round((ppcScores.creative_angle_diversity_score + ppcScores.channel_expansion_score) / 2),
    seo_signal_score: Math.round((ppcScores.paid_intent_coverage_score + ppcScores.use_case_expansion_score) / 2),

    score_explanations,
    scoring_methodology,
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
    detected_hooks,
    detected_funnel_steps,
    key_observations,
    action_plan,
    evidence_extracts,

    creative_summary: creativeSummaryFinal,
    ad_creatives,
    serps,
    screenshots,

    crawl_notes: [
      `Fetched ${scrape.final_url} with HTTP ${scrape.status_code}`,
      `Parsed ${(scrape.links || []).length} internal links, ${(scrape.button_texts || []).length} buttons, and ${(scrape.anchor_texts || []).length} anchor texts`,
      `Detected ${keyword_clusters.filter((k) => k.detected_on_competitor).length} keyword clusters and ${creative_angles.filter((a) => a.detected).length} creative angle families`,
      `Brand comparison anchor: ${brandDomain}`,
      `Analysis context: market=${market}, device=${device}`,
      `Benchmark assumptions: CTR=${assumptions.benchmark_ctr_pct}%, CVR=${assumptions.benchmark_cvr_pct}%, CPC=$${assumptions.benchmark_cpc}, monthly_impr=${assumptions.benchmark_monthly_impressions}`,
      analystQuestions ? `Analyst focus questions: ${analystQuestions}` : "No custom analyst questions supplied.",
      "No persistent storage is used; each analysis is generated fresh per request."
    ]
  };
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const inputUrl = payload?.url || "";
    const result = await analyzeCompetitor(inputUrl, context.env, payload);

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
