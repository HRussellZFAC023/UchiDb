# JPDB Uchisen Image Inserter

A Tampermonkey userscript that automatically fetches and displays Uchisen visual mnemonics on JPDB kanji pages and during reviews.

## Features

- 🎨 **Visual Mnemonics**: Automatically displays Uchisen's visual mnemonic images for kanji
- 📖 **Story Integration**: Shows the accompanying mnemonic story
- 🌙 **Theme Compatible**: Seamlessly blends with JPDB's light and dark themes
- 🔄 **Review Support**: Works on both individual kanji pages and during review sessions
- 🚀 **Fast Loading**: Uses blob URLs to bypass CSP restrictions for quick image loading

## Installation

### Method 1: Direct Install (Recommended)

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click this link to install the script: **[Install JPDB Uchisen Image Inserter](https://raw.githubusercontent.com/YOUR_USERNAME/jpdb-uchisen-userscript/main/jpdb-uchisen-userscript.js)**
3. Click "Install" when Tampermonkey opens

### Method 2: Manual Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Download `jpdb-uchisen-userscript.js` from this repository
3. Open Tampermonkey Dashboard
4. Click "Create a new script"
5. Replace the default content with the downloaded script
6. Save (Ctrl+S)

## How It Works

The script automatically:

1. **Detects Kanji**: Extracts kanji characters from JPDB URLs or review sessions
2. **Fetches Uchisen Data**: Retrieves the corresponding mnemonic image and story from Uchisen.com
3. **Seamless Integration**: Inserts the content into JPDB's mnemonic section with native styling

## Supported Pages

- ✅ Individual kanji pages (`https://jpdb.io/kanji/犬`)
- ✅ Review sessions (`https://jpdb.io/review`)
- ✅ Both light and dark themes

## Preview

The script adds visual mnemonics that look like native JPDB content:

- High-quality mnemonic images from Uchisen
- Accompanying story text for better memorization
- Direct link to view the full Uchisen page

## Technical Details

### Permissions Required

The script requires connection to:
- `uchisen.com` - To fetch mnemonic data
- `ik.imagekit.io` - To load mnemonic images

### Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Edge

## Troubleshooting

### Images Not Loading
- Ensure both `uchisen.com` and `ik.imagekit.io` are in the script's `@connect` list
- Check that Tampermonkey has permission to access these domains

### Script Not Running
- Verify the script is enabled in Tampermonkey Dashboard
- Check that you're on a supported JPDB page
- Look for error messages in the browser console (F12)

### No Mnemonic Found
- Not all kanji have mnemonics on Uchisen.com
- The script will log "No image found for kanji: X" in the console for missing mnemonics

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

1. Clone this repository
2. Install the script in Tampermonkey for testing
3. Make your changes
4. Test on JPDB pages
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [JPDB](https://jpdb.io/) - Japanese learning platform
- [Uchisen](https://uchisen.com/) - Visual mnemonic provider
- [Tampermonkey](https://www.tampermonkey.net/) - Userscript manager

## Changelog

### v1.0.0
- Initial release
- Support for kanji pages and reviews
- Theme-compatible styling
- Blob URL image loading for CSP bypass
