
import { UserData, ProcessedLanguage, RepositoryNode, AnalysisResult, ContributionDay } from '../types';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// --- MOCK DATA FOR DEMO ---
// Helper to generate a year of dates
const generateMockCalendar = () => {
  const weeks = [];
  // Ensure we cover 2025 for the demo to work with the filter
  const today = new Date('2025-12-31'); 
  const oneYearAgo = new Date('2025-01-01');
  
  // Start from Sunday of the week containing oneYearAgo
  const startDay = new Date(oneYearAgo);
  startDay.setDate(startDay.getDate() - startDay.getDay());

  for (let w = 0; w < 53; w++) {
    const contributionDays = [];
    for (let d = 0; d < 7; d++) {
       const currentDate = new Date(startDay);
       currentDate.setDate(startDay.getDate() + (w * 7) + d);
       
       const isWeekend = d === 0 || d === 6;
       const base = isWeekend ? 0 : Math.random() * 10;
       const count = Math.floor(base + (Math.random() > 0.8 ? 20 : 0));
       
       contributionDays.push({
         contributionCount: count,
         date: currentDate.toISOString().split('T')[0],
         color: count > 10 ? '#216e39' : count > 5 ? '#30a14e' : count > 0 ? '#40c463' : '#ebedf0'
       });
    }
    weeks.push({ contributionDays });
  }
  return {
    totalContributions: 4291,
    weeks
  };
};

const MOCK_DATA: UserData = {
  name: "CyberRunner_2077",
  login: "dev_runner",
  avatarUrl: "https://picsum.photos/200/200",
  location: "Neo-Tokyo, Sector 7",
  createdAt: "2013-11-07T00:00:00Z",
  followers: { totalCount: 1337 },
  organizations: {
    nodes: [
      { name: "Tyrell Corp", login: "tyrell", avatarUrl: "https://picsum.photos/id/1/50/50" },
      { name: "Resistance", login: "resistance", avatarUrl: "https://picsum.photos/id/2/50/50" }
    ]
  },
  contributionsCollection: {
    totalCommitContributions: 3100,
    totalIssueContributions: 42,
    totalPullRequestContributions: 150,
    totalPullRequestReviewContributions: 999,
    contributionCalendar: generateMockCalendar(),
    commitContributionsByRepository: [
      {
        repository: { name: "neural-net-v1", stargazerCount: 1200 },
        contributions: {
          nodes: Array.from({ length: 20 }).map(() => ({ occurredAt: "2025-05-01T23:30:00Z" }))
        }
      }
    ],
    pullRequestContributions: {
      nodes: [
        ...Array.from({ length: 15 }).map(() => ({
          pullRequest: {
            title: "Fix entropy leak",
            state: "MERGED",
            mergedAt: "2024-06-01T00:00:00Z",
            repository: {
              name: "react-core-cyber",
              isPrivate: false,
              stargazerCount: 25000,
              owner: { login: "facebook", __typename: "Organization" }
            }
          }
        })),
        ...Array.from({ length: 10 }).map(() => ({
          pullRequest: {
            title: "Update deps",
            state: "MERGED",
            mergedAt: "2024-06-01T00:00:00Z",
            repository: {
              name: "my-personal-blog",
              isPrivate: false,
              stargazerCount: 5,
              owner: { login: "dev_runner", __typename: "User" }
            }
          }
        }))
      ]
    }
  },
  repositories: {
    totalCount: 45,
    nodes: [
      {
        name: "peinture",
        stargazerCount: 422,
        forkCount: 194,
        languages: {
          edges: [
            { size: 12000, node: { name: "TypeScript", color: "#3178c6" } },
            { size: 5000, node: { name: "Rust", color: "#dea584" } },
            { size: 2000, node: { name: "Python", color: "#3572A5" } },
            { size: 1000, node: { name: "Go", color: "#00ADD8" } },
          ]
        }
      },
      {
        name: "midjourney-prompt-generator",
        stargazerCount: 175,
        forkCount: 20,
        languages: {
          edges: [
             { size: 8000, node: { name: "TypeScript", color: "#3178c6" } }
          ]
        }
      },
      {
        name: "deep-research",
        stargazerCount: 50,
        forkCount: 5,
        languages: {
          edges: [
             { size: 2000, node: { name: "Smarty", color: "#f0c040" } }
          ]
        }
      }
    ]
  },
  pullRequests: {
    nodes: Array.from({ length: 50 }).map(() => ({
      additions: Math.floor(Math.random() * 500),
      deletions: Math.floor(Math.random() * 600)
    }))
  }
};

// --- QUERIES ---

const FRAGMENT_USER_DATA = `
  name
  login
  avatarUrl
  location
  createdAt
  followers {
    totalCount
  }
  organizations(first: 10) {
    nodes {
      name
      login
      avatarUrl
    }
  }
  contributionsCollection {
    contributionCalendar {
      totalContributions
      weeks {
        contributionDays {
          contributionCount
          date
          color
        }
      }
    }
    totalCommitContributions
    totalIssueContributions
    totalPullRequestContributions
    totalPullRequestReviewContributions
    commitContributionsByRepository(maxRepositories: 10) {
      repository {
        name
        stargazerCount
      }
      contributions(first: 20) {
        nodes {
          occurredAt
        }
      }
    }
    pullRequestContributions(first: 50, orderBy: {direction: DESC}) {
      nodes {
        pullRequest {
          title
          state
          mergedAt
          repository {
            name
            isPrivate
            stargazerCount
            owner {
              login
              __typename
            }
          }
        }
      }
    }
  }
  repositories(first: 50, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER, privacy: PUBLIC) {
    totalCount
    nodes {
      name
      stargazerCount
      forkCount
      languages(first: 5) {
        edges {
          size
          node {
            name
            color
          }
        }
      }
    }
  }
  pullRequests(first: 50, states: MERGED, orderBy: {field: CREATED_AT, direction: DESC}) {
    nodes {
      additions
      deletions
    }
  }
`;

const USER_QUERY = `
  query($login: String!) {
    user(login: $login) {
      ${FRAGMENT_USER_DATA}
    }
  }
`;

const VIEWER_QUERY = `
  query {
    viewer {
      ${FRAGMENT_USER_DATA}
    }
  }
`;

// --- FETCH FUNCTION ---

export const fetchGitHubData = async (token: string, username?: string): Promise<UserData> => {
  if (token === 'demo') {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_DATA), 1500));
  }

  const query = username ? USER_QUERY : VIEWER_QUERY;
  const variables = username ? { login: username } : {};

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return username ? json.data.user : json.data.viewer;
};

// --- HELPERS ---

export const processLanguageData = (repositories: RepositoryNode[]): ProcessedLanguage[] => {
  const languageMap = new Map<string, { size: number; color: string }>();
  let totalSize = 0;

  repositories.forEach(repo => {
    repo.languages.edges.forEach(edge => {
      const { name, color } = edge.node;
      const current = languageMap.get(name) || { size: 0, color };
      languageMap.set(name, { size: current.size + edge.size, color });
      totalSize += edge.size;
    });
  });

  return Array.from(languageMap.entries())
    .map(([name, { size, color }]) => ({
      name,
      color,
      size,
      percentage: Math.round((size / totalSize) * 100),
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10); // Expanded to 10 to allow for tags
};

export const analyzeUserData = (data: UserData): AnalysisResult => {
  // 1. Streak Calculation (Existing)
  const days: ContributionDay[] = [];
  data.contributionsCollection.contributionCalendar.weeks.forEach(week => {
    days.push(...week.contributionDays);
  });
  
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  days.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 0;
    }
  });
  maxStreak = Math.max(maxStreak, tempStreak);

  let activeCurrent = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      activeCurrent++;
    } else {
      if (i === days.length - 1) continue; 
      break;
    }
  }

  // 2. Habits (Detailed Chronotype Analysis)
  const hoursMap = new Array(24).fill(0);
  let weekendCommits = 0;
  let totalSampledCommits = 0;
  let hottestProjectName = "Unknown";
  let maxStarsSeen = -1;

  data.contributionsCollection.commitContributionsByRepository.forEach(repoContrib => {
    if (repoContrib.repository.stargazerCount > maxStarsSeen) {
      maxStarsSeen = repoContrib.repository.stargazerCount;
      hottestProjectName = repoContrib.repository.name;
    }
    repoContrib.contributions.nodes.forEach(commit => {
      totalSampledCommits++;
      const date = new Date(commit.occurredAt);
      const hour = date.getHours();
      const day = date.getDay();
      hoursMap[hour]++;
      if (day === 0 || day === 6) weekendCommits++;
    });
  });

  // Calculate Time Categories
  const nightOwlCount = hoursMap.slice(0, 6).reduce((a, b) => a + b, 0); // 00:00 - 05:59
  const morningLarkCount = hoursMap.slice(6, 12).reduce((a, b) => a + b, 0); // 06:00 - 11:59
  const afternoonCount = hoursMap.slice(12, 18).reduce((a, b) => a + b, 0); // 12:00 - 17:59
  const eveningCount = hoursMap.slice(18, 24).reduce((a, b) => a + b, 0); // 18:00 - 23:59

  let timeCategory = "Balanced Coder";
  let timeDescription = "Activity distributed throughout the day.";

  const categories = [
    { id: 'night', count: nightOwlCount, label: "Night Owl", desc: "Most productive during late hours." },
    { id: 'morning', count: morningLarkCount, label: "Early Bird", desc: "Starts the day with code." },
    { id: 'afternoon', count: afternoonCount, label: "9-to-5 Pro", desc: "Consistent business hours output." },
    { id: 'evening', count: eveningCount, label: "Evening Grinder", desc: "Codes after the day job." }
  ];
  
  // Find the max category
  const maxCategory = categories.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  // Threshold: Determine if it's a strong preference or balanced
  if (totalSampledCommits > 0 && maxCategory.count / totalSampledCommits > 0.4) {
    timeCategory = maxCategory.label;
    timeDescription = maxCategory.desc;
  }

  const topHour = hoursMap.indexOf(Math.max(...hoursMap));
  const isNightOwl = (nightOwlCount / (totalSampledCommits || 1)) > 0.25; // Adjusted threshold
  const isWeekendWarrior = (weekendCommits / (totalSampledCommits || 1)) > 0.35; // Adjusted threshold

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = new Array(7).fill(0);
  days.forEach(d => {
    const dayIndex = new Date(d.date).getDay();
    dayCounts[dayIndex] += d.contributionCount;
  });
  const busiestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));


  // 3. PR Code Style (Existing)
  let totalAdditions = 0;
  let totalDeletions = 0;
  data.pullRequests.nodes.forEach(pr => {
    totalAdditions += pr.additions;
    totalDeletions += pr.deletions;
  });
  const refactorRatio = totalAdditions > 0 ? totalDeletions / totalAdditions : 0;

  // 4. Influence (Existing)
  let totalStars = 0;
  let totalForks = 0;
  data.repositories.nodes.forEach(repo => {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
  });

  // 5. NEW: Community & Classification Analysis
  let openSourcePRs = 0;
  let orgPRs = 0;
  let personalPRs = 0;
  
  let impactRepo = null;
  let maxImpactStars = -1;

  const orgCounts = new Map<string, { count: number, avatarUrl: string }>();

  // Process Pull Request Contributions
  const prContribs = data.contributionsCollection.pullRequestContributions.nodes || [];
  
  prContribs.forEach(node => {
    const repo = node.pullRequest.repository;
    const ownerLogin = repo.owner.login;
    const isOwnerMe = ownerLogin === data.login;
    const isOrg = repo.owner.__typename === 'Organization';
    const isPrivate = repo.isPrivate;

    // Check Impact Star (External High Star Repo)
    if (!isOwnerMe && !isPrivate && repo.stargazerCount > maxImpactStars) {
      maxImpactStars = repo.stargazerCount;
      impactRepo = {
        name: repo.name,
        owner: ownerLogin,
        stars: repo.stargazerCount
      };
    }

    // Classification
    if (isOwnerMe) {
      personalPRs++;
    } else {
      // It's external
      if (!isPrivate) {
        openSourcePRs++;
      }
      if (isOrg) {
        orgPRs++;
        // Track Top Org
        const current = orgCounts.get(ownerLogin) || { count: 0, avatarUrl: '' }; // Avatar URL not in this query, handled in component or extended query if needed. using User avatar logic isn't perfect here but acceptable for counts.
        orgCounts.set(ownerLogin, { count: current.count + 1, avatarUrl: '' });
      }
    }
  });

  // Determine Top Organization
  let topOrganization = null;
  let maxOrgCount = 0;
  
  // Also check direct organization memberships if no contributions found? 
  // For now, based on contributions.
  orgCounts.forEach((val, key) => {
    if (val.count > maxOrgCount) {
      maxOrgCount = val.count;
      topOrganization = { name: key, count: val.count, avatarUrl: val.avatarUrl };
    }
  });

  // Fallback: If no PRs to orgs, pick the first org they are member of
  if (!topOrganization && data.organizations.nodes.length > 0) {
    topOrganization = { 
      name: data.organizations.nodes[0].name || data.organizations.nodes[0].login, 
      count: 0, 
      avatarUrl: data.organizations.nodes[0].avatarUrl 
    };
  }

  return {
    longestStreak: maxStreak,
    currentStreak: activeCurrent,
    busiestDay: daysOfWeek[busiestDayIndex],
    topHour,
    hoursDistribution: hoursMap,
    timeCategory,
    timeDescription,
    periodBreakdown: {
      night: nightOwlCount,
      morning: morningLarkCount,
      afternoon: afternoonCount,
      evening: eveningCount
    },
    isNightOwl,
    isWeekendWarrior,
    totalAdditions,
    totalDeletions,
    refactorRatio,
    hottestProject: hottestProjectName,
    totalStars,
    totalForks,
    // New fields
    openSourcePRs,
    orgPRs,
    personalPRs,
    impactRepo,
    topOrganization
  };
};
