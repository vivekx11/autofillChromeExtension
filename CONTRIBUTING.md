# Contributing to Auto Form Filler Chrome Extension

First off, thank you for considering contributing to Auto Form Filler! It's people like you that make this extension better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Mention your browser version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear and descriptive title**
- **Detailed description of the proposed functionality**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be more involved than beginner issues

## Development Setup

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button at the top of the repository page
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/autofillChromeExtension.git
   cd autofillChromeExtension
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Load the extension in Chrome**
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `auto-form-filler` folder

5. **Make your changes**
   - Edit the code
   - Test thoroughly
   - Ensure all files are properly commented

6. **Test your changes**
   - Test on multiple websites
   - Verify form detection works
   - Check that data persists correctly
   - Test keyboard shortcuts

## Pull Request Process

1. **Update documentation**
   - Update the README.md with details of changes if needed
   - Update code comments

2. **Follow coding guidelines**
   - Ensure your code follows the project's style
   - Add comments for complex logic
   - Keep functions small and focused

3. **Test thoroughly**
   - Test on multiple websites
   - Test edge cases
   - Verify existing functionality still works

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link any related issues

7. **Wait for review**
   - Address any feedback
   - Make requested changes
   - Be patient and respectful

## Coding Guidelines

### JavaScript Style

- Use ES6+ features where appropriate
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string concatenation
- Keep functions pure when possible
- Avoid global variables

### Code Organization

```javascript
// Good
function calculateScore(data) {
  // Clear, focused function
  return data.reduce((sum, item) => sum + item.value, 0);
}

// Avoid
function doEverything() {
  // Too much responsibility
}
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Explain "why", not "what"
- Keep comments up-to-date

```javascript
// Good
// Calculate confidence score using weighted algorithm
// Higher weight for exact name matches (40%) over ID matches (30%)
const score = calculateWeightedScore(field);

// Avoid
// Set score variable
const score = calculateWeightedScore(field);
```

### Naming Conventions

- **Variables**: camelCase (`userData`, `formFields`)
- **Functions**: camelCase (`detectForms`, `fillFormFields`)
- **Classes**: PascalCase (`AutoFormFiller`, `FieldMatcher`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`)
- **Private methods**: prefix with underscore (`_internalMethod`)

### Error Handling

```javascript
// Always handle errors gracefully
try {
  await loadUserData();
} catch (error) {
  console.error('Failed to load user data:', error);
  showNotification('Failed to load data. Please try again.', 'error');
}
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat: add support for dropdown fields
feat(popup): add dark mode toggle
fix: resolve form detection on dynamic pages
fix(storage): handle empty user data correctly
docs: update installation instructions
style: format code with prettier
refactor: simplify field matching algorithm
test: add unit tests for field detector
chore: update dependencies
```

### Subject Line Rules

- Use imperative mood ("add", not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

### Body (Optional)

- Provide more details if needed
- Explain what and why, not how
- Wrap at 72 characters

### Footer (Optional)

- Reference issues: `Closes #123` or `Fixes #456`
- Note breaking changes: `BREAKING CHANGE: description`

## Testing Guidelines

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Data saves successfully
- [ ] Forms are detected correctly
- [ ] Auto-fill button appears
- [ ] Fields are filled correctly
- [ ] Keyboard shortcut works
- [ ] Visual feedback is shown
- [ ] Notifications display correctly
- [ ] Works on multiple websites

### Test Cases to Consider

1. **Empty forms** - Should fill all empty fields
2. **Partially filled forms** - Should only fill empty fields
3. **Dynamic forms** - Should detect forms added after page load
4. **Multiple forms** - Should handle multiple forms on same page
5. **Hidden fields** - Should not fill password/hidden fields
6. **Special characters** - Should handle special characters in data

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Contact the maintainers

## Recognition

Contributors will be:
- Listed in the project contributors
- Mentioned in release notes for significant contributions
- Thanked publicly in project announcements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🚀**

Your efforts help make this extension better for everyone.
