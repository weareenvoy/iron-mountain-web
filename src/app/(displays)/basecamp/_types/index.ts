export interface BasecampData {
  'possibilities': { title: string };
  'possibilities-a': {
    'body-1': string;
    'body-2': string;
    'body-3': string;
    'title': string;
  };
  'possibilities-b': {
    'body-1': string;
    'body-2': string;
    'body-3': string;
    'title': string;
  };
  'possibilities-c': {
    'body-1': string;
    'body-2': string;
    'body-3': string;
    'title': string;
  };
  'problem-1': { text: string };
  'problem-2': Array<{ percent: string; percentSubtitle: string }>;
  'problem-3': {
    'challenge-1': { body: string; icon: string; title: string };
    'challenge-2': { body: string; icon: string; title: string };
    'challenge-3': { body: string; icon: string; title: string };
    'challenge-4': { body: string; icon: string; title: string };
    'title': string;
  };
  'welcome': { text: string };
}
