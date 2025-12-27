# Contribution Guide

> **Document Version:** v1.0.1
> **Document Last Updated:** December 28, 2025

Thank you for your interest in contributing to FAPI! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Development Tips](#development-tips)
- [Questions?](#questions)
- [License](#license)

**For release workflow and versioning details, see [RELEASE_PROCESS.md](RELEASE_PROCESS.md)**

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

FAPI is a developer tool built with Next.js 16, React 19, and TypeScript. Before contributing, familiarize yourself with:

- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI](https://mui.com/)

## Development Setup

### Prerequisites

- Node.js >= 20.9.0
- npm (comes with Node.js)
- Git

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/FAPI-Fake-APIs.git
   cd FAPI-Fake-APIs
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/sohamderoy/FAPI-Fake-APIs.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Running on Different Ports

To test multiple FAPI instances simultaneously:

```bash
npm run dev         # Port 3000
npm run dev:3001    # Port 3001
npm run dev:3002    # Port 3002
```

## Project Structure

```
FAPI-Fake-APIs/
├── bin/
│   └── start-fapi.js                 # CLI executable entry point
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API route handlers
│   │   ├── fapi-simulator/           # Main simulator UI
│   │   ├── home/                     # Landing page
│   ├── components/                   # Business logic components
│   ├── lib/                          # Reusable UI components
│   ├── store/                        # Redux state management
│   ├── types/                        # Global TypeScript types
│   ├── utils/                        # Utility functions
│   │   ├── data/                     # Constants & configuration
│   │   ├── functions/                # Business logic
│   │   └── validators/               # Validation functions
│   └── theme/                        # Material-UI theme
├── .fapi-storage/                    # File-based storage created runtime (gitignored)
├── package.json                      # NPM configuration
├── tsconfig.json                     # TypeScript configuration
└── tailwind.config.ts                # Tailwind configuration
```

### Key Directories

- **`src/app/api/`**: Next.js Route Handlers for internal management APIs
- **`src/components/`**: Feature-specific React components with business logic
- **`src/lib/`**: Generic, reusable UI components
- **`src/store/`**: Redux slices and store configuration
- **`src/utils/functions/`**: Core business logic (create, update, delete endpoints)
- **`src/utils/validators/`**: Validation functions for data integrity

## Development Workflow

### 1. Create a Feature Branch

Always work on a feature branch, never directly on `main` or `develop`:

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code following the [coding standards](#coding-standards)
- Keep commits focused and atomic
- Write descriptive commit messages

### 3. Test Your Changes

- Test manually by running the app
- Verify all existing functionality still works
- Test edge cases and error scenarios

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

#### Commit Message Format

This project follows conventional commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:

```
feat: add response headers configuration to endpoints
fix: resolve JSON validation error in Monaco editor
docs: update README with new installation steps
refactor: extract endpoint validation into separate utility
```

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/develop
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- **Important:** Always select `develop` as the base branch
- ⚠️ **Do NOT create PRs to `main`** - they will be closed
- Provide a clear description of your changes
- Reference any related issues

**Note:** For details on the release workflow and branching strategy, see [RELEASE_PROCESS.md](RELEASE_PROCESS.md).

## Testing

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] App starts without errors
- [ ] Can create a new endpoint
- [ ] Can update an existing endpoint
- [ ] Can delete an endpoint
- [ ] Import/export functionality works
- [ ] FAPI endpoints respond correctly (Test via Postman or similar application)
- [ ] Response delays work as expected
- [ ] Form validation shows appropriate errors
- [ ] Snackbar notifications appear correctly
- [ ] Project name can be updated
- [ ] Changes persist after page reload

### Testing Created Endpoints

Use the browser console or tools like Postman to test:

```javascript
// Test a GET endpoint
fetch("http://localhost:3000/api/fapi/users")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Test a POST endpoint
fetch("http://localhost:3000/api/fapi/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test User" }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Edge Cases to Test

- Maximum endpoint limit (1000)
- Invalid JSON in response editor
- Special characters in endpoint paths
- Query parameters in paths
- Large response payloads
- Network delays

## Submitting Changes

### Pull Request Guidelines

- **Target branch**: Always submit PRs to `develop`, not `main`
- **Title**: Clear and descriptive (e.g., "Add response headers configuration")
- **Description**: Explain what and why, not just how
- **Screenshots**: Include for UI changes
- **Breaking changes**: Clearly document any breaking changes

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Change 1
- Change 2

## Testing

How did you test this change?

## Screenshots (if applicable)

Add screenshots here

## Related Issues

Closes #issue_number
```

### Review Process

1. Maintainer(s) will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged into `develop`
4. Changes will be included in the next release

## Reporting Issues

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if the issue is already fixed in `develop` branch
- Collect relevant information (browser, Node version, error messages)

### Issue Template

```markdown
## Description

Clear description of the issue

## Steps to Reproduce

1. Step 1
2. Step 2
3. ...

## Expected Behavior

What should happen?

## Actual Behavior

What actually happens?

## Environment

- OS: [e.g., macOS 14.1]
- Node version: [e.g., 20.10.0]
- Browser: [e.g., Chrome 120]
- FAPI version: [e.g., 1.0.0]

## Additional Context

Any other relevant information
```

## Development Tips

### Storage File Location

During development, the storage file is located at:

```
{project-root}/.fapi-storage/fapi-endpoints-{port}.json
```

You can manually inspect or edit this file to debug storage issues.

### Port-Based Isolation

Each port instance has its own storage file. This allows you to:

- Test multiple projects simultaneously
- Isolate development environments
- Debug port-specific issues

### Debugging Redux State

Install [Redux DevTools](https://github.com/reduxjs/redux-devtools) browser extension to inspect:

- Current Redux state
- Dispatched actions
- State changes over time

### Hot Reload

Next.js supports hot module replacement. Changes to most files will automatically reload without losing state.

## Questions?

If you have questions:

- Open a [GitHub Discussion](https://github.com/sohamderoy/FAPI-Fake-APIs/discussions)
- Check existing issues and pull requests
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (check [LICENSE](LICENSE) file).

---

Thank you for contributing to FAPI! Your efforts are highly appreciated.
