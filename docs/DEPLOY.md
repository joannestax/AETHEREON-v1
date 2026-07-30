# Deploying Aetheron (Web Preview + TestFlight path)

## Web preview

### Open right now (local)
```bash
cd apps/mobile && npm install && npx expo start --web
```

### Permanent GitHub Pages (one click after merge)
1. Merge this PR to `main` (Actions workflow auto-deploys)
2. Or: GitHub → **Settings → Pages → Source: GitHub Actions**
3. URL: **https://joannestax.github.io/AETHEREON-v1/**

Manual deploy:
```bash
./scripts/deploy-web.sh
# then Settings → Pages → Deploy from branch → gh-pages / root
```

### TestFlight / App Store
See `eas.json`. Requires Apple Developer + `eas login`, then:
```bash
cd apps/mobile
eas build --platform ios --profile preview
eas submit --platform ios
```


## Backend for live chat/quotes

Static Pages host is frontend-only. Chat falls back to offline mentor voice.
For live API, run `backend` and set:

```bash
EXPO_PUBLIC_AETHERON_API_URL=https://your-api-host
```
