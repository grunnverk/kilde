# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Kilde
- AI-powered commit message generation
- Git-based release notes generation
- Model Context Protocol (MCP) server integration
- Interactive mode for reviewing messages
- YAML/JSON configuration support
- Comprehensive documentation (README, AI Guide, Contributing)
- 107 unit tests with 85%+ coverage
- GitHub Actions workflows for CI/CD

## [0.1.0-dev.0] - 2026-01-21

### Added
- Project foundation and build system
- Core commands: `commit` and `release`
- Pure git implementation (no GitHub API dependencies)
- Language-agnostic git automation
- Commander.js CLI interface
- Winston logging with debug mode
- Configuration file support (.kilde/config.yaml)
- Context files support for enhanced AI generation
- Dry-run mode for previewing changes
- MCP server with tools, resources, and prompts
- Test suite with vitest
- Comprehensive documentation

### Features

#### Commit Command
- Generate AI-powered commit messages from git diff
- Stage changes with `--add` flag
- Auto-commit with `--sendit` flag
- Interactive review mode
- Amend previous commits
- Push after committing
- Custom context and context files
- Dry-run preview mode

#### Release Command
- Generate release notes from git history
- Tag-based version comparison
- Customizable focus areas
- Output to file
- Interactive review mode
- Context-aware generation

#### MCP Integration
- `kilde_commit` tool for AI assistants
- `kilde_release` tool for AI assistants
- Configuration resource (`kilde://config`)
- Status resource (`kilde://status`)
- Workspace resource (`kilde://workspace`)
- Commit workflow prompt
- Release workflow prompt

### Technical
- Node.js 24+ requirement
- TypeScript strict mode
- Vite build system (<30s builds)
- ESLint + Prettier
- Vitest for testing
- Coverage reporting with v8
- Git metadata injection in builds
- Executable binaries (kilde, kilde-mcp)

### Documentation
- Comprehensive README with examples
- AI Integration Guide for Claude
- Contributing guidelines
- API documentation
- Issue and PR templates
- Code of conduct

### Infrastructure
- GitHub Actions CI/CD
- Automated testing on push/PR
- NPM publishing workflow
- CodeQL security analysis
- Codecov integration

[Unreleased]: https://github.com/grunnverk/kilde/compare/v0.1.0-dev.0...HEAD
[0.1.0-dev.0]: https://github.com/grunnverk/kilde/releases/tag/v0.1.0-dev.0
