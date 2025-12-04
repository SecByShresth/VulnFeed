# Contributing to Onyx Vuln Intelligence Dashboard

Thank you for your interest in contributing to Onyx! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search for similar issues first
2. **Create a detailed report** - Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information
   - Console errors (if any)

### Suggesting Features

1. **Check the roadmap** - See if it's already planned
2. **Open a discussion** - Describe your idea
3. **Explain the use case** - Why is this valuable?
4. **Consider implementation** - How might it work?

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/VulnFeed.git
   cd VulnFeed
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

**Frontend (HTML/CSS/JS)**
- Use vanilla JavaScript (no frameworks)
- Follow existing code style
- Add comments for complex logic
- Test in multiple browsers
- Ensure mobile responsiveness

**Python Scripts**
- Follow PEP 8 style guide
- Add docstrings to functions
- Handle errors gracefully
- Test with sample data

**CSS Styling**
- Use CSS variables for colors
- Maintain theme consistency
- Support both light and dark modes
- Use relative units (rem, em)

#### Testing

Before submitting:
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify light and dark themes
- [ ] Check console for errors
- [ ] Test with actual vulnerability data

#### Commit Messages

Use clear, descriptive commit messages:
```
✨ Add new feature
🐛 Fix bug in vulnerability parser
📝 Update documentation
🎨 Improve UI styling
♻️ Refactor data loading
⚡ Improve performance
```

#### Pull Request Process

1. **Update documentation** - If needed
2. **Add tests** - If applicable
3. **Update README** - For new features
4. **Create PR** with:
   - Clear title
   - Description of changes
   - Related issue number
   - Screenshots (for UI changes)

### Code Review

- Be respectful and constructive
- Respond to feedback promptly
- Make requested changes
- Keep discussions focused

## 📋 Development Setup

### Prerequisites
- Modern web browser
- Python 3.11+ (for data scripts)
- Git

### Local Development

1. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve
   ```

2. **Access dashboard**
   ```
   http://localhost:8000
   ```

3. **Test data fetching**
   ```bash
   cd scripts
   python fetch_osv_data.py
   ```

## 🎨 UI/UX Contributions

We especially welcome:
- Design improvements
- Accessibility enhancements
- Mobile optimizations
- New visualizations
- Animation refinements

## 📊 Data Source Contributions

To add a new data source:

1. **Update `DATA_SOURCES`** in `app.js`
2. **Add fetch logic** in `scripts/fetch_osv_data.py`
3. **Update normalization** in `normalizeVulnerability()`
4. **Test thoroughly**
5. **Update documentation**

## 🔒 Security

**Reporting Security Issues**

DO NOT open public issues for security vulnerabilities.

Instead, email: security@example.com

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 💬 Questions?

- Open a [Discussion](https://github.com/yourusername/VulnFeed/discussions)
- Join our community chat
- Check the [Wiki](https://github.com/yourusername/VulnFeed/wiki)

---

Thank you for contributing to Onyx! 🎉
