import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const TWITTER_SW_URL = 'https://x.com/sw.js';
const OUTPUT_FILE = 'twitter-feature-flags.json';
const FETCH_INTERVAL = 5000; // 5 seconds

async function extractFeatureSwitchManifestUrl(swContent: string): Promise<string | null> {
    // Look for ASSETS array in the service worker content
    const assetsMatch = swContent.match(/self\.ASSETS\s*=\s*(\[[\s\S]*?\])/);
    if (!assetsMatch) return null;

    try {
        // Parse the ASSETS array
        const assetsString = assetsMatch[1].replace(/'/g, '"'); // Replace single quotes with double quotes
        const assets: string[] = JSON.parse(assetsString);

        // Find the feature-switch-manifest URL
        const manifestUrl = assets.find(url => url.includes('feature-switch-manifest'));
        return manifestUrl || null;
    } catch (error) {
        console.error('Error parsing ASSETS:', error);
        return null;
    }
}

async function fetchFeatureFlags(): Promise<void> {
    try {
        // Fetch service worker content
        const swResponse = await axios.get(TWITTER_SW_URL);
        const manifestUrl = await extractFeatureSwitchManifestUrl(swResponse.data);
        
        if (!manifestUrl) {
            throw new Error('Feature switch manifest URL not found');
        }

        // Fetch feature flags manifest
        const manifestResponse = await axios.get(manifestUrl);
        const featureFlags = manifestResponse.data;

        // Save to file with timestamp
        const timestamp = new Date().toISOString();
        const output = {
            timestamp,
            manifestUrl,
            featureFlags
        };

        await fs.writeFile(
            path.join(process.cwd(), OUTPUT_FILE),
            JSON.stringify(output, null, 2)
        );

        console.log(`[${timestamp}] Feature flags updated from ${manifestUrl}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching feature flags:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

// Initial fetch
fetchFeatureFlags();

// Set up periodic fetching
setInterval(fetchFeatureFlags, FETCH_INTERVAL);

console.log(`Feature flags fetcher started. Checking every ${FETCH_INTERVAL/1000} seconds...`); 