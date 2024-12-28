# Grok Static Files Tracker

This tool fetches and tracks changes in the static files from Grok's website.

## Usage

1. Install dependencies:
```bash
npm install
```

2. Run the fetcher:
```bash
npx ts-node local-fetcher.ts
```

The script will:
- Fetch all static files from Grok's website
- Store them in the `codebase/static` directory
- Log the process and any errors that occur

You can run this periodically to track changes in Grok's static files.