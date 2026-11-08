/**
 * Repeatable script to generate the production PDF resume and public assets
 * from design/source/resume-export.html and design/source/Resume_Nikhil_Sharma_2026-11.docx.
 *
 * Usage: node design/source/generate-resume-pdf.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const htmlSourcePath = path.join(__dirname, 'resume-export.html');
const docxSourcePath = path.join(__dirname, 'Resume_Nikhil_Sharma_2026-11.docx');
const publicResumeDir = path.join(rootDir, 'public/resume');

fs.mkdirSync(publicResumeDir, { recursive: true });

// Copy source docx to public download location
const targetDocx = path.join(publicResumeDir, 'Nikhil_Sharma_Resume.docx');
fs.copyFileSync(docxSourcePath, targetDocx);

const htmlContent = fs.readFileSync(htmlSourcePath, 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(htmlContent, { waitUntil: 'load' });

const targetPdf = path.join(publicResumeDir, 'Nikhil_Sharma_Resume.pdf');
const targetPdfAlias = path.join(publicResumeDir, 'resume.pdf');

await page.pdf({
  path: targetPdf,
  format: 'Letter',
  printBackground: true,
  margin: {
    top: '0.45in',
    bottom: '0.45in',
    left: '0.5in',
    right: '0.5in'
  }
});

fs.copyFileSync(targetPdf, targetPdfAlias);
await browser.close();

console.log('Successfully generated:');
console.log(' - ' + targetPdf);
console.log(' - ' + targetPdfAlias);
console.log(' - ' + targetDocx);
