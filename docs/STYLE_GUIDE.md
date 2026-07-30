# How to edit Aetheron style & buttons

The mockups (deep space + gold + cyan + glass) are controlled by a small set of files. Change these first — do not scatter one-off colors.

## 1. Global look → `apps/mobile/src/theme/tokens.ts`

| Token | Role | Mockup value |
|-------|------|--------------|
| `colors.space.*` | Backgrounds | `#020617` / `#050A18` |
| `colors.gold.*` | Authority, titles, CTAs | `#C5A059` / `#D4AF37` |
| `colors.cyan.*` | Live data, AI glow | `#00D2FF` |
| `colors.signal.*` | Bullish / bearish | green / red |
| `colors.glass.*` | Card fill + borders | translucent navy |
| `typography.brand` | ORIGO / Aetheron titles | Cinzel |
| `typography.ui*` | Data & buttons | DM Sans |

Change a gold hex here → every gold button/title updates.

## 2. Buttons → `apps/mobile/src/components/ui/CosmicButton.tsx`

Variants: `gold` | `cyan` | `ghost` | `danger`

```tsx
<CosmicButton label="NEW QUERY" variant="gold" onPress={...} />
<CosmicButton label="ASK AETHERON" variant="cyan" compact />
```

Status chips (LIVE / ORBITAL SYNC): `<StatusChip label="LIVE FEEDS" tone="green" />`

## 3. Cards → `apps/mobile/src/components/ui/GlassCard.tsx`

```tsx
<GlassCard accent="cyan" glow="cyan">...</GlassCard>
<GlassCard accent="gold" glow="gold">...</GlassCard>
```

## 4. Avatar forms → `apps/mobile/src/components/avatar/AetheronOrb.tsx`

`form="sphere" | "titan" | "realm_guide"`

## 5. Screen layouts

| Screen | File |
|--------|------|
| Observatory | `screens/ObservatoryScreen.tsx` |
| Chat | `screens/ChatScreen.tsx` |
| Signature Analysis | `screens/SignatureAnalysisScreen.tsx` |
| Quotes Command Center | `screens/QuotesCommandCenterScreen.tsx` |
| Bottom tabs | `navigation/MainTabs.tsx` |

## 6. Match the attached mockups checklist

- [ ] Gold serif brand (`ORIGO`, `AETHERON`)
- [ ] Cyan taglines / live accents
- [ ] Glass cards with thin cyan/gold borders
- [ ] Glowing orb hero
- [ ] Watchlist rows: icon · name · sparkline · price · %
- [ ] Market data 2×2 grid
- [ ] Chat: cyan AI bubbles, gold user bubbles
- [ ] Bottom nav with gold active state

## 7. Hot reload

```bash
cd apps/mobile && npx expo start --web
```

Edit `tokens.ts` → save → UI updates instantly.
