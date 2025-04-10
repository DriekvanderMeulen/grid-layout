# Figma Grid Overlay Chrome Extension

A Chrome extension that adds a configurable grid overlay to any webpage, similar to Figma's layout grid functionality. Perfect for web developers and designers who want to ensure their layouts match design specifications.

## Features

- 🎯 Configurable columns and rows
- 📏 Adjustable gutters
- 🎨 Custom colors with opacity control
- 📐 Stretch or fixed layout types
- 🔄 Real-time updates
- 💾 Persistent settings

## Installation

1. Clone this repository or download the files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the directory containing the extension files

## Usage

1. Click the extension icon in your Chrome toolbar to open the configuration panel
2. Adjust the grid settings:
   - Grid Size: Base size for the grid
   - Columns: Number of vertical grid lines
   - Column Type: Choose between 'Stretch' or 'Fixed'
   - Column Gutter: Space between columns
   - Rows: Number of horizontal grid lines
   - Row Type: Choose between 'Stretch' or 'Fixed'
   - Row Gutter: Space between rows
   - Grid Color: Color of the grid lines
   - Opacity: Transparency of the grid lines
3. Click "Toggle Grid" to show/hide the overlay

## Development

### File Structure

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Configuration interface
- `popup.js` - Configuration logic and messaging
- `content.js` - Grid overlay implementation
- `styles.css` - Additional styling

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test the changes on any webpage

To test specific features:

1. Grid Toggle
   - Click the extension icon
   - Click "Toggle Grid"
   - Verify the grid appears/disappears

2. Settings Persistence
   - Adjust grid settings
   - Close and reopen the popup
   - Verify settings are preserved

3. Real-time Updates
   - Show the grid
   - Change settings
   - Verify grid updates immediately

4. Cross-page Functionality
   - Enable grid on one page
   - Navigate to another page
   - Verify grid state and settings persist

### Common Issues

1. Grid not showing
   - Check if the extension has permission for the current page
   - Verify the toggle button is working
   - Check browser console for errors

2. Settings not saving
   - Ensure Chrome storage permission is granted
   - Check if other extensions are conflicting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this in your own projects! 