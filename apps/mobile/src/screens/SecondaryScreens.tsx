import React from 'react';
import { PlaceholderScreen } from './PlaceholderScreen';

export function ProfileScreen() {
  return (
    <PlaceholderScreen
      title="Profile"
      subtitle="Shared ORIGO auth & portfolio context."
      actionLabel="OPEN QUOTES COMMAND CENTER"
      onAction={(nav) => nav.navigate('QuotesCommandCenter')}
    />
  );
}

export function WatchlistsScreen() {
  return (
    <PlaceholderScreen
      title="Watchlists"
      subtitle="ORIGO shared watchlists will hydrate here."
    />
  );
}

export function InsightsScreen() {
  return (
    <PlaceholderScreen
      title="Insights"
      subtitle="Signature reports and daily transmissions."
    />
  );
}
