export interface BasecampData {
  readonly 'possibilities': {
    readonly title: string;
  };
  readonly 'possibilities-a': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'possibilities-b': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'possibilities-c': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'problem-1': {
    readonly text: string;
  };
  readonly 'problem-2': {
    readonly percent: string;
    readonly percentSubtitle: string;
  }[];
  readonly 'problem-3': {
    readonly 'challenge-1': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-2': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-3': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-4': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'title': string;
  };
  readonly 'welcome': {
    readonly text: string;
  };
}
