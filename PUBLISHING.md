# Publishing Guide for Ultra Image Uploader

This guide will help you publish the package to NPM.

## Prerequisites

1. **NPM Account**: Ensure you have an NPM account at [npmjs.com](https://www.npmjs.com/)
2. **Login**: Run `npm login` in your terminal
3. **Verify**: Run `npm whoami` to confirm you're logged in

## Pre-Publish Checklist

- [ ] Package builds successfully (`npm run build`)
- [ ] All TypeScript errors are resolved
- [ ] README.md is comprehensive and up-to-date
- [ ] package.json has correct version, description, and keywords
- [ ] License is correctly set (MIT)
- [ ] Repository URLs are correct
- [ ] No sensitive data (API keys, passwords) in the code

## Step-by-Step Publishing

### 1. Clean Previous Build

```bash
npm run clean
```

### 2. Build the Package

```bash
npm run build
```

Verify the `dist/` folder contains:
- `index.js` - Main entry point
- `index.d.ts` - TypeScript declarations
- Component and utility files
- Provider files

### 3. Check Package Contents (Optional)

To see what will be published:

```bash
npm pack --dry-run
```

This creates a tarball and shows its contents without publishing.

### 4. Publish to NPM

For first-time publishing or major updates:

```bash
npm publish
```

For specific release types:

```bash
# Patch release (bug fixes) - 1.0.0 → 1.0.1
npm version patch && npm publish

# Minor release (new features) - 1.0.0 → 1.1.0
npm version minor && npm publish

# Major release (breaking changes) - 1.0.0 → 2.0.0
npm version major && npm publish
```

### 5. Verify Publication

Visit `https://www.npmjs.com/package/ultra-image-uploader` to confirm it's published.

## Version Management

Current version: **1.0.0**

### Semantic Versioning

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, backward compatible

### Updating Version

Edit `package.json`:

```json
{
  "version": "1.0.1"
}
```

Or use npm CLI:

```bash
npm version patch  # or minor/major
```

## Post-Publishing

### 1. Test Installation

In a separate test project:

```bash
npm install ultra-image-uploader
```

### 2. Verify Imports Work

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { uploadImagesToImageBB } from "ultra-image-uploader";
```

### 3. Check TypeScript Types

Ensure IntelliSense and type checking work correctly in your IDE.

## Publishing Tags

### Latest (default)

```bash
npm publish
```

### Next/Beta

```bash
npm publish --tag next
```

Users can then install:

```bash
npm install ultra-image-uploader@next
```

## Access Control

### Public Package

By default, packages are public. Anyone can install them.

### Private Package

If you want to keep it private:

```bash
npm publish --access restricted
```

Note: Private packages require paid NPM account.

## Troubleshooting

### "Package name already taken"

If the package name exists:
1. Choose a different name in `package.json`
2. Or use scoped naming: `@username/ultra-image-uploader`

### "403 Forbidden"

- Ensure you're logged in: `npm login`
- Check you have permission to publish this package name

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### "Cannot find module" after publish

Check that:
- `package.json` has correct `main` and `types` fields
- `dist/index.js` and `dist/index.d.ts` exist
- Files are properly exported in `src/index.ts`

## Continuous Publishing Workflow

For regular updates:

```bash
# 1. Make changes
# 2. Update version
npm version minor

# 3. Build
npm run build

# 4. Publish
npm publish

# 5. Push to git
git push origin main --tags
```

## Publishing Checklist

- [ ] Version incremented in package.json
- [ ] Build successful
- [ ] README.md updated with changes
- [ ] Tested locally after build
- [ ] Logged into NPM
- [ ] Package name available
- [ ] No sensitive data included
- [ ] License is correct

## Useful Commands

```bash
# Check who you're logged in as
npm whoami

# Show package info
npm info ultra-image-uploader

# Show package versions
npm view ultra-image-uploader versions

# Unpublish a version (use with caution!)
npm unpublish ultra-image-uploader@1.0.0

# Deprecate a version
npm deprecate ultra-image-uploader@1.0.0 "Critical security bug, upgrade to 1.0.1"
```

## Next Steps After Publishing

1. **GitHub Release**: Create a GitHub release with changelog
2. **Announce**: Share on social media, dev communities
3. **Documentation**: Ensure docs are comprehensive
4. **Examples**: Add example projects if helpful
5. **Monitor**: Watch for issues and feedback

## Safety Notes

⚠️ **Warning**: You cannot unpublish a package version after 72 hours if other packages depend on it.

Always:
- Test thoroughly before publishing
- Use semantic versioning correctly
- Document breaking changes
- Keep CHANGELOG.md

---

For questions or issues, refer to [NPM's official docs](https://docs.npmjs.com/)
