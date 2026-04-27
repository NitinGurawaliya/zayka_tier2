# Publish Checklist

1. Bump `version` in `package.json` and update `CHANGELOG.md`.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npm run typecheck`.
5. Run `npm pack` and inspect generated tarball contents.
6. Ensure npm auth with `npm whoami`.
7. Publish with `npm publish --access public`.
