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
  keyword_opportunity: 0.2,
  paid_intent_coverage: 0.16,
  creative_diversity: 0.12,
  use_case_expansion: 0.15,
  offer_strength: 0.07,
  funnel_efficiency: 0.08,
  channel_expansion: 0.05,
  privacy_adjacent: 0.08,
  testability: 0.09
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

const WHITE_SPACE_USE_CASES = [
  {
    use_case: "Find out what a scammer could learn about you before they target you",
    suggested_angle: "Use public-records data as a digital self-exposure check.",
    channels: ["meta_ads", "google_ads", "display"],
    why_it_is_white_space: "Most competitors separate search and privacy instead of blending self-exposure awareness with discoverability.",
    why_fund: "This creates new demand by turning the product into both a lookup and self-protection insight tool."
  },
  {
    use_case: "Protect elderly parents from unknown callers and suspicious contacts",
    suggested_angle: "Help your family know who is behind the number.",
    channels: ["meta_ads", "display", "google_ads"],
    why_it_is_white_space: "Most messaging is self-focused instead of family-protection focused.",
    why_fund: "Family-protection angles are emotionally strong and can convert higher-intent users."
  },
  {
    use_case: "Check someone before you meet, transact, or trust them in daily life",
    suggested_angle: "Know more before you say yes.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "The category rarely broadens into everyday trust decisions outside the usual lookup framing.",
    why_fund: "Specific decision moments can outperform broad generic messaging."
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
    use_case: "Contractor or in-home worker trust check for your own peace of mind",
    suggested_angle: "Before they enter your home, know a little more.",
    channels: ["google_ads", "meta_ads", "display"],
    why_it_is_white_space: "Homeowner trust is not a common direct-response angle in the category.",
    why_fund: "It maps to high perceived risk and clear trust intent."
  }
];

const ANGLE_GENERATOR_LIBRARY = [
  {
    idea_name: "Horse Buyer Confidence Check",
    marketing_hook: "Before you buy the horse, know more about the seller.",
    customer_problem: "Private horse buyers often make expensive decisions based on limited information and trust.",
    why_truthfinder_can_help: "Public-record context can help validate seller identity, location history, and basic trust signals before deposits or travel.",
    suggested_channels: ["meta_ads", "google_ads", "display"],
    test_format: "Niche landing page + interest-targeted social ads",
    why_test_this: "High-ticket hobby purchases run on trust and reputation. This is a non-obvious, emotionally relevant market."
  },
  {
    idea_name: "Wedding Invite Address Recovery",
    marketing_hook: "Trying to track down the right address before sending invitations?",
    customer_problem: "Couples planning weddings and major events often do not have up-to-date mailing addresses for extended friends and family.",
    why_truthfinder_can_help: "Public-record data can help locate or validate mailing and household information before sending expensive invitations.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Seasonal search campaign + event-planning landing page",
    why_test_this: "This reframes the product as a planning utility, not just a lookup tool, and reaches a very different audience."
  },
  {
    idea_name: "Reunion / Family Event Finder",
    marketing_hook: "Find the people you do not want to leave off the guest list.",
    customer_problem: "People organizing reunions, memorials, weddings, and milestone events often lose contact with important people over time.",
    why_truthfinder_can_help: "Public-record context can help reconnect organizers with old classmates, relatives, and lost contacts.",
    suggested_channels: ["meta_ads", "google_ads"],
    test_format: "Emotional story-led ads",
    why_test_this: "This brings reconnection into emotionally meaningful, milestone-driven use cases."
  },
  {
    idea_name: "Marketplace Big-Ticket Seller Check",
    marketing_hook: "Before you wire the money, know who you are dealing with.",
    customer_problem: "Consumers buying cars, trailers, RVs, tractors, or other high-value goods from private sellers face high fraud risk.",
    why_truthfinder_can_help: "Public-record data can provide identity and location context before a buyer sends money or drives long distance.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Search campaign around high-risk private transactions",
    why_test_this: "This pushes the brand into fraud-prevention and private commerce trust, which are larger than classic people-search framing."
  },
  {
    idea_name: "Contractor Before-They-Enter Check",
    marketing_hook: "Before they enter your home, know a little more.",
    customer_problem: "Homeowners often hire contractors, handymen, or repair workers based on limited information.",
    why_truthfinder_can_help: "Public-record context can help create more confidence before allowing someone into the home or giving them access to family property.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Homeowner-focused landing page + search intent test",
    why_test_this: "Home trust is a major emotional driver and is not clearly owned by the category."
  },
  {
    idea_name: "Job Search Self-Audit",
    marketing_hook: "See what others could find about you before they do.",
    customer_problem: "People applying for jobs may worry about what others can find about them online or through public sources.",
    why_truthfinder_can_help: "Public-record visibility can help users understand what may shape first impressions.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Self-audit landing page + search/social test",
    why_test_this: "This expands the product from searching others into self-awareness and reputation intelligence, while staying framed as a self-use case."
  },
  {
    idea_name: "Dating App Trust Layer",
    marketing_hook: "Before the first date, know a little more.",
    customer_problem: "Online dating creates uncertainty around whether someone is who they say they are.",
    why_truthfinder_can_help: "Public-record context can help validate identity and provide more confidence before an in-person meeting.",
    suggested_channels: ["meta_ads", "tiktok_ads", "display"],
    test_format: "Scenario-led short-form video",
    why_test_this: "This is emotionally strong, easy to understand, and highly social-friendly."
  },
  {
    idea_name: "Teen Safety / Parent Reassurance",
    marketing_hook: "Know more before your family says yes.",
    customer_problem: "Parents worry about who their teens are dating, meeting, or spending time with.",
    why_truthfinder_can_help: "Public-record context can provide more confidence before a parent makes a trust call.",
    suggested_channels: ["meta_ads", "display"],
    test_format: "Emotion-led parental concern creative",
    why_test_this: "This is high-emotion, family-first, and underused in the category."
  },
  {
    idea_name: "Elder Scam Defense",
    marketing_hook: "Help protect the people you love from the people you do not know.",
    customer_problem: "Older family members are often vulnerable to unknown callers, suspicious contacts, and fraud attempts.",
    why_truthfinder_can_help: "Identity and contact lookups can reduce uncertainty before damage is done.",
    suggested_channels: ["meta_ads", "google_ads", "display"],
    test_format: "Family-protection campaign",
    why_test_this: "This is a major social problem with strong emotional urgency."
  },
  {
    idea_name: "Private Seller Confidence for Rural Buyers",
    marketing_hook: "Before you drive hours or send a deposit, know who you are dealing with.",
    customer_problem: "Rural and enthusiast buyers often buy animals, equipment, trailers, and vehicles from private sellers they do not know.",
    why_truthfinder_can_help: "Identity and location context can reduce risk before travel, deposits, or pickup arrangements.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Niche enthusiast landing pages",
    why_test_this: "This is a white-space trust problem with high financial stakes."
  },
  {
    idea_name: "Move-In Area Confidence",
    marketing_hook: "Before you sign, know more about where you are moving.",
    customer_problem: "People moving to a new neighborhood often feel blind about the people and context around them.",
    why_truthfinder_can_help: "Address, resident, and neighborhood context can reduce uncertainty before a move.",
    suggested_channels: ["google_ads", "meta_ads", "display"],
    test_format: "Moving / relocation landing page",
    why_test_this: "This is a life-event use case with high emotional weight and strong intent."
  },
  {
    idea_name: "Guest List Recovery for Major Life Events",
    marketing_hook: "Do not leave the right people off the list just because you lost touch.",
    customer_problem: "People planning weddings, funerals, reunions, and milestone celebrations often lose contact info for important people.",
    why_truthfinder_can_help: "Public-record-based locating can help reconnect hosts and planners with the people they want to include.",
    suggested_channels: ["meta_ads", "google_ads"],
    test_format: "Milestone-event landing page and search campaigns",
    why_test_this: "This reaches a very different emotional use case and broadens the brand’s functional identity."
  }
];

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

      const resp = await fetchWithTimeout(url.toString());
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

function estimatePortfolioSimilarity(domain, portfolioCompetitors, keywordClusters, competition) {
  return portfolioCompetitors
    .map((competitor) => {
      const samePeoplePattern = competitor.includes("people") && domain.includes("people");

      let similarity = 25;
      similarity += Math.round((competition.overlap_score || 0) * 0.35);

      if (samePeoplePattern) similarity += 12;
      if (competitor.includes("cloaked") && keywordClusters.some((k) => k.intent_type === "privacy_adjacent")) {
        similarity += 10;
      }
      if (competitor.includes("whitepages") && keywordClusters.some((k) => k.cluster === "people search")) {
        similarity += 8;
      }
      if (competitor === domain) similarity = 100;

      similarity = Math.min(100, similarity);

      let reason = "Moderate thematic overlap.";
      if (similarity >= 75) reason = "Strong likely overlap in audience, problems, or auction themes.";
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

function buildAngleGenerator(keywordClusters, creativeAngles, whitespaceUseCases, competition) {
  const ideas = [...ANGLE_GENERATOR_LIBRARY];

  const topKeyword = keywordClusters[0];
  if (topKeyword) {
    ideas.push({
      idea_name: `Own the sharper version of ${topKeyword.cluster}`,
      marketing_hook: `The smarter way to handle ${topKeyword.cluster}.`,
      customer_problem: `Users searching for ${topKeyword.cluster} often want a faster, clearer, and more confidence-building answer.`,
      why_truthfinder_can_help: `Public-record context already has strong relevance for ${topKeyword.cluster} and can support a more concrete problem-solution flow.`,
      suggested_channels: topKeyword.recommended_channels || ["google_ads"],
      test_format: "Dedicated campaign + use-case landing page",
      why_test_this: "This ties directly to a high-opportunity cluster already surfaced by the model."
    });
  }

  const privacyAngle = creativeAngles.find((a) => a.angle === "Privacy / control my data");
  if (privacyAngle) {
    ideas.push({
      idea_name: "Public Record Footprint Awareness",
      marketing_hook: "Know what your public footprint may be saying about you.",
      customer_problem: "Users may not realize how much public-record context exists around them.",
      why_truthfinder_can_help: "Public-record data turns vague exposure anxiety into a visible and understandable problem.",
      suggested_channels: privacyAngle.best_channels || ["meta_ads", "google_ads"],
      test_format: "Awareness-driven landing page + social creative",
      why_test_this: "This bridges classic people-search utility with privacy positioning."
    });
  }

  const safetyAngle = creativeAngles.find((a) => a.angle === "Safety / protect myself");
  if (safetyAngle) {
    ideas.push({
      idea_name: "Trust Before Transaction",
      marketing_hook: "Before you say yes, know more.",
      customer_problem: "Consumers make fast trust decisions in dating, marketplaces, home services, and private transactions with limited context.",
      why_truthfinder_can_help: "Public-record data can act as a general trust-check layer before money, time, or physical safety are on the line.",
      suggested_channels: safetyAngle.best_channels || ["meta_ads", "google_ads"],
      test_format: "Cross-use-case landing page + ad set family",
      why_test_this: "This could become a broad umbrella framing for many use cases outside the standard category."
    });
  }

  if (competition?.competitor_type && competition.competitor_type !== "Direct") {
    ideas.push({
      idea_name: "Privacy-to-Lookup Bridge",
      marketing_hook: "Not just privacy. Know what’s actually out there.",
      customer_problem: "Privacy-aware users may want more than removal or masking. They may want understanding and context.",
      why_truthfinder_can_help: "Public-record context can serve as the 'understand first' step before users decide what to remove, protect, or investigate.",
      suggested_channels: ["google_ads", "meta_ads", "display"],
      test_format: "Bridge-message campaign",
      why_test_this: "This can help the product compete upstream against privacy brands without pretending to be the same product."
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
      why_test_this: item.why_fund
    });
  }

  return filterOutFcraSensitiveIdeas(ideas).slice(0, 20);
}

function buildSummary(domain, scores, keywordClusters, detectedAngles) {
  const topClusters = keywordClusters.slice(0, 3).map((k) => k.cluster);
  const topAngles = detectedAngles.filter((a) => a.detected).slice(0, 2).map((a) => a.angle);

  return `${domain} shows ${scores.pressure_band.toLowerCase()} competitive pressure with the biggest opportunities centered on ${topClusters.join(", ") || "core lookup intent"}. The most visible creative angles are ${topAngles.join(", ").toLowerCase() || "not strongly differentiated"}, creating room to compete on sharper segmentation, privacy-adjacent positioning, and new outside-the-box use-case messaging.`;
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
  const competitorName = domain
    .replace(".com", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const fullText = getFullText(scrape).toLowerCase();
  const clusterPresence = getClusterPresence(fullText, scrape);
  const keyword_clusters = buildKeywordClusters(clusterPresence, "the portfolio");
  const underutilized_keywords = buildUnderutilizedKeywords(clusterPresence, "the portfolio");
  const detectedAngles = detectCreativeAngles(fullText, scrape);
  const creative_angles = detectedAngles.slice(0, 8);
  const whitespace_use_cases = filterOutFcraSensitiveIdeas(buildWhitespaceUseCases());
  const scores = scoreModel(clusterPresence, detectedAngles, scrape);

  const competition_classification = classifyCompetition(fullText, clusterPresence, detectedAngles);
  const auction_overlap_estimator = buildAuctionOverlapEstimator(keyword_clusters, competition_classification);
  const search_term_alignment = buildSearchTermAlignment(searchTerms, keyword_clusters);
  const steal_their_traffic_engine = buildStealTheirTrafficEngine(
    keyword_clusters,
    detectedAngles,
    competition_classification
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
    competition_classification
  );

  const score_explanations = buildScoreExplanations(scores, clusterPresence, detectedAngles);
  const pressure_drivers = buildPressureDrivers(scores);
  const pressure_summary = buildPressureSummary(scores, pressure_drivers, "the portfolio");

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
    `Estimated auction overlap score: ${auction_overlap_estimator.auction_overlap_score}.`,
    `Search term alignment score: ${search_term_alignment.alignment_score}.`,
    `Portfolio competitors supplied: ${portfolioCompetitors.length}.`,
    `Estimated incremental sales across priority tests: ${opportunity_model.total_estimated_incremental_sales}.`
  ];

  const action_plan = [
    "Defend the highest-overlap demand themes with more specific segmentation and tighter landing-page matching.",
    "Launch at least one privacy-adjacent bridge campaign to compete with identity / privacy brands in the portfolio.",
    "Use search term alignment results to decide which existing terms are worth protecting or expanding.",
    "Run at least one steal-their-traffic play in search and one in paid social.",
    "Test 3 to 5 fresh generated hooks from the angle generator, not just competitor-derived themes.",
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
    summary: buildSummary(domain, scores, keyword_clusters, detectedAngles),

    portfolio_benchmark,
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
      `Portfolio benchmark competitors: ${portfolioCompetitors.join(", ")}`,
      `Analysis context: market=${market}, device=${device}`,
      `Benchmark assumptions: CTR=${assumptions.benchmark_ctr_pct}%, CVR=${assumptions.benchmark_cvr_pct}%, CPC=$${assumptions.benchmark_cpc}, monthly_impr=${assumptions.benchmark_monthly_impressions}`,
      searchTerms.length ? `Search terms supplied: ${searchTerms.length}` : "No search terms supplied.",
      analystQuestions ? `Analyst focus questions: ${analystQuestions}` : "No custom analyst questions supplied.",
      "FCRA-sensitive ideas and eligibility-style use cases were filtered out of generated outputs.",
      "No persistent storage is used; each analysis is generated fresh per request."
    ]
  };
}

export async function onRequestPost(context) {
  try {
    console.log("ANALYZE VERSION: full-self-contained-v1");
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
