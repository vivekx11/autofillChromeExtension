# autofillChromeExtension

A powerful Chrome extension that automatically fills web forms with your saved personal information, making form submission faster and easier.

## Features

- ✨ **Auto-Fill Forms**: Automatically detects and fills form fields with your saved data
- 🔒 **Secure Storage**: Your data is stored securely in Chrome's local storage
- 🎯 **Smart Field Detection**: Intelligently identifies form fields based on names, IDs, and placeholders
- ⌨️ **Keyboard Shortcuts**: Use Ctrl+Shift+F (or Cmd+Shift+F on Mac) to fill forms instantly
- 📋 **Multiple Data Types**: Store and fill name, email, phone, address, resume link, LinkedIn, and GitHub profiles
- 🎨 **Beautiful UI**: Modern, intuitive popup interface with dark theme support
- 📱 **Lightweight**: Minimal performance impact on your browsing experience

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vivekx11/autofillChromeExtension.git
   cd autofillChromeExtension
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right corner)
   - Click "Load unpacked"
   - Select the `autofillChromeExtension` folder

3. **Start Using**
   - Click the extension icon in your Chrome toolbar
   - Fill in your personal information
   - Click "Save" to store your data

## Usage

### Save Your Information

1. Click the extension icon in the toolbar
2. Fill in your personal details:
   - Full Name
   - Email Address
   - Phone Number
   - Address
   - Resume Link
   - LinkedIn Profile URL
   - GitHub Profile URL
3. Click "Save" to store the information

### Auto-Fill Forms

**Method 1: Click the Button**
- Navigate to any website with a form
- Click the "🚀 Auto Fill Form" button that appears above the form
- Empty fields will be automatically populated

**Method 2: Keyboard Shortcut**
- Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
- All compatible form fields on the page will be filled

## File Structure

```
autofillChromeExtension/
├── auto-form-filler/
│   ├── content.js          # Main content script for form detection and filling
│   ├── manifest.json       # Chrome extension configuration
│   ├── popup.html          # Popup UI interface
│   ├── popup.js            # Popup functionality
│   └── styles.css          # Styling for popup
├── .vscode/
│   └── settings.json       # VS Code workspace settings
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── .gitignore             # Git ignore rules
└── requirements.txt       # Project dependencies
```

## Technologies Used

- **JavaScript**: Core extension logic
- **Chrome Extension API**: For storage and messaging
- **HTML/CSS**: User interface
- **MutationObserver API**: For detecting dynamically added forms

## How It Works

1. **Content Script** loads on every webpage
2. **Form Detection** scans the page for form elements
3. **Field Analysis** intelligently matches form fields to user data
4. **Auto-Fill Button** appears with compatible forms
5. **User Action** triggers the form filling process
6. **Event Triggering** ensures form validation works correctly
7. **Visual Feedback** shows which fields were filled

## Data Privacy & Security

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics
- You have full control over your information
- Easy to clear all data anytime

## Field Matching Algorithm

The extension uses a weighted scoring system to match form fields:

- **Name Attribute** (40% weight): Checks if field name contains matching keywords
- **ID Attribute** (30% weight): Analyzes HTML ID for field type
- **Placeholder Text** (20% weight): Reads placeholder hints
- **Type Attribute** (10% weight): Uses HTML input types (email, tel)

Minimum confidence threshold: 20%

## Supported Form Fields

| Field Type | Patterns Recognized |
|------------|--------------------|
| Full Name | name, fullname, full-name, username, applicant-name |
| Email | email, e-mail, email-address, mail, user-email |
| Phone | phone, telephone, mobile, cell, phone-number, contact |
| Address | address, street, location, mailing-address |
| Resume | resume, cv, portfolio, resume-link |
| LinkedIn | linkedin, linkedin-profile, linkedin-url |
| GitHub | github, github-profile, github-url |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+F (Windows/Linux) | Fill all forms on page |
| Cmd+Shift+F (Mac) | Fill all forms on page |

## Known Limitations

- Does not fill password-protected fields
- May not work on some websites with custom form implementations
- Requires explicit user action (button click or keyboard shortcut)
- Does not fill checkbox, radio button, or select dropdown fields (can be added in future versions)

## Future Enhancements

- [ ] Support for checkbox and radio button fields
- [ ] Multiple saved profiles (work, personal, etc.)
- [ ] Export/Import settings
- [ ] Autofill selective fields with user confirmation
- [ ] Support for textarea and select elements
- [ ] Custom field mapping
- [ ] Browser sync across devices
- [ ] Dark mode optimization

## Troubleshooting

### Extension doesn't appear in toolbar
- Refresh the Chrome extensions page (`chrome://extensions/`)
- Ensure Developer mode is enabled
- Try uninstalling and reinstalling the extension

### Forms are not being detected
- The website may have custom form implementations
- Try using the keyboard shortcut manually
- Check console for any errors (F12 → Console)

### Saved data not persisting
- Clear your browser cache and reload the extension
- Check Chrome permissions for the extension
- Try saving the data again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Vivek Sawji** - [@vivekx11](https://github.com/vivekx11)

## Support

If you encounter any issues or have suggestions, please:
- Open an [Issue](https://github.com/vivekx11/autofillChromeExtension/issues)
- Create a [Discussion](https://github.com/vivekx11/autofillChromeExtension/discussions)
- Contact: Check GitHub profile for contact information

## Acknowledgments

- Chrome Extension API Documentation
- Community feedback and suggestions
- All contributors and users

---

**Made with ❤️ by Vivek Sawji**
