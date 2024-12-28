import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const GROK_BASE_URL = 'https://grok.com/_next/static/chunks';
const OUTPUT_DIR = path.join(__dirname, 'codebase', 'static');

async function fetchStaticFiles() {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Fetch the HTML of the main page to extract static file references
        const response = await axios.get('https://grok.com');
        const html = response.data as string;

        // Extract static file paths using regex
        const staticFileRegex = /_next\/static\/chunks\/[^"]+\.js/g;
        const matches = html.match(staticFileRegex) || [];
        const uniqueFiles = [...new Set(matches)];

        console.log(`Found ${uniqueFiles.length} unique static files`);

        // Fetch each file
        for (const filePath of uniqueFiles) {
            const fileName = path.basename(filePath as string);
            const fileUrl = `https://grok.com/${filePath}`;
            
            try {
                const fileResponse = await axios.get(fileUrl);
                const content = fileResponse.data;
                
                await fs.writeFile(
                    path.join(OUTPUT_DIR, fileName),
                    typeof content === 'string' ? content : JSON.stringify(content)
                );
                
                console.log(`Successfully downloaded: ${fileName}`);
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error(`Failed to fetch ${fileName}:`, error.message);
                } else if (error instanceof Error) {
                    console.error(`Error processing ${fileName}:`, error.message);
                } else {
                    console.error(`Unknown error while fetching ${fileName}`);
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