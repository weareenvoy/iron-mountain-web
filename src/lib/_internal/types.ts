// UI Navigation state for exhibits (local to UI, not MQTT)
export interface ExhibitNavigationState {
  beatIdx: number;
  momentId: string; // e.g., "ambient", "welcome", "case-study"
}

// Used in MomentsAndBeats component.
// A bullet point row is a moment, each moment has multiple beats.
export interface Moment {
  beatCount: number;
  id: string; // e.g., "ambient", "welcome" for basecamp, "case-study" for overlook.
  title: string; // e.g., "Ambient", "Welcome"
}
