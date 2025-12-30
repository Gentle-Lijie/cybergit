import { UserData, ProcessedLanguage, RepositoryNode, AnalysisResult, ContributionDay, TopicStat } from '../types';
import { Translations } from '../translations';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// --- MOCK DATA FOR DEMO ---
const generateMockCalendar = () => {
  const weeks = [];
  const today = new Date('2025-12-31'); 
  const startDay = new Date('2025-01-01');
  
  // Adjust start to previous Sunday
  const current = new Date(startDay);
  current.setDate(current.getDate() - current.getDay());

  while (current <= today || weeks.length < 53) {
    const contributionDays = [];
    for (let d = 0; d < 7; d++) {
       const loopDate = new Date(current);
       const isWeekend = d === 0 || d === 6;
       const base = isWeekend ? 0 : Math.random() * 10;
       const count = Math.floor(base + (Math.random() > 0.8 ? 20 : 0));
       
       contributionDays.push({
         contributionCount: count,
         date: loopDate.toISOString().split('T')[0],
         color: count > 10 ? '#216e39' : count > 5 ? '#30a14e' : count > 0 ? '#40c463' : '#ebedf0',
         weekday: d
       });
       current.setDate(current.getDate() + 1);
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
      { name: "Tyrell Corp", login: "tyrell", avatarUrl: "https://picsum.photos/id/1/50/50", websiteUrl: "https://tyrell.com" },
      { name: "Resistance", login: "resistance", avatarUrl: "https://picsum.photos/id/2/50/50", websiteUrl: null }
    ]
  },
  contributionsCollection: {
    totalCommitContributions: 3100,
    totalIssueContributions: 42,
    totalPullRequestContributions: 150,
    totalPullRequestReviewContributions: 999,
    totalRepositoriesWithContributedCommits: 12,
    contributionCalendar: generateMockCalendar(),
    commitContributionsByRepository: [
      {
        repository: { name: "neural-net-v1", isPrivate: false, primaryLanguage: { name: "Python", color: "#3572A5" } },
        contributions: {
          nodes: Array.from({ length: 20 }).map(() => ({ occurredAt: "2024-05-01T23:30:00Z", commitCount: 1 }))
        }
      }
    ],
    pullRequestContributions: {
      nodes: [
        ...Array.from({ length: 15 }).map(() => ({
          pullRequest: {
            title: "Fix entropy leak",
            state: "MERGED",
            createdAt: "2024-05-20T10:00:00Z",
            mergedAt: "2024-05-20T14:00:00Z", // 4 hours later
            additions: 150,
            deletions: 50,
            changedFiles: 3,
            repository: {
              name: "react-core-cyber",
              isPrivate: false,
              stargazerCount: 25000,
              primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
              owner: { login: "facebook", avatarUrl: "" },
              languages: { nodes: [{ name: "JavaScript", color: "#f1e05a" }] }
            }
          }
        })),
        ...Array.from({ length: 10 }).map(() => ({
          pullRequest: {
            title: "Update deps",
            state: "MERGED",
            createdAt: "2024-05-20T10:00:00Z",
            mergedAt: "2024-06-01T00:00:00Z",
            additions: 10,
            deletions: 10,
            changedFiles: 1,
            repository: {
              name: "my-personal-blog",
              isPrivate: false,
              stargazerCount: 5,
              primaryLanguage: { name: "TypeScript", color: "#3178c6" },
              owner: { login: "dev_runner", avatarUrl: "" },
              languages: { nodes: [{ name: "TypeScript", color: "#3178c6" }] }
            }
          }
        }))
      ]
    },
    pullRequestReviewContributions: {
      nodes: []
    }
  },
  repositories: {
    totalCount: 45,
    nodes: [
      {
        name: "peinture",
        url: "https://github.com/dev_runner/peinture",
        description: "AI Art Generator",
        isPrivate: false,
        stargazerCount: 422,
        forkCount: 194,
        pushedAt: "2024-11-20T00:00:00Z",
        diskUsage: 5000,
        owner: { login: "dev_runner" },
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        languages: {
          edges: [
            { size: 12000, node: { name: "TypeScript", color: "#3178c6" } },
            { size: 5000, node: { name: "Rust", color: "#dea584" } },
            { size: 2000, node: { name: "Python", color: "#3572A5" } },
            { size: 1000, node: { name: "Go", color: "#00ADD8" } },
          ]
        },
        repositoryTopics: { nodes: [{ topic: { name: "generative-ai" } }, { topic: { name: "art" } }] }
      },
      {
        name: "midjourney-prompt-generator",
        url: "https://github.com/dev_runner/midjourney-prompt-generator",
        description: "Prompt Engineering Tool",
        isPrivate: false,
        stargazerCount: 175,
        forkCount: 20,
        pushedAt: "2024-10-10T00:00:00Z",
        diskUsage: 2000,
        owner: { login: "dev_runner" },
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        languages: {
          edges: [
             { size: 8000, node: { name: "TypeScript", color: "#3178c6" } }
          ]
        },
        repositoryTopics: { nodes: [{ topic: { name: "prompt-engineering" } }] }
      }
    ]
  }
};

// --- QUERIES ---

// Shared Fragment for Data Consistency
const USER_DATA_FRAGMENT = `
    name
    login
    avatarUrl
    location
    createdAt
    followers {
      totalCount
    }
    # 1. Organizations
    organizations(first: 20) {
      nodes {
        name
        login
        avatarUrl
        websiteUrl
      }
    }
    # 2. Core Contributions
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      
      # 3. Calendar
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            color
            weekday
          }
        }
      }
      
      # 4. Commit Times
      commitContributionsByRepository(maxRepositories: 50) {
        repository {
          name
          isPrivate
          primaryLanguage {
             name
             color
          }
        }
        contributions(first: 100) {
          nodes {
            occurredAt
            commitCount
          }
        }
      }
      
      # 5. PR Analysis
      pullRequestContributions(first: 80, orderBy: {direction: DESC}) {
        nodes {
          pullRequest {
            title
            state
            createdAt
            mergedAt
            additions
            deletions
            changedFiles
            repository {
              name
              stargazerCount
              isPrivate
              owner {
                login
                avatarUrl
              }
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                  color
                }
              }
            }
          }
        }
      }
      
      # 6. Code Reviews
      pullRequestReviewContributions(first: 20) {
        nodes {
          pullRequest {
            title
            repository {
              name
              owner { login }
            }
          }
        }
      }
    }

    # 7. Repositories (Public + Private if Affiliations match)
    repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
      totalCount
      nodes {
        name
        url
        description
        isPrivate
        stargazerCount
        forkCount
        pushedAt
        diskUsage
        primaryLanguage {
          name
          color
        }
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
        repositoryTopics(first: 5) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
`;

const ANNUAL_REPORT_QUERY = `
query UserAnnualReport($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    ${USER_DATA_FRAGMENT}
  }
}
`;

// Viewer query specifically for fetching "MY" data (includes Private)
const VIEWER_REPORT_QUERY = `
query ViewerAnnualReport($from: DateTime!, $to: DateTime!) {
  viewer {
    ${USER_DATA_FRAGMENT}
  }
}
`;

// --- FETCH FUNCTION ---

export const fetchGitHubData = async (token: string, username?: string): Promise<UserData> => {
  if (token === 'demo') {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_DATA), 1500));
  }

  // Default to year 2025 (or current year)
  const currentYear = new Date().getFullYear();
  const from = `${currentYear}-01-01T00:00:00Z`;
  const to = `${currentYear}-12-31T23:59:59Z`;

  // IF no username is provided, we use the VIEWER query.
  // This is CRITICAL because querying 'viewer' allows access to private stats/repos 
  // that querying 'user(login: me)' might hide depending on token scope nuance.
  const isViewerQuery = !username || username.trim() === '';

  const query = isViewerQuery ? VIEWER_REPORT_QUERY : ANNUAL_REPORT_QUERY;
  const variables: any = { from, to };
  
  if (!isViewerQuery) {
    variables.login = username;
  }

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  // Normalize data (viewer vs user)
  const userData = isViewerQuery ? json.data.viewer : json.data.user;

  if (!userData) {
    throw new Error(`User ${username || 'authenticated user'} not found or accessible.`);
  }

  return userData;
};

// --- HELPERS ---

export const processLanguageData = (repositories: RepositoryNode[] | undefined | null): ProcessedLanguage[] => {
  const languageMap = new Map<string, { size: number; color: string }>();
  let totalSize = 0;

  if (!repositories || !Array.isArray(repositories)) {
    return [];
  }

  repositories.forEach(repo => {
    if (repo.languages && repo.languages.edges) {
        repo.languages.edges.forEach(edge => {
            const { name, color } = edge.node;
            const current = languageMap.get(name) || { size: 0, color };
            languageMap.set(name, { size: current.size + edge.size, color });
            totalSize += edge.size;
        });
    }
  });

  return Array.from(languageMap.entries())
    .map(([name, { size, color }]) => ({
      name,
      color,
      size,
      percentage: totalSize > 0 ? Math.round((size / totalSize) * 100) : 0,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
};

export const analyzeUserData = (data: UserData, t: Translations): AnalysisResult => {
  // Defensive checks for core objects
  const contributionCollection = (data.contributionsCollection || {}) as Partial<UserData['contributionsCollection']>;
  const repoNodes = data.repositories?.nodes || [];
  const orgNodes = data.organizations?.nodes || [];
  
  // --- Account Stats ---
  const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  const accountAgeYears = new Date().getFullYear() - createdAt.getFullYear();
  const followers = data.followers?.totalCount || 0;

  // --- Streak Calculation ---
  const days: ContributionDay[] = [];
  const calendarWeeks = contributionCollection.contributionCalendar?.weeks || [];
  
  calendarWeeks.forEach(week => {
    if (week.contributionDays) {
        days.push(...week.contributionDays);
    }
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
  // Simple check from end of array backwards for current streak
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      activeCurrent++;
    } else {
      if (i === days.length - 1) continue; 
      break;
    }
  }

  // --- Habits (Time Analysis) ---
  const hoursMap = new Array(24).fill(0);
  let weekendCommits = 0;
  let totalSampledCommits = 0;
  
  // Use Repositories list for stars to ensure accuracy
  let maxStarsSeen = -1;
  let hottestProjectName = "Unknown";
  let totalDiskUsage = 0;
  let privateRepoCount = 0;

  repoNodes.forEach(repo => {
    totalDiskUsage += (repo.diskUsage || 0);
    if (repo.isPrivate) privateRepoCount++;
    if ((repo.stargazerCount || 0) > maxStarsSeen) {
        maxStarsSeen = repo.stargazerCount;
        hottestProjectName = repo.name;
    }
  });
  
  const topReposList = [...repoNodes]
    .sort((a, b) => (b.stargazerCount || 0) - (a.stargazerCount || 0))
    .slice(0, 3);

  const totalRepos = data.repositories?.totalCount || repoNodes.length;
  const avgRepoSize = totalRepos > 0 ? Math.round(totalDiskUsage / totalRepos) : 0;
  const privateRepoRatio = totalRepos > 0 ? privateRepoCount / totalRepos : 0;

  // --- Time Distribution ---
  const commitContributions = contributionCollection.commitContributionsByRepository || [];
  commitContributions.forEach(repoContrib => {
    if (repoContrib.contributions && repoContrib.contributions.nodes) {
        repoContrib.contributions.nodes.forEach(commit => {
            totalSampledCommits += (commit.commitCount || 1);
            const date = new Date(commit.occurredAt);
            const hour = date.getHours();
            const day = date.getDay();
            hoursMap[hour] += (commit.commitCount || 1);
            if (day === 0 || day === 6) weekendCommits += (commit.commitCount || 1);
        });
    }
  });

  // Calculate Time Categories
  const nightOwlCount = hoursMap.slice(0, 6).reduce((a, b) => a + b, 0); 
  const morningLarkCount = hoursMap.slice(6, 12).reduce((a, b) => a + b, 0); 
  const afternoonCount = hoursMap.slice(12, 18).reduce((a, b) => a + b, 0); 
  const eveningCount = hoursMap.slice(18, 24).reduce((a, b) => a + b, 0); 

  let timeCategory = t.habits.categories.balanced;
  let timeDescription = t.habits.descriptions.balanced;

  const categories = [
    { id: 'night', count: nightOwlCount, label: t.habits.categories.night, desc: t.habits.descriptions.night },
    { id: 'morning', count: morningLarkCount, label: t.habits.categories.morning, desc: t.habits.descriptions.morning },
    { id: 'afternoon', count: afternoonCount, label: t.habits.categories.afternoon, desc: t.habits.descriptions.afternoon },
    { id: 'evening', count: eveningCount, label: t.habits.categories.evening, desc: t.habits.descriptions.evening }
  ];
  
  const maxCategory = categories.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  if (totalSampledCommits > 0 && maxCategory.count / totalSampledCommits > 0.4) {
    timeCategory = maxCategory.label;
    timeDescription = maxCategory.desc;
  }

  const topHour = hoursMap.indexOf(Math.max(...hoursMap));
  const isNightOwl = (nightOwlCount / (totalSampledCommits || 1)) > 0.25; 
  const isWeekendWarrior = (weekendCommits / (totalSampledCommits || 1)) > 0.35; 
  const weekendPercentage = totalSampledCommits > 0 ? Math.round((weekendCommits / totalSampledCommits) * 100) : 0;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = new Array(7).fill(0);
  days.forEach(d => {
    dayCounts[d.weekday] += d.contributionCount;
  });
  const busiestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));


  // --- PR & Deep Code Analysis ---
  let totalAdditions = 0;
  let totalDeletions = 0;
  let totalFilesChanged = 0;
  let mergedPrCount = 0;
  let totalMergeTimeMs = 0;
  let totalAnalyzedPrs = 0;
  
  const prNodes = contributionCollection.pullRequestContributions?.nodes || [];
  
  prNodes.forEach(node => {
     const pr = node.pullRequest;
     if (!pr) return;

     totalAnalyzedPrs++;
     totalAdditions += (pr.additions || 0);
     totalDeletions += (pr.deletions || 0);
     totalFilesChanged += (pr.changedFiles || 0);
     
     if (pr.state === 'MERGED' && pr.mergedAt) {
       mergedPrCount++;
       const created = new Date(pr.createdAt).getTime();
       const merged = new Date(pr.mergedAt).getTime();
       totalMergeTimeMs += (merged - created);
     }
  });

  const refactorRatio = totalAdditions > 0 ? totalDeletions / totalAdditions : 0;
  const avgPrSize = totalAnalyzedPrs > 0 ? Math.round((totalAdditions + totalDeletions) / totalAnalyzedPrs) : 0;
  const avgPrFiles = totalAnalyzedPrs > 0 ? parseFloat((totalFilesChanged / totalAnalyzedPrs).toFixed(1)) : 0;
  const prMergeRate = totalAnalyzedPrs > 0 ? Math.round((mergedPrCount / totalAnalyzedPrs) * 100) : 0;
  const avgMergeTimeHours = mergedPrCount > 0 ? Math.round((totalMergeTimeMs / mergedPrCount) / (1000 * 60 * 60)) : 0;


  // --- Influence & Topics ---
  let totalStars = 0;
  let totalForks = 0;
  const allTopics = new Map<string, number>();

  repoNodes.forEach(repo => {
    totalStars += (repo.stargazerCount || 0);
    totalForks += (repo.forkCount || 0);
    if (repo.repositoryTopics && repo.repositoryTopics.nodes) {
        repo.repositoryTopics.nodes.forEach(t => {
            if (t.topic && t.topic.name) {
                allTopics.set(t.topic.name, (allTopics.get(t.topic.name) || 0) + 1);
            }
        });
    }
  });

  const topTopics: TopicStat[] = Array.from(allTopics.entries())
    .sort((a,b) => b[1] - a[1])
    .slice(0, 15) // Increased limit for cloud
    .map(([name, count]) => ({ name, count }));

  // --- Community & Classification Analysis ---
  let openSourcePRs = 0;
  let orgPRs = 0;
  let personalPRs = 0;
  
  let impactRepo = null;
  let maxImpactStars = -1;

  const orgCounts = new Map<string, { count: number, avatarUrl: string }>();

  prNodes.forEach(node => {
    const pr = node.pullRequest;
    if (!pr || !pr.repository || !pr.repository.owner) return;
    
    const repo = pr.repository;
    const ownerLogin = repo.owner.login;
    const isOwnerMe = ownerLogin === data.login;
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

    if (isOwnerMe) {
      personalPRs++;
    } else {
      if (!isPrivate) openSourcePRs++;
      const current = orgCounts.get(ownerLogin) || { count: 0, avatarUrl: repo.owner.avatarUrl || '' }; 
      orgCounts.set(ownerLogin, { count: current.count + 1, avatarUrl: repo.owner.avatarUrl || '' });
    }
  });
  
  orgPRs = openSourcePRs; 

  // Determine Top Organization
  let topOrganization = null;
  let maxOrgCount = 0;
  
  orgCounts.forEach((val, key) => {
    if (val.count > maxOrgCount) {
      maxOrgCount = val.count;
      topOrganization = { name: key, count: val.count, avatarUrl: val.avatarUrl };
    }
  });

  if (!topOrganization && orgNodes.length > 0) {
    topOrganization = { 
      name: orgNodes[0].name || orgNodes[0].login, 
      count: 0, 
      avatarUrl: orgNodes[0].avatarUrl 
    };
  }

  // Breakdown
  const breakdown = {
    commits: contributionCollection.totalCommitContributions || 0,
    issues: contributionCollection.totalIssueContributions || 0,
    prs: contributionCollection.totalPullRequestContributions || 0,
    reviews: contributionCollection.totalPullRequestReviewContributions || 0
  };

  return {
    accountAgeYears,
    followers,
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
    weekendPercentage,
    totalAdditions,
    totalDeletions,
    refactorRatio,
    avgPrSize,
    avgPrFiles,
    prMergeRate,
    avgMergeTimeHours,
    breakdown,
    hottestProject: hottestProjectName,
    totalStars,
    totalForks,
    avgRepoSize,
    privateRepoRatio,
    openSourcePRs,
    orgPRs,
    personalPRs,
    impactRepo,
    topOrganization,
    topTopics,
    topReposList
  };
};