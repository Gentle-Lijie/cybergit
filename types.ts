
export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
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

export interface RepositoryNode {
  name: string;
  stargazerCount: number;
  forkCount: number;
  languages: {
    edges: LanguageEdge[];
  };
}

// Updated to match ContributionsCollection schema
export interface ContributionRepository {
  name: string;
  isPrivate: boolean;
  stargazerCount: number;
  owner: {
    login: string;
    __typename: string;
  };
}

export interface PullRequestContributionNode {
  pullRequest: {
    title: string;
    state: string;
    mergedAt: string | null;
    repository: ContributionRepository;
  };
}

export interface CommitContribution {
  occurredAt: string;
}

export interface RepoCommitContribution {
  repository: {
    name: string;
    stargazerCount: number;
  };
  contributions: {
    nodes: CommitContribution[];
  };
}

export interface OrganizationNode {
  name: string;
  login: string;
  avatarUrl: string;
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
    contributionCalendar: ContributionCalendar;
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    commitContributionsByRepository: RepoCommitContribution[];
    pullRequestContributions: {
      nodes: PullRequestContributionNode[];
    };
  };
  repositories: {
    totalCount: number;
    nodes: RepositoryNode[];
  };
  // Keeping direct pullRequests for line count stats if needed, 
  // but main logic moves to contributionsCollection
  pullRequests: {
    nodes: {
      additions: number;
      deletions: number;
    }[];
  };
}

export interface ProcessedLanguage {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface AnalysisResult {
  longestStreak: number;
  currentStreak: number;
  busiestDay: string;
  topHour: number;
  hoursDistribution: number[]; 
  // Enhanced Chronotype Stats
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
  totalAdditions: number;
  totalDeletions: number;
  refactorRatio: number;
  hottestProject: string;
  totalStars: number;
  totalForks: number;
  // New Community Stats
  openSourcePRs: number; // External Public
  orgPRs: number;        // Organization owned (public or private)
  personalPRs: number;   // Owned by user
  impactRepo: {          // Highest starred repo contributed to
    name: string;
    owner: string;
    stars: number;
  } | null;
  topOrganization: {     // Org with most contributions
    name: string;
    count: number;
    avatarUrl: string;
  } | null;
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
