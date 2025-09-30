# Contributing to Estier

Thank you for your interest in contributing to Estier! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain how it benefits Desi Hip-Hop fans
4. Provide mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add: feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use ESLint configuration provided
- Write meaningful variable names
- Add comments for complex logic
- Keep components small and focused

### Testing Your Changes

Before submitting:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Test locally
npm run dev

# Build for production
npm run build
```

### Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature`
- `Fix: bug description`
- `Update: change description`
- `Refactor: code improvement`
- `Docs: documentation update`

### Development Workflow

1. **Setup:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/estier-platform.git
   cd estier-platform
   npm install
   npm run seed
   npm run dev
   ```

2. **Make Changes:**
   - Edit files in `components/`, `pages/`, or `lib/`
   - Test changes locally
   - Ensure no console errors

3. **Submit PR:**
   - Push to your fork
   - Create Pull Request
   - Describe changes clearly
   - Link related issues

## Areas We Need Help

### High Priority
- [ ] Google/Spotify OAuth integration
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Real-time chat UI components
- [ ] Admin panel for content management
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] Advanced search and filters
- [ ] User following system
- [ ] Notification system
- [ ] Artist verification badges
- [ ] Analytics dashboard

### Low Priority
- [ ] Dark/light theme toggle
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Unit and E2E tests

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Inappropriate sexual content
- Unprofessional conduct

## Getting Help

- Check the [README.md](README.md) for setup
- Read [QUICKSTART.md](QUICKSTART.md) for quick start
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
- Ask questions in Discussions
- Join our community chat

## Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Given shoutouts on social media
- Invited to contributor discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Let's build the best platform for Desi Hip-Hop fans together! 🎤🔥**
