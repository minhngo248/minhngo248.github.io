#!/usr/bin/env node

/**
 * Build-time script to generate lists of blog and project files
 * Run this before building: node scripts/generate-file-list.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const blogsDir = path.join(projectRoot, 'public', 'blogs');
const projectsDir = path.join(projectRoot, 'public', 'projects');
const outputDir = path.join(projectRoot, 'src', 'data');

/**
 * Scans a directory and returns all markdown files
 */
function scanMarkdownFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.warn(`Directory does not exist: ${dir}`);
      return [];
    }

    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.md')).sort();
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
    return [];
  }
}

/**
 * Generates the file list data
 */
function generateFileLists() {
  console.log('Scanning for markdown files...\n');

  // Scan blogs
  const blogFiles = scanMarkdownFiles(blogsDir);
  console.log(`Found ${blogFiles.length} blog file(s):`);
  blogFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');

  // Scan projects
  const projectFiles = scanMarkdownFiles(projectsDir);
  console.log(`Found ${projectFiles.length} project file(s):`);
  projectFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate blog file list
  const blogListContent = `/**
 * Auto-generated list of blog files
 * Generated on: ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY - Run 'npm run generate-files' to update
 */

export const blogFiles = ${JSON.stringify(blogFiles, null, 2)};
`;

  // Generate project file list
  const projectListContent = `/**
 * Auto-generated list of project files
 * Generated on: ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY - Run 'npm run generate-files' to update
 */

export const projectFiles = ${JSON.stringify(projectFiles, null, 2)};
`;

  // Write files
  const blogListPath = path.join(outputDir, 'blogFiles.js');
  const projectListPath = path.join(outputDir, 'projectFiles.js');

  fs.writeFileSync(blogListPath, blogListContent);
  fs.writeFileSync(projectListPath, projectListContent);

  console.log('File lists generated successfully!');
  console.log(`  - ${blogListPath}`);
  console.log(`  - ${projectListPath}`);
  console.log('\nYou can now import these files in your utils.');
}

// Run the script
try {
  generateFileLists();
  process.exit(0);
} catch (error) {
  console.error('Error generating file lists:', error);
  process.exit(1);
}
