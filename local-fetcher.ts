import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

const TWITTER_SW_URL = 'https://x.com/sw.js';
const PUBLIC_DIR = 'public';
const RAW_OUTPUT_FILE = path.join(PUBLIC_DIR, 'raw-twitter-feature-flags.json');
const PROCESSED_OUTPUT_FILE = path.join(PUBLIC_DIR, 'twitter-feature-flags.json');
const GIT_OUTPUT_FILE = 'twitter-feature-flags.json';

interface FeatureFlagsOutput {
    timestamp?: string;
    manifestUrl: string;
    featureFlags: any;
}

async function commitAndPush(timestamp: string) {
    try {
        execSync(`git add ${GIT_OUTPUT_FILE}`);
        execSync(`git commit -m "Update feature flags - ${timestamp}"`);
        execSync('git push origin main');
        console.log('Successfully committed and pushed changes to git');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error pushing to git:', error.message);
        } else {
            console.error('An unknown error occurred while pushing:', error);
        }
    }
}

async function extractFeatureSwitchManifestUrl(swContent: string): Promise<string | null> {
    const assetsMatch = swContent.match(/self\.ASSETS\s*=\s*(\[[\s\S]*?\])/);
    if (!assetsMatch) return null;

    try {
        const assetsString = assetsMatch[1].replace(/'/g, '"');
        const assets: string[] = JSON.parse(assetsString);
        const manifestUrl = assets.find(url => url.includes('feature-switch-manifest'));
        return manifestUrl || null;
    } catch (error) {
        console.error('Error parsing ASSETS:', error);
        return null;
    }
}

async function writeFeatureFlags(filePath: string, data: FeatureFlagsOutput): Promise<void> {
    await fs.writeFile(
        path.join(process.cwd(), filePath),
        JSON.stringify(data, null, 2)
    );
}

async function fetchFeatureFlags(shouldCommit: boolean = false): Promise<void> {
    try {
        // Create public directory if it doesn't exist
        await fs.mkdir(PUBLIC_DIR, { recursive: true });

        // Fetch service worker content
        const swResponse = await axios.get(TWITTER_SW_URL);
        const manifestUrl = await extractFeatureSwitchManifestUrl(swResponse.data);
        
        if (!manifestUrl) {
            throw new Error('Feature switch manifest URL not found');
        }

        // Fetch feature flags manifest
        const manifestResponse = await axios.get(manifestUrl);
        const featureFlags = manifestResponse.data;
        const timestamp = new Date().toISOString();
        
        // Save raw version with timestamp
        const rawOutput: FeatureFlagsOutput = {
            timestamp,
            manifestUrl,
            featureFlags
        };
        await writeFeatureFlags(RAW_OUTPUT_FILE, rawOutput);

        // Save processed version without timestamp
        const processedOutput: FeatureFlagsOutput = {
            manifestUrl,
            featureFlags
        };
        await writeFeatureFlags(PROCESSED_OUTPUT_FILE, processedOutput);

        // If git operations are requested, save and commit the file
        if (shouldCommit) {
            await writeFeatureFlags(GIT_OUTPUT_FILE, rawOutput);
            await commitAndPush(timestamp);
        }

        console.log(`[${timestamp}] Feature flags updated from ${manifestUrl}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching feature flags:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

// Run the fetcher
// Set to true to enable git operations
fetchFeatureFlags(false); 