# Release Checklist for Kilde v0.1.0

## Pre-Release Validation

### Code Quality
- [x] All tests passing (107/107)
- [x] Test coverage >70% (currently 85%+)
- [x] Linting passes with no errors
- [x] TypeScript compilation successful
- [x] Build completes in <30 seconds
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All dependencies up to date

### Documentation
- [x] README.md complete and accurate
- [x] AI_GUIDE.md complete with MCP examples
- [x] CONTRIBUTING.md with development guidelines
- [x] CHANGELOG.md updated with v0.1.0 changes
- [x] LICENSE file present (Apache-2.0)
- [ ] All examples tested and working
- [ ] API documentation reviewed

### Functionality Testing
- [ ] `kilde commit` works in test repository
  - [ ] With `--add` flag
  - [ ] With `--sendit` flag
  - [ ] With `--interactive` mode
  - [ ] With `--context` and `--context-files`
  - [ ] With `--dry-run` mode
- [ ] `kilde release` works in test repository
  - [ ] With version number
  - [ ] With tag range
  - [ ] With `--output` to file
  - [ ] With `--focus` parameter
  - [ ] With `--dry-run` mode
- [ ] MCP server starts correctly
  - [ ] Tools are discoverable
  - [ ] Resources are accessible
  - [ ] Prompts work as expected
- [ ] Configuration loading works
  - [ ] From `.kilde/config.yaml`
  - [ ] From `.kilderc.yaml`
  - [ ] Merges with defaults correctly

### Cross-Platform Testing
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Tested on Windows
- [ ] Node 24.x compatibility verified

### Language-Agnostic Testing
- [ ] Tested in JavaScript/TypeScript repo
- [ ] Tested in Python repo
- [ ] Tested in Go repo
- [ ] Tested in Rust repo
- [ ] Tested in Java repo

### GitHub Workflows
- [x] `.github/workflows/test.yml` created
- [x] `.github/workflows/npm-publish.yml` created
- [x] `.github/workflows/codeql.yml` created
- [ ] Workflows validated (push to working branch)
- [ ] CI passing on latest commit

### Package Configuration
- [x] `package.json` metadata correct
  - [x] Name: `@grunnverk/kilde`
  - [x] Version: `0.1.0-dev.0` (update to `0.1.0` for release)
  - [x] Description accurate
  - [x] Repository URL correct
  - [x] Keywords relevant
  - [x] License: Apache-2.0
  - [x] Author information
- [x] Binary entries configured (`kilde`, `kilde-mcp`)
- [x] Main entry point correct
- [ ] Files to publish specified (or .npmignore)
- [ ] Dependencies locked (`package-lock.json`)

### Repository Setup
- [ ] Repository created on GitHub (grunnverk/kilde)
- [ ] Repository description set
- [ ] Topics/tags added
- [ ] Default branch set (main)
- [ ] Branch protection rules configured
- [ ] Secrets configured:
  - [ ] `NPM_TOKEN` for publishing
  - [ ] `OPENAI_API_KEY` for tests
- [ ] Issue templates enabled
- [ ] PR template enabled
- [ ] GitHub Pages configured (if using)

## Release Process

### Version Bump
- [ ] Update version in `package.json` from `0.1.0-dev.0` to `0.1.0`
- [ ] Update version in `src/mcp/server.ts` (line 36)
- [ ] Update CHANGELOG.md with release date
- [ ] Commit version bump: `chore(release): bump version to 0.1.0`

### Pre-Publish Checks
- [ ] Clean install: `rm -rf node_modules package-lock.json && npm install`
- [ ] Build: `npm run build`
- [ ] Test: `npm test`
- [ ] Pack: `npm pack` and inspect contents
- [ ] Test pack install: `npm install -g grunnverk-kilde-0.1.0.tgz`
- [ ] Verify CLI works: `kilde --version`
- [ ] Verify MCP works: `kilde-mcp` responds

### Git Operations
- [ ] Commit all changes
- [ ] Push to working branch
- [ ] Verify CI passes
- [ ] Create PR to main
- [ ] Merge PR to main
- [ ] Pull latest main locally
- [ ] Create and push tag: `git tag v0.1.0 && git push origin v0.1.0`

### NPM Publishing
- [ ] Verify NPM login: `npm whoami`
- [ ] Publish: `npm publish --access public`
- [ ] Verify on npmjs.com: https://www.npmjs.com/package/@grunnverk/kilde
- [ ] Test global install: `npm install -g @grunnverk/kilde`
- [ ] Test npx: `npx @grunnverk/kilde --version`

### GitHub Release
- [ ] GitHub Release created automatically (via workflow)
- [ ] Release notes added/reviewed
- [ ] Binaries attached (if applicable)
- [ ] Mark as latest release

### Post-Release
- [ ] Update version to `0.2.0-dev.0` for next development cycle
- [ ] Announce release:
  - [ ] GitHub Discussions
  - [ ] Twitter/X (if applicable)
  - [ ] Discord (if applicable)
- [ ] Monitor for issues
- [ ] Update documentation website (if applicable)

## Rollback Plan

If critical issues are discovered:

1. **NPM Deprecation**
   ```bash
   npm deprecate @grunnverk/kilde@0.1.0 "Critical bug found, use 0.1.1"
   ```

2. **Publish Patch**
   - Fix issue
   - Bump to 0.1.1
   - Follow release process

3. **GitHub Release**
   - Edit release to mark as pre-release
   - Add warning to release notes

## Success Criteria

Release is successful when:
- [x] Package builds without errors
- [x] All tests pass
- [x] Documentation is complete
- [ ] NPM package published successfully
- [ ] GitHub Release created
- [ ] CI/CD workflows passing
- [ ] Installation works globally and via npx
- [ ] MCP integration works with Claude
- [ ] No critical bugs reported within 24 hours

## Notes

- First release (v0.1.0) - expect some initial user feedback
- Focus on core functionality stability
- Documentation quality is critical for adoption
- MCP integration is a key differentiator

## Contacts

- Package maintainer: Tim O'Brien (@tobrien)
- GitHub org: grunnverk
- NPM org: @grunnverk
