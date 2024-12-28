# Twitter Feature Flags Tracker

This repository tracks Twitter's feature flags over time using GitHub Actions.

## How it works

- GitHub Actions runs every 5 minutes
- Fetches the latest feature flags from Twitter
- Stores the results in the `data` branch
- Each update creates a new commit with timestamp

## Setup

1. Create a new GitHub repository
2. Clone the repository locally
3. Copy all files into the repository
4. Push to GitHub:

```bash
git ad
```

## Accessing the data

The latest feature flags can be found in `twitter-feature-flags.json` in the `data` branch.

## Running locally 

```bash
npm install
npm run start
```

```
# First time setup
npm install

# Fetch the latest flags
npm run fetch

# Start the local server
npm run serve
```

To set this up:

1. Create a new GitHub repository
2. Push all these files to the main branch
3. Enable GitHub Actions in your repository settings
4. The action will automatically create a `data` branch and start tracking feature flags

The feature flags will be stored in the `data` branch and updated every 5 minutes. You can access the latest flags by checking the `twitter-feature-flags.json` file in the `data` branch.

Some additional notes:
- GitHub Actions is free for public repositories
- You might want to adjust the cron schedule based on your needs
- The history of all changes will be preserved in git commits
- You can manually trigger the workflow using the "Actions" tab in GitHub

## Deployment

### Netlify
1. Connect your repository to Netlify
2. Set the publish directory to `public`
3. Deploy!

### Vercel
1. Import your repository to Vercel
2. The project should be automatically configured
3. Deploy!

The site will automatically update whenever the feature flags are updated.

Would you like me to explain any part of this setup in more detail?