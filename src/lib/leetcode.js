// API layer for the /leetcode dashboard.
//
// Primary source : LeetCode GraphQL (richest data, but its CORS policy blocks
//                  browsers on other origins, so in practice it succeeds only
//                  where same-origin/proxy rules allow it).
// Fallbacks      : public CORS-enabled mirrors of the same stats, tried in
//                  order. (The old leetcode-stats-api.herokuapp.com is dead.)
//
// Every source is normalised to one shape so the UI layer never cares where
// the data came from:
// {
//   source, username, ranking, avatar,
//   total: { solved, questions },
//   easy / medium / hard: { solved, total },
//   submissions, activeDays, streak,
//   calendar: { [epochDaySeconds]: count }
// }

const GRAPHQL_URL = "https://leetcode.com/graphql";

const GRAPHQL_QUERY = `
query userDashboard($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking userAvatar }
    submitStats {
      acSubmissionNum { difficulty count }
      totalSubmissionNum { difficulty count submissions }
    }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
  allQuestionsCount { difficulty count }
}`;

const FALLBACK_URLS = [
    (u) => `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(u)}`,
    (u) => `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(u)}`,
];

const DAY = 86400;

function fetchWithTimeout(url, options = {}, ms = 8000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...options, signal: ctrl.signal }).finally(() =>
        clearTimeout(timer)
    );
}

// current streak of consecutive submission days, walking back from today (UTC)
export function computeStreak(calendar) {
    if (!calendar) return 0;
    let d = Math.floor(Date.now() / 1000 / DAY) * DAY;
    let streak = 0;
    if (!calendar[d]) d -= DAY; // no submission yet today doesn't break the run
    while (calendar[d] > 0) {
        streak++;
        d -= DAY;
    }
    return streak;
}

function pick(list, difficulty, field = "count") {
    return list?.find((x) => x.difficulty === difficulty)?.[field] ?? 0;
}

async function fromGraphql(username) {
    const res = await fetchWithTimeout(
        GRAPHQL_URL,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: GRAPHQL_QUERY,
                variables: { username },
            }),
        },
        6000
    );
    if (!res.ok) throw new Error(`graphql http ${res.status}`);
    const { data } = await res.json();
    const user = data?.matchedUser;
    if (!user) throw new Error("user not found");

    const ac = user.submitStats?.acSubmissionNum;
    const all = data.allQuestionsCount;
    const calendar = JSON.parse(user.userCalendar?.submissionCalendar || "{}");

    return {
        source: "leetcode graphql",
        username: user.username,
        ranking: user.profile?.ranking ?? null,
        avatar: user.profile?.userAvatar ?? null,
        total: { solved: pick(ac, "All"), questions: pick(all, "All") },
        easy: { solved: pick(ac, "Easy"), total: pick(all, "Easy") },
        medium: { solved: pick(ac, "Medium"), total: pick(all, "Medium") },
        hard: { solved: pick(ac, "Hard"), total: pick(all, "Hard") },
        submissions: pick(user.submitStats?.totalSubmissionNum, "All", "submissions"),
        activeDays: user.userCalendar?.totalActiveDays ?? Object.keys(calendar).length,
        streak: user.userCalendar?.streak ?? computeStreak(calendar),
        calendar,
    };
}

async function fromFallback(url, username, timeoutMs) {
    const res = await fetchWithTimeout(url, {}, timeoutMs);
    if (!res.ok) throw new Error(`fallback http ${res.status}`);
    const d = await res.json();
    if (d.errors || d.totalSolved === undefined) throw new Error("bad payload");
    const calendar = d.submissionCalendar || {};

    return {
        source: new URL(url).hostname,
        username,
        ranking: d.ranking ?? null,
        avatar: null, // the stats mirrors don't expose the avatar
        total: { solved: d.totalSolved, questions: d.totalQuestions },
        easy: { solved: d.easySolved, total: d.totalEasy },
        medium: { solved: d.mediumSolved, total: d.totalMedium },
        hard: { solved: d.hardSolved, total: d.totalHard },
        submissions: pick(d.totalSubmissions, "All", "submissions"),
        activeDays: Object.keys(calendar).length,
        streak: computeStreak(calendar),
        calendar,
    };
}

export default async function fetchLeetCodeStats(username) {
    const errors = [];

    try {
        return await fromGraphql(username);
    } catch (e) {
        errors.push(`graphql: ${e.message}`);
    }

    for (const buildUrl of FALLBACK_URLS) {
        const url = buildUrl(username);
        try {
            // onrender free tier cold-starts slowly; give the last resort longer
            return await fromFallback(url, username, url.includes("onrender") ? 25000 : 9000);
        } catch (e) {
            errors.push(`${new URL(url).hostname}: ${e.message}`);
        }
    }

    throw new Error(errors.join(" | "));
}
