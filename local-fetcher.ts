import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const GROK_BASE_URL = 'https://grok.com';
const OUTPUT_DIR = path.join(__dirname, 'codebase', 'static');

// Regex patterns for different types of static files
const STATIC_FILE_PATTERNS = [
    /_next\/static\/(?:chunks|css|media|images)\/[^"'\s]+\.[^"'\s]+/g,  // Matches all static file types
    /_next\/static\/[^"'\s]+\/[^"'\s]+\.[^"'\s]+/g,  // Broader pattern to catch other static files
];

async function ensureDirectoryExists(filePath: string) {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
}

async function saveFile(filePath: string, content: string | object) {
    const fullPath = path.join(OUTPUT_DIR, filePath.replace(/^\//, ''));
    await ensureDirectoryExists(fullPath);
    await fs.writeFile(
        fullPath,
        typeof content === 'string' ? content : JSON.stringify(content)
    );
}

async function fetchStaticFiles() {
    try {
        // Create base output directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Fetch the HTML of the main page to extract static file references
        const response = await axios.get(GROK_BASE_URL);
        const html = response.data as string;

        // Extract all static file paths using multiple patterns
        const uniqueFiles = new Set<string>();
        for (const pattern of STATIC_FILE_PATTERNS) {
            const matches = html.match(pattern) || [];
            matches.forEach(match => uniqueFiles.add(match));
        }

        console.log(`Found ${uniqueFiles.size} unique static files`);

        // Fetch each file
        for (const filePath of uniqueFiles) {
            const fileUrl = `${GROK_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
            
            try {
                const fileResponse = await axios.get(fileUrl);
                const content = fileResponse.data;
                
                await saveFile(filePath, content);
                console.log(`Successfully downloaded: ${filePath}`);
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error(`Failed to fetch ${filePath}:`, error.message);
                } else if (error instanceof Error) {
                    console.error(`Error processing ${filePath}:`, error.message);
                } else {
                    console.error(`Unknown error while fetching ${filePath}`);
                }
            }
        }

        console.log('Finished downloading all static files');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching static files:', error.message);
        } else {
            console.error('Unknown error occurred while fetching static files');
        }
    }
}

// Run the fetcher
fetchStaticFiles(); 