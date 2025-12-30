
export type Language = 'en' | 'zh';

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
  weekday: number;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

export interface LanguageNode {
  name: string;
  color: string;
}

export interface LanguageEdge {
  size: number;
  node: LanguageNode;
}

export interface RepositoryTopic {
  topic: {
    name: string;
  };
}

export interface RepositoryNode {
  name: string;
  url: string;
  description: string | null;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string;
  diskUsage: number;
  owner: {
    login: string;
  };
  primaryLanguage: LanguageNode | null;
  languages: {
    edges: LanguageEdge[];
  };
  repositoryTopics: {
    nodes: RepositoryTopic[];
  };
}

// Minimal repository info inside contributions
export interface ContributionRepository {
  name: string;
  isPrivate: boolean;
  stargazerCount: number;
  primaryLanguage: LanguageNode | null;
  owner: {
    login: string;
    avatarUrl?: string;
    __typename?: string;
  };
}

export interface PullRequestContributionNode {
  pullRequest: {
    title: string;
    state: string;
    createdAt: string;
    mergedAt: string | null;
    additions: number;
    deletions: number;
    changedFiles: number;
    repository: ContributionRepository & {
      languages: {
        nodes: LanguageNode[];
      };
    };
  };
}

export interface CommitContribution {
  occurredAt: string;
  commitCount: number;
}

export interface RepoCommitContribution {
  repository: {
    name: string;
    isPrivate: boolean;
    primaryLanguage: LanguageNode | null;
  };
  contributions: {
    nodes: CommitContribution[];
  };
}

export interface OrganizationNode {
  name: string;
  login: string;
  avatarUrl: string;
  websiteUrl: string | null;
}

export interface UserData {
  name: string;
  login: string;
  avatarUrl: string;
  location: string | null;
  createdAt: string;
  followers: {
    totalCount: number;
  };
  organizations: {
    nodes: OrganizationNode[];
  };
  contributionsCollection: {
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    totalRepositoriesWithContributedCommits: number;
    contributionCalendar: ContributionCalendar;
    commitContributionsByRepository: RepoCommitContribution[];
    pullRequestContributions: {
      nodes: PullRequestContributionNode[];
    };
    pullRequestReviewContributions: {
      nodes: {
        pullRequest: {
          title: string;
          repository: {
            name: string;
            owner: { login: string };
          };
        };
      }[];
    };
  };
  repositories: {
    totalCount: number;
    nodes: RepositoryNode[];
  };
}

export interface ProcessedLanguage {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface TopicStat {
  name: string;
  count: number;
}

export interface AnalysisResult {
  // User Basics
  accountAgeYears: number;
  followers: number;
  
  // Activity
  longestStreak: number;
  currentStreak: number;
  busiestDay: string;
  topHour: number;
  hoursDistribution: number[]; 
  timeCategory: string;
  timeDescription: string;
  periodBreakdown: {
    night: number;    // 00-06
    morning: number;  // 06-12
    afternoon: number;// 12-18
    evening: number;  // 18-24
  };
  isNightOwl: boolean;
  isWeekendWarrior: boolean;
  weekendPercentage: number;
  
  // PR & Code Deep Dive
  totalAdditions: number;
  totalDeletions: number;
  refactorRatio: number;
  avgPrSize: number; // Average additions + deletions
  avgPrFiles: number;
  prMergeRate: number; // Percentage
  avgMergeTimeHours: number; // Average time to merge
  
  // Contribution Breakdown
  breakdown: {
    commits: number;
    issues: number;
    prs: number;
    reviews: number;
  };

  // Projects & Influence
  hottestProject: string;
  totalStars: number;
  totalForks: number;
  avgRepoSize: number; // KB
  privateRepoRatio: number; // 0-1
  
  // Community Stats
  openSourcePRs: number; 
  orgPRs: number;       
  personalPRs: number;   
  impactRepo: {          
    name: string;
    owner: string;
    stars: number;
  } | null;
  topOrganization: {     
    name: string;
    count: number;
    avatarUrl: string;
  } | null;
  
  // Content
  topTopics: TopicStat[];
  topReposList: RepositoryNode[]; // For gallery
}

// AI Report Types
export interface AiPersona {
  veteran: {
    title: string;
    yearsSince: number;
    location: string;
    description: string;
  };
  specialist: {
    primaryLang: string;
    secondaryLangs: string[];
    nicheLang: string;
    description: string;
  };
  creator: {
    topProjects: string[];
    description: string;
  };
  aiSurfer: {
    keywords: string[];
    description: string;
  };
  collaborator: {
    orgNames: string[];
    description: string;
  };
  finalPersona: {
    title: string;
    keywords: string[];
    summary: string;
  };
}