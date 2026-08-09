# Contributing to VibeCode Editor

Thank you for your interest in contributing to VibeCode Editor! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We expect all contributors to follow it.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/vibecode-editor.git
   cd vibecode-editor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version)

### Suggesting Features

Feature suggestions are welcome! Please:

1. Check existing feature requests
2. Create a new issue with the `feature-request` label
3. Include use case and expected behavior

### Contributing Code

1. Find an issue to work on or create one
2. Comment on the issue to let others know you're working on it
3. Follow the development setup below
4. Make your changes
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   - Google OAuth (from Google Cloud Console)
   - GitHub OAuth (from GitHub Developer Settings)
   - MongoDB connection string
   - NextAuth secret

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Optional: AI Features

For AI suggestions and chat, install Ollama:

```bash
# Install Ollama from https://ollama.com
ollama run codellama
```

## Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Write clear commit messages**
4. **Create a pull request** with:
   - Clear title and description
   - Link to related issue
   - Screenshots (if UI changes)
5. **Wait for review** and address feedback

### PR Title Format

Use conventional commits:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code restructuring`
- `test: add tests`
- `chore: maintenance tasks`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type when possible
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS classes
- Follow existing design patterns
- Ensure responsive design

### Git

- Keep commits atomic
- Write meaningful commit messages
- Don't commit `node_modules` or build files

## Project Structure

```
vibecode-editor/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── features/               # Feature-based modules
│   ├── auth/              # Authentication
│   ├── dashboard/         # Dashboard features
│   ├── playground/        # Code playground
│   └── webcontainers/     # WebContainer integration
├── lib/                    # Utility functions
├── prisma/                 # Database schema
└── public/                 # Static assets
```

## Questions?

If you have questions:

1. Check existing issues and discussions
2. Create a new discussion
3. Reach out to maintainers

Thank you for contributing to VibeCode Editor!
