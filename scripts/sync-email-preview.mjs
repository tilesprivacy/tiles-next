#!/usr/bin/env node

import { readFileSync, writeFileSync, watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const routeFile = join(projectRoot, 'app/api/subscribe/route.ts');
const previewFile = join(projectRoot, 'email-preview.html');

function extractHtmlFromRoute() {
  try {
    const content = readFileSync(routeFile, 'utf-8');
    
    // Find the html template literal - look for `html: \`` pattern
    const htmlMatch = content.match(/html:\s*`([\s\S]*?)`\s*,/);
    
    if (!htmlMatch) {
      console.error('❌ Could not find HTML template in route.ts');
      return false;
    }
    
    const htmlContent = htmlMatch[1];
    
    // Write to preview file
    writeFileSync(previewFile, htmlContent, 'utf-8');
    console.log('✅ Updated email-preview.html');
    return true;
  } catch (error) {
    console.error('❌ Error syncing email preview:', error.message);
    return false;
  }
}

function watchForChanges() {
  console.log('👀 Watching for changes to route.ts...');
  console.log('   Press Ctrl+C to stop\n');
  
  // Initial sync
  extractHtmlFromRoute();
  
  // Watch the route file
  watch(routeFile, { encoding: 'utf-8' }, (eventType) => {
    if (eventType === 'change') {
      // Small delay to ensure file write is complete
      setTimeout(() => {
        extractHtmlFromRoute();
      }, 100);
    }
  });
}

// Check if watch mode is requested
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

if (watchMode) {
  watchForChanges();
} else {
  extractHtmlFromRoute();
}
