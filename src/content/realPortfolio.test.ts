import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { portfolioContent, getProjectBySlug, projectsBySlug } from './realPortfolio';

describe('T02: Factual Portfolio Content and Résumé Download', () => {
  describe('Identity and Provenance', () => {
    it('contains verified personal identity without placeholders', () => {
      const { identity, links } = portfolioContent;

      expect(identity.name).toBe('Nikhil Sharma');
      expect(identity.title).toBe('Software & Applied AI Engineer');
      expect(identity.location).toBe('San Jose, CA');
      expect(identity.email).toBe('nikhilmsha@gmail.com');
      expect(identity.portraitUrl).toBeUndefined();

      expect(links.email).toBe('mailto:nikhilmsha@gmail.com');
      expect(links.github).toBe('https://github.com/ni-ms');
      expect(links.linkedin).toBe('https://linkedin.com/in/nikhilmsha');

      // Check absence of generic placeholders in migrated data
      const serialized = JSON.stringify(portfolioContent);
      expect(serialized).not.toContain('YOUR NAME');
      expect(serialized).not.toContain('PROJECT ONE');
      expect(serialized).not.toContain('PROJECT TWO');
      expect(serialized).not.toContain('PROJECT THREE');
      expect(serialized).not.toContain('contact@example.com');
      expect(serialized).not.toContain('Digital Systems Studio');
      expect(serialized).not.toContain('Creative Media Lab');
    });
  });

  describe('Education and Experience Separation', () => {
    it('records CMU expected 2027 and BITS 2024', () => {
      const cmu = portfolioContent.education.find((e) => e.school.includes('Carnegie Mellon'));
      expect(cmu).toBeDefined();
      expect(cmu?.year).toBe('Expected 2027');

      const bits = portfolioContent.education.find((e) => e.school.includes('BITS Pilani'));
      expect(bits).toBeDefined();
      expect(bits?.year).toBe('2024');
    });

    it('distinguishes direct employment from client engagements', () => {
      const techM = portfolioContent.experience.find((e) => e.employer === 'Tech Mahindra');
      expect(techM).toBeDefined();
      expect(techM?.client).toBe('Intuitive Surgical');
      expect(techM?.isClientEngagement).toBe(true);

      const styrone = portfolioContent.experience.find((e) => e.employer === 'Styrone');
      expect(styrone).toBeDefined();
      expect(styrone?.client).toBe('Nationwide Building Society');
      expect(styrone?.isClientEngagement).toBe(true);

      const exeevo = portfolioContent.experience.find((e) => e.employer === 'Exeevo');
      expect(exeevo).toBeDefined();
      expect(exeevo?.client).toBeUndefined();
      expect(exeevo?.isClientEngagement).toBe(false);
    });
  });

  describe('Projects and Qualifiers', () => {
    it('preserves FastCode single-core and primary-workload qualifiers', () => {
      const fastcode = getProjectBySlug('fastcode');
      expect(fastcode).toBeDefined();
      expect(fastcode?.details.baselineMicroseconds).toBe(684);
      expect(fastcode?.details.optimizedMicroseconds).toBe(539);
      expect(fastcode?.details.reductionPercent).toBe(21);
      expect(fastcode?.details.theoreticalSingleCorePeakPercent).toBe(91);
      expect(fastcode?.details.qualifier).toContain('primary benchmark workload');
      expect(fastcode?.url).toBe('https://github.com/ni-ms/18645-yolov8n-optimization');
    });

    it('keeps ScottyPi free of invented repository URL and invented recall figures', () => {
      const scottypi = getProjectBySlug('scottypi');
      expect(scottypi).toBeDefined();
      expect(scottypi?.url).toBeUndefined(); // Absent optional link
      expect(scottypi?.details.passages).toBe(133);
      expect(scottypi?.details.officialCmuSvPages).toBe(20);
      expect(scottypi?.details.evaluationQuestions).toBe(160);
      expect(scottypi?.details.metrics).toEqual(['Recall@1', 'Recall@3', 'MRR']);
      expect(scottypi?.details.qualifier).toContain('no numerical recall or MRR scores supplied');
    });

    it('preserves Langmetric without fictional traction numbers', () => {
      const langmetric = getProjectBySlug('langmetric');
      expect(langmetric).toBeDefined();
      expect(langmetric?.url).toBe('https://langmetric.com/');
      expect(langmetric?.details.implementation).toBeDefined();
      expect(langmetric?.details.qualifier).toContain('no fictional traction');
    });

    it('supports all three project detail slugs in schema lookup', () => {
      expect(projectsBySlug.fastcode.slug).toBe('fastcode');
      expect(projectsBySlug.scottypi.slug).toBe('scottypi');
      expect(projectsBySlug.langmetric.slug).toBe('langmetric');
    });
  });

  describe('Research and Skills', () => {
    it('maintains research in-review status', () => {
      expect(portfolioContent.research.status).toBe('In review');
      expect(portfolioContent.research.venue).toContain('Peer-to-Peer Networking and Applications');
      expect(portfolioContent.research.fullTitle).toContain('Private Federated Aggregation of LLM-Agent Memory');
    });

    it('centralizes skills into structured categories', () => {
      expect(portfolioContent.skills.categories.length).toBeGreaterThanOrEqual(6);
      const languages = portfolioContent.skills.categories.find((c) => c.category === 'Languages');
      expect(languages?.items).toContain('Rust');
      expect(languages?.items).toContain('C/C++');
      expect(languages?.items).toContain('Python');
    });
  });

  describe('Résumé Downloads and Physical Assets', () => {
    it('points to valid download paths and real files on disk', () => {
      const { pdf, docx } = portfolioContent.downloads;

      expect(pdf.url).toBe('/resume/Nikhil_Sharma_Resume.pdf');
      expect(docx.url).toBe('/resume/Nikhil_Sharma_Resume.docx');

      const publicDir = path.resolve(__dirname, '../../public/resume');
      const pdfDiskPath = path.join(publicDir, pdf.filename);
      const docxDiskPath = path.join(publicDir, docx.filename);

      expect(fs.existsSync(pdfDiskPath)).toBe(true);
      expect(fs.existsSync(docxDiskPath)).toBe(true);

      const pdfStats = fs.statSync(pdfDiskPath);
      const docxStats = fs.statSync(docxDiskPath);

      expect(pdfStats.size).toBeGreaterThan(100000); // Visually inspected multi-page PDF
      expect(docxStats.size).toBeGreaterThan(20000); // Reference docx
    });
  });
});
