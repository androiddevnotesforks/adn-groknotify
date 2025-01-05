import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const CHATGPT_URL = 'https://chatgpt.com';
const CDN_PATTERN = /https:\/\/cdn\.oaistatic\.com\/[^"'\s]+/g;
const OUTPUT_DIR = path.join(__dirname, 'chatgpt-codebase');

const HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-GB,en;q=0.9',
    'cache-control': 'no-cache',
    'dnt': '1',
    'oai-device-id': '1971fa3a-05cc-4fa5-b9b9-3ffe55c1253f',
    'oai-language': 'en-US',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://chatgpt.com/',
    'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'cookie': '__Host-next-auth.csrf-token=c2a15abb63aca18ca7da26b33267781e8506cfa2ab2acb823533eef6bb267370%7Cff27048e45089d2ae5b0c3644efd672cd7932107fac55b71de917701ee7b8845; __Secure-next-auth.callback-url=https%3A%2F%2Fchat-identity-edge-onramp.unified-7.api.openai.com; oai-did=1971fa3a-05cc-4fa5-b9b9-3ffe55c1253f; _cfuvid=eYml0P1M_.4_e9HEdy8ZNn1G.ZONQhII6uQnmaR5lFc-1736033242094-0.0.1.1-604800000; oai-nav-state=1; __cf_bm=5Is0O.WHPqnbfbCrjmks7NAVVmAyuxjT5JpPoXnK0V4-1736038196-1.0.1.1-zkXq1lFGar7k2Uwzx7kaTdWBRvWBhoSUW9XNS3TAD8ej_ddp40H.hpxlFgIiXwN05kiL_om73GCNRe2CnzqcJg; __cflb=0pg1SYKGnsmYmStreiV9z9NAiHLQwi5QetBb37nM; cf_clearance=vLSgudtyIS541fbQYmezMLOkufj6fPSr3HwTdI0vzJs-1736038921-1.2.1.1-BEardu5IDr4e6N29y2iUiJzQ7q.U0.YJLK2xMYrScfhlhRFuBGoBVhVqEQtqZC7R5_UimQt3vKfFD4N0lgVag5prgvc1sXc.ArSMrfvHAtQguZ57jy1PWIFhfhUyMVkFylF0Kp13kdAdIPy2hMmHFX7UAKzAW2TR6vfPvbsBjvexQSf9VsLfDbSGtOatYw59spmVteebTIFcO4eL8B3yXBlfnnXkPg8hsnNFwG9Yd7RQxQJ4scjvy3sJ.._DBohLPI8bou9JkNTVfYz8Dfmg3u1b_L1dmoaPrriM0vqRX7FIAlyYGLW50GlDIKfCRFxxA2DXKFp4bZkLdN9n1MFyKKuD5gLslgvW6dLo2W98ao_CrjJhROIRAX3wWHuIqs2BW2N6YpjUX1_3otxsosmLaA; oai-sc=0gAAAAABnedod-WwxMbPAVF6v9G9xB8UUtjE78tuAj4Ty17jODtfE_SqvZnmcTuzlCsXzXFRo5UdzsRyTT5552YlrOUrOPsBenqb-JsG5ZRNYgsRARd97ng6Ey8KG2mT2F3pU5IUf9yqmFwEsU49ky0koFzOCqtrYNpgOIhLuyS8Jjna7vJ864gGvPh1bxUqAedbJQNXn-rnb9LjWZXeq3o1VwgJM7u7y6m4GMUsJeAJXglMGAe8D9Yg; _dd_s=rum=0&expire=1736039845449&logs=1&id=5eb53d69-ea03-4afd-9a9e-fac813a2e9cb&created=1736038196221'
};

async function ensureDirectoryExists(filePath: string) {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
}

async function saveFile(url: string, content: Buffer) {
    try {
        // Extract the path from the URL and clean it
        const urlPath = new URL(url).pathname;
        const fullPath = path.join(OUTPUT_DIR, urlPath.replace(/^\//, ''));
        
        await ensureDirectoryExists(fullPath);
        await fs.writeFile(fullPath, content);
        
        console.log(`Successfully downloaded: ${url}`);
        return true;
    } catch (error) {
        console.error(`Error saving file from ${url}:`, error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}

async function fetchStaticFiles() {
    try {
        // Create base output directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Fetch the HTML of the main page
        console.log('Fetching ChatGPT main page...');
        const response = await axios.get(CHATGPT_URL, { headers: HEADERS });
        const html = response.data as string;

        // Extract all CDN URLs
        const cdnUrls = new Set<string>();
        const matches = html.match(CDN_PATTERN) || [];
        matches.forEach(match => cdnUrls.add(match));

        console.log(`Found ${cdnUrls.size} unique CDN files`);

        // Fetch each file
        let successCount = 0;
        let failCount = 0;

        for (const url of cdnUrls) {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        ...HEADERS,
                        'Referer': CHATGPT_URL
                    }
                });
                
                if (await saveFile(url, Buffer.from(response.data))) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                failCount++;
                if (error instanceof AxiosError) {
                    console.error(`Failed to fetch ${url}:`, error.message);
                } else if (error instanceof Error) {
                    console.error(`Error processing ${url}:`, error.message);
                } else {
                    console.error(`Unknown error while fetching ${url}`);
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