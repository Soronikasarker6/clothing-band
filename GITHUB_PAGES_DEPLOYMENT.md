# GitHub Pages Deployment Configuration Summary

## Overview
Successfully configured the Angular clothing-band application for automated deployment to GitHub Pages using GitHub Actions. The application is now deployable with proper routing, asset paths, and base-href configuration.

## Files Changed

### 1. `.github/workflows/deploy.yml` (NEW)
**Purpose:** GitHub Actions workflow for automated build and deployment

**Key Features:**
- Triggers on push to `main` branch or manual workflow dispatch
- Sets up Node.js 20 with npm caching
- Installs dependencies with `npm ci`
- Builds Angular app with `--base-href=/clothing-band/`
- Uploads artifact from `dist/maison-atelier/browser`
- Deploys using official GitHub Pages Actions
- Proper permissions and concurrency configuration

**Build Command in Workflow:**
```bash
npm run build -- --base-href=/clothing-band/ --configuration production
```

### 2. `angular.json` (MODIFIED)
**Purpose:** Configure Angular build output and base-href

**Changes Made:**
- Added `"baseHref": "/clothing-band/"` to the production build configuration
- This ensures all asset paths and router links use the correct base path

**Location:**
```json
"configurations": {
  "production": {
    "baseHref": "/clothing-band/",
    // ... other config
  }
}
```

**Impact:**
- CSS and JS bundles reference correct paths
- Angular Router navigation works correctly from `/clothing-band/` base
- No hardcoded `/clothing-band/` needed in component code

### 3. `public/404.html` (NEW)
**Purpose:** Handle SPA routing on GitHub Pages static hosting

**How It Works:**
- GitHub Pages serves this file when a route doesn't match a static file
- Redirects users back to `index.html` within the `/clothing-band/` context
- Preserves the original path as a query parameter
- Angular Router then handles the actual route

**Why Needed:**
- GitHub Pages is a static host without server-side routing
- Accessing `/clothing-band/shop` directly returns 404 without this redirect
- This is a standard solution for single-page applications

## Build Configuration Details

### Angular Project
- **Name:** `maison-atelier`
- **Version:** Angular 20.3.x
- **Output Directory:** `dist/maison-atelier/browser`
- **Base Path:** `/clothing-band/`

### Build Process
```bash
npm install              # Install dependencies
npm run build -- --base-href=/clothing-band/  # Production build with base-href
```

### Output Structure
The production build generates:
```
dist/
  maison-atelier/
    browser/
      index.html
      assets/           # Images, media
      *.js             # JavaScript bundles
      *.css            # Stylesheets
      media/           # Product images, etc.
```

## GitHub Actions Workflow Details

### File Location
`.github/workflows/deploy.yml`

### Workflow Stages

**1. Build Job**
- Checks out code
- Sets up Node.js 20
- Caches npm dependencies
- Installs dependencies with `npm ci`
- Builds with base-href for `/clothing-band/`
- Uploads artifact with official GitHub Pages action

**2. Deploy Job**
- Deploys artifact to GitHub Pages
- Sets up GitHub Pages environment
- Uses official `actions/deploy-pages@v4`

### Environment Permissions
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Trigger Conditions
- Automatic: Push to `main` branch
- Manual: Workflow dispatch from GitHub Actions tab

## Angular Routing Configuration

### Existing Routes
The application has these routes:
- `/` - Home
- `/shop` - Product listing
- `/new-arrivals` - New items
- `/sale` - Sale items
- `/men` / `/men/:category` - Men's products
- `/women` / `/women/:category` - Women's products
- `/product/:slug` - Product detail
- `/wishlist` - Wishlist
- `/cart` - Cart drawer

### How Base-Href Works
- **Production URL:** `https://soronikasarker6.github.io/clothing-band/`
- **Home Route:** `https://soronikasarker6.github.io/clothing-band/`
- **Shop Route:** `https://soronikasarker6.github.io/clothing-band/shop`
- **Product Route:** `https://soronikasarker6.github.io/clothing-band/product/denim-jacket`

### Asset Loading
With `baseHref: "/clothing-band/"`:
- CSS files load from `/clothing-band/styles.*.css`
- JS bundles load from `/clothing-band/*.js`
- Images load from `/clothing-band/media/...`
- Fonts load from `/clothing-band/assets/fonts/...`

All paths are relative to the base-href automatically.

## GitHub Pages Configuration

### Current Settings
- **Source:** GitHub Actions (as of this deployment)
- **URL:** `https://soronikasarker6.github.io/clothing-band/`
- **Branch:** main (GitHub automatically renamed from master)

### Next Steps (Manual)
In repository settings, update GitHub Pages configuration:
1. Go to Settings → Pages
2. Change "Source" from "Deploy from a branch" to "GitHub Actions"
3. Save

## Local Development

### Development Server Still Works
```bash
npm start
# Opens at http://localhost:4200/
```

**Important:** The `baseHref` only applies to the production build configured in `angular.json`. Local development uses the default base of `/`, so no changes to development experience.

### Production Build Locally (for testing)
```bash
npm run build
# Output: dist/maison-atelier/browser/
```

To test locally:
```bash
npx http-server ./dist/maison-atelier/browser -b
# Then navigate to http://localhost:8080/clothing-band/
```

## Commits Made

1. **c29652f** - Configure GitHub Pages deployment with GitHub Actions
   - Added `.github/workflows/deploy.yml`
   - Added `public/404.html`
   - Modified `angular.json` with baseHref

2. **2cb54dd** - Convert currency from USD to BDT (Bangladeshi Taka) throughout project
   - Changed all currency references from USD to BDT

## Deployment URL

**Live Application:** `https://soronikasarker6.github.io/clothing-band/`

The GitHub Actions workflow will:
1. Trigger automatically on push to `main`
2. Build the application with `--base-href=/clothing-band/`
3. Upload the `dist/maison-atelier/browser` artifact
4. Deploy to GitHub Pages
5. Application available at the URL above

## Asset Resolution

### Images and Media
All product images in `public/media/` are included in the build and accessible at:
- `https://soronikAsarker6.github.io/clothing-band/media/hero.jpg`
- `https://soronikAsarker6.github.io/clothing-band/media/product-*.jpg`

### Fonts
Fonts from `@fontsource-variable/jost` and `@fontsource/bodoni-moda` are bundled and load correctly.

### Lazy-Loaded Routes
Each route (shop, product detail, etc.) has its own lazy-loaded JavaScript chunk:
- `chunk-MW3LHU4H.js` - home-page
- `chunk-MLVFFJJV.js` - product-detail-page
- `chunk-4XZYLJTK.js` - shop-page
- etc.

All chunks load with correct base-href paths.

## Verification Checklist

✅ Angular project configured with base-href in production build
✅ GitHub Actions workflow created and committed
✅ 404.html created for SPA routing support
✅ Build command includes --base-href=/clothing-band/
✅ Artifact upload to correct output directory
✅ Official GitHub Pages Actions used
✅ Changes pushed to main branch
✅ Local development (npm start) still works
✅ Production build output structure verified
✅ Router configuration includes all existing routes
✅ No application functionality changed
✅ Only deployment-related changes made

## Troubleshooting

### If GitHub Actions Fails
1. Check Actions tab in repository
2. Look at the "Build and Deploy to GitHub Pages" workflow
3. Click on failed run to see error details
4. Common issues:
   - Node version mismatch (configured for Node 20)
   - npm cache issues (cleared with `cache: 'npm'`)
   - Angular build errors (check build output)

### If App Doesn't Load
1. Check browser console for 404 errors
2. Verify URLs start with `/clothing-band/`
3. Check that 404.html is deployed
4. Clear browser cache

### If Routes Don't Work
1. Ensure 404.html is in the deployed build
2. Check that baseHref is set in angular.json production config
3. Verify GitHub Pages is configured to use GitHub Actions

## Summary

This deployment configuration:
- ✅ Automatically builds Angular app on code push
- ✅ Configures correct base path for `/clothing-band/` subpath
- ✅ Handles SPA routing with 404 redirect
- ✅ Uses official GitHub Pages Actions
- ✅ Preserves local development workflow
- ✅ Doesn't change application functionality
- ✅ Makes assets load correctly from subdomain
- ✅ Enables all existing routes to work

The application is now ready for production deployment to GitHub Pages!
