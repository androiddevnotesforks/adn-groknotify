import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const GROK_BASE_URL = 'https://grok.com';
const OUTPUT_DIR = path.join(__dirname, 'codebase', 'static');

// Comprehensive regex patterns for all static file types
const STATIC_FILE_PATTERNS = [
    // Next.js static files in various directories
    /_next\/static\/(?:chunks|css|media|images|fonts|assets)\/[^"'\s]+?\.[a-zA-Z0-9]+(?:\?[^"'\s]*)?/g,
    
    // CSS files
    /_next\/static\/css\/[^"'\s]+?\.css(?:\?[^"'\s]*)?/g,
    
    // Image files
    /_next\/static\/(?:media|images)\/[^"'\s]+?\.(?:png|jpg|jpeg|gif|svg|webp|ico)(?:\?[^"'\s]*)?/g,
    
    // Font files
    /_next\/static\/(?:media|fonts)\/[^"'\s]+?\.(?:woff|woff2|eot|ttf|otf)(?:\?[^"'\s]*)?/g,
    
    // JavaScript files
    /_next\/static\/(?:chunks|js)\/[^"'\s]+?\.js(?:\?[^"'\s]*)?/g,
    
    // JSON files
    /_next\/static\/[^"'\s]+?\.json(?:\?[^"'\s]*)?/g,
    
    // Catch-all for any other static files
    /_next\/static\/[^"'\s]+?\/[^"'\s]+?\.[\w]+(?:\?[^"'\s]*)?/g
];

async function ensureDirectoryExists(filePath: string) {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
}

async function saveFile(filePath: string, content: string | object) {
    // Remove query parameters from the file path
    const cleanFilePath = filePath.replace(/\?.*$/, '');
    const fullPath = path.join(OUTPUT_DIR, cleanFilePath.replace(/^\//, ''));
    await ensureDirectoryExists(fullPath);
    
    // Handle binary files (images, fonts, etc.)
    const isBinaryFile = /\.(png|jpg|jpeg|gif|webp|ico|woff|woff2|eot|ttf|otf)$/i.test(cleanFilePath);
    
    if (isBinaryFile) {
        // For binary files, get the response as arraybuffer
        const response = await axios.get(`${GROK_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`, {
            responseType: 'arraybuffer'
        });
        await fs.writeFile(fullPath, Buffer.from(response.data));
    } else {
        // For text files
        await fs.writeFile(
            fullPath,
            typeof content === 'string' ? content : JSON.stringify(content, null, 2)
        );
    }
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
            try {
                const fileUrl = `${GROK_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
                
                // Check if it's a binary file
                const isBinaryFile = /\.(png|jpg|jpeg|gif|webp|ico|woff|woff2|eot|ttf|otf)$/i.test(filePath);
                
                if (!isBinaryFile) {
                    const fileResponse = await axios.get(fileUrl);
                    await saveFile(filePath, fileResponse.data);
                } else {
                    // Binary files are handled directly in saveFile
                    await saveFile(filePath, '');
                }
                
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