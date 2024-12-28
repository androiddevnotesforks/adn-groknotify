import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const GROK_BASE_URL = 'https://grok.com';
const OUTPUT_DIR = path.join(__dirname, 'codebase', 'static');

// Comprehensive regex patterns for all file types
const FILE_PATTERNS = [
    // Next.js static files
    /_next\/static\/(?:chunks|css|media|images|fonts|assets)\/[^"'\s]+?\.[a-zA-Z0-9]+(?:\?[^"'\s]*)?/g,
    
    // Root level files and assets
    /(?:\/|https?:\/\/grok\.com\/)[^"'\s]+?\.[a-zA-Z0-9]+(?:\?[^"'\s]*)?/g,
    
    // CSS files (both static and root)
    /(?:_next\/static\/css|css)\/[^"'\s]+?\.css(?:\?[^"'\s]*)?/g,
    
    // Image files (both static and root)
    /(?:_next\/static\/(?:media|images)|images?)\/[^"'\s]+?\.(?:png|jpg|jpeg|gif|svg|webp|ico|avif)(?:\?[^"'\s]*)?/g,
    
    // Font files
    /(?:_next\/static\/(?:media|fonts)|fonts)\/[^"'\s]+?\.(?:woff|woff2|eot|ttf|otf)(?:\?[^"'\s]*)?/g,
    
    // JavaScript files (both static and root)
    /(?:_next\/static\/(?:chunks|js)|js)\/[^"'\s]+?\.js(?:\?[^"'\s]*)?/g,
    
    // JSON files
    /[^"'\s]+?\.json(?:\?[^"'\s]*)?/g,
    
    // Meta files in root
    /(?:favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json)(?:\?[^"'\s]*)?/g,
    
    // Assets in root directory
    /\/(?:assets|public)\/[^"'\s]+?\.[a-zA-Z0-9]+(?:\?[^"'\s]*)?/g
];

async function ensureDirectoryExists(filePath: string) {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
}

async function cleanUrl(url: string): Promise<string> {
    // Remove the domain if present
    url = url.replace(/https?:\/\/grok\.com\/?/, '/');
    // Ensure the path starts with /
    if (!url.startsWith('/')) {
        url = '/' + url;
    }
    return url;
}

async function saveFile(filePath: string, content: string | object) {
    // Remove query parameters and clean the URL
    const cleanFilePath = (await cleanUrl(filePath)).replace(/\?.*$/, '');
    const fullPath = path.join(OUTPUT_DIR, cleanFilePath.replace(/^\//, ''));
    await ensureDirectoryExists(fullPath);
    
    // Handle binary files (images, fonts, etc.)
    const isBinaryFile = /\.(png|jpg|jpeg|gif|webp|ico|avif|woff|woff2|eot|ttf|otf)$/i.test(cleanFilePath);
    
    try {
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
        return true;
    } catch (error) {
        console.error(`Error saving file ${cleanFilePath}:`, error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}

async function fetchStaticFiles() {
    try {
        // Create base output directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Fetch the HTML of the main page to extract file references
        const response = await axios.get(GROK_BASE_URL);
        const html = response.data as string;

        // Extract all file paths using multiple patterns
        const uniqueFiles = new Set<string>();
        for (const pattern of FILE_PATTERNS) {
            const matches = html.match(pattern) || [];
            for (const match of matches) {
                const cleanMatch = await cleanUrl(match);
                uniqueFiles.add(cleanMatch);
            }
        }

        console.log(`Found ${uniqueFiles.size} unique files`);

        // Fetch each file
        let successCount = 0;
        let failCount = 0;

        for (const filePath of uniqueFiles) {
            try {
                const fileUrl = `${GROK_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
                
                // Check if it's a binary file
                const isBinaryFile = /\.(png|jpg|jpeg|gif|webp|ico|avif|woff|woff2|eot|ttf|otf)$/i.test(filePath);
                
                if (!isBinaryFile) {
                    const fileResponse = await axios.get(fileUrl);
                    if (await saveFile(filePath, fileResponse.data)) {
                        successCount++;
                        console.log(`Successfully downloaded: ${filePath}`);
                    } else {
                        failCount++;
                    }
                } else {
                    // Binary files are handled directly in saveFile
                    if (await saveFile(filePath, '')) {
                        successCount++;
                        console.log(`Successfully downloaded: ${filePath}`);
                    } else {
                        failCount++;
                    }
                }
            } catch (error) {
                failCount++;
                if (error instanceof AxiosError) {
                    console.error(`Failed to fetch ${filePath}:`, error.message);
                } else if (error instanceof Error) {
                    console.error(`Error processing ${filePath}:`, error.message);
                } else {
                    console.error(`Unknown error while fetching ${filePath}`);
                }
            }
        }

        console.log(`Finished downloading files. Success: ${successCount}, Failed: ${failCount}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching files:', error.message);
        } else {
            console.error('Unknown error occurred while fetching files');
        }
    }
}

// Run the fetcher
fetchStaticFiles(); 