export interface SummitData {
  readonly footerStats?: readonly string[];
  readonly hero: SummitHero;
  readonly metrics: SummitMetrics;
  readonly obstacles: SummitObstacles;
  readonly recap?: SummitRecap; // legacy support
  readonly recaps?: readonly SummitRecap[];
  readonly stories: SummitStories;
  readonly strategies: readonly SummitStrategy[];
  readonly summary: SummitSummary;
}

export interface SummitHero {
  readonly advisorName: string;
  readonly clientName: string;
  readonly date: string;
  readonly location: string;
  readonly logoAlt: string;
  readonly logoSrc: string;
  readonly subtitle: string;
  readonly title?: string;
}

export interface SummitMetricItem {
  readonly description: string;
  readonly label: string;
  readonly value: string;
}

export interface SummitMetrics {
  readonly description: string;
  readonly items: readonly SummitMetricItem[];
  readonly title: string;
}

export interface SummitObstacleItem {
  readonly body: string;
  readonly icon: string;
  readonly title: string;
}

export interface SummitObstacles {
  readonly description: string;
  readonly items: readonly SummitObstacleItem[];
  readonly title: string;
}

export interface SummitRecap {
  readonly body: string;
  readonly cta: string;
  readonly title: string;
}

export interface SummitStories {
  readonly description: string;
  readonly items: readonly SummitStoryItem[];
  readonly title: string;
}

export interface SummitStoryItem {
  readonly category: string;
  readonly description: string;
  readonly title: string;
}

export interface SummitStrategy {
  readonly eyebrow: string;
  readonly items: readonly SummitStrategyItem[];
  readonly summary: string;
  readonly title?: string;
}

export interface SummitStrategyItem {
  readonly body: readonly string[];
  readonly title: string;
}

export interface SummitSummary {
  readonly body: string;
  readonly cta: string;
  readonly title: string;
}

export type SummitSlideScreen = 'primary' | 'secondary';
