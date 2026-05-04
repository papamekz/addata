# Urban Impact Dashboard

This is the web-based visualization for the `addata` dataset.

## How to View
Because the dashboard fetches the JSON data from the `data/` directory, modern browsers will block the request if you open `index.html` directly (CORS policy).

To view the dashboard, please serve the repository via a local web server:

### Option 1: Python (Recommended)
Run this command in the root of the repository:
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000/web/`

### Option 2: VS Code
If you have the **Live Server** extension, right-click `web/index.html` and select **"Open with Live Server"**.

## Features
- **Real-time Filter**: Filter by impact category.
- **Global Search**: Search by institution, title, or tags.
- **Sorting**: Sort by impact score or ID.
- **Detail View**: Click on any card to see full metadata and source links.
