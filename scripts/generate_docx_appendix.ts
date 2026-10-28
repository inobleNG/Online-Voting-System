import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} from 'docx';

// List of project files to include in the appendix
const SOURCE_FILES = [
  {
    path: 'src/types/index.ts',
    category: '1. Domain Models & Types',
    description: 'Data models for Electors, Ballots, Candidates, Gazetted Elections, and Cryptographic Audit Logs.'
  },
  {
    path: 'src/lib/crypto.ts',
    category: '2. Cryptographic Security Engine',
    description: 'SHA-256 Zero-Knowledge hashing, Merkle Tree construction, and cryptographic receipt proof verification.'
  },
  {
    path: 'src/context/AuthContext.tsx',
    category: '3. Authentication & RBAC Context',
    description: 'User state, role switching between Voter / INEC / Auditor, and two-factor authentication (2FA).'
  },
  {
    path: 'src/context/ElectionContext.tsx',
    category: '4. Election & Ballot State Management',
    description: 'State store for active elections, candidate registries, casting secret ballots, and real-time tallies.'
  },
  {
    path: 'src/lib/databaseSchemaSql.ts',
    category: '5. Database Architecture & Schema',
    description: 'Relational PostgreSQL schema defining tables for polling units, voter accreditation, and audit blocks.'
  },
  {
    path: 'src/components/voter/VotingBooth.tsx',
    category: '6. Citizen Voting Booth Component',
    description: 'Secure, secret balloting booth with PIN authorization, validation, and zero-knowledge encryption.'
  },
  {
    path: 'src/components/voter/VoterDashboard.tsx',
    category: '7. Voter Portal & PVC Accreditation',
    description: 'Citizen accreditation status, digital Permanent Voter Card (PVC), and active election selector.'
  },
  {
    path: 'src/components/voter/VerifyReceiptPortal.tsx',
    category: '8. Cryptographic Receipt Validator',
    description: 'End-to-End Verifiable (E2E-V) tool allowing electors to verify their ballot inclusion in the Merkle root.'
  },
  {
    path: 'src/components/voter/VoterPortalLogin.tsx',
    category: '9. Three-Tier Role Portal Access',
    description: 'Streamlined authentication interface supporting Citizen Voter, INEC Commission, and Independent Audit.'
  },
  {
    path: 'src/components/admin/AdminDashboard.tsx',
    category: '10. INEC Command Center Dashboard',
    description: 'National and state election supervisory dashboard, telemetry indicators, and emergency controls.'
  },
  {
    path: 'src/components/admin/CandidateManager.tsx',
    category: '11. Candidate & Manifesto Management',
    description: 'Accreditation of political party candidates, manifesto documentation, and ballot position setup.'
  },
  {
    path: 'src/components/admin/VoterRollManager.tsx',
    category: '12. National Voter Register (Roll)',
    description: 'Accreditation ledger, polling unit filtering, voter card generation, and register freeze controls.'
  },
  {
    path: 'src/components/admin/AuditLogViewer.tsx',
    category: '13. Tamper-Evident Audit Trail Viewer',
    description: 'Cryptographic block viewer verifying SHA-256 hash chaining and tamper-evident administrative logs.'
  },
  {
    path: 'src/components/results/ResultsAnalytics.tsx',
    category: '14. Real-time Election Collation & Results',
    description: 'Real-time vote tallies, turnout percentages, and state-by-state geographic distribution.'
  },
  {
    path: 'src/components/layout/Navbar.tsx',
    category: '15. Application Navigation & Portal Header',
    description: 'Simplified top navigation with user role indicators, appendix export, and quick actions.'
  },
  {
    path: 'src/components/layout/Sidebar.tsx',
    category: '16. Role-Based Sidebar Navigation',
    description: 'Dedicated portal navigation for Voter, INEC Commission, and Independent Audit sections.'
  },
  {
    path: 'src/App.tsx',
    category: '17. Application Root Component',
    description: 'Top-level routing and state coordination between Voter, INEC, and Audit portals.'
  },
  {
    path: 'src/main.tsx',
    category: '18. Application Entry Point',
    description: 'React 19 bootstrap and DOM mount point.'
  }
];

async function generateDocx() {
  console.log('Generating MS Word Source Code Appendix document...');

  const rootDir = process.cwd();
  const children: (Paragraph | Table)[] = [];

  // ==================== COVER / TITLE PAGE ====================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
      children: [
        new TextRun({
          text: 'FEDERAL REPUBLIC OF NIGERIA',
          bold: true,
          size: 28,
          color: '008751',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400 },
      children: [
        new TextRun({
          text: 'INDEPENDENT NATIONAL ELECTORAL COMMISSION (INEC)',
          bold: true,
          size: 22,
          color: '333333',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: 'FINAL YEAR / SCHOOL PROJECT TECHNICAL REPORT',
          bold: true,
          size: 24,
          color: '2563EB',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 300 },
      children: [
        new TextRun({
          text: 'APPENDIX: COMPLETE SYSTEM SOURCE CODE',
          bold: true,
          size: 36,
          color: '111827',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 600 },
      children: [
        new TextRun({
          text: 'SECURE CRYPTOGRAPHIC ELECTRONIC VOTING SYSTEM (EVS)',
          italics: true,
          size: 24,
          color: '4B5563',
          font: 'Arial'
        })
      ]
    })
  );

  // Overview Table
  const overviewRows = [
    ['Project Title', 'Cryptographically Verifiable Electronic Voting System (EVS)'],
    ['Core Architecture', '3 Integrated Portals: Citizen Voter • INEC Commission • Independent Audit'],
    ['Security Model', 'SHA-256 Zero-Knowledge Hashing, Merkle Tree Inclusion Proofs, 2FA PINs'],
    ['Frontend Framework', 'React 19, TypeScript 5.8, Tailwind CSS, Lucide Icons, Vite'],
    ['Document Type', 'Academic Project Source Code Listing Appendix (MS Word .docx)'],
    ['Date Generated', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })]
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: overviewRows.map(([label, val]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: 20, font: 'Arial' })]
                })
              ]
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: val, size: 20, font: 'Arial' })]
                })
              ]
            })
          ]
        })
      )
    }),
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS - SOURCE CODE MODULES',
          bold: true,
          size: 26,
          color: '008751',
          font: 'Arial'
        })
      ]
    })
  );

  // Table of Contents entries
  SOURCE_FILES.forEach((file, index) => {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: `${index + 1}. ${file.category}`,
            bold: true,
            size: 20,
            font: 'Arial'
          }),
          new TextRun({
            text: ` (${file.path})\n   ${file.description}`,
            size: 18,
            color: '555555',
            font: 'Arial'
          })
        ]
      })
    );
  });

  children.push(
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: 'DETAILED SOURCE CODE LISTINGS',
          bold: true,
          size: 26,
          color: '008751',
          font: 'Arial'
        })
      ]
    })
  );

  // Add each source file
  for (let i = 0; i < SOURCE_FILES.length; i++) {
    const file = SOURCE_FILES[i];
    const fullPath = path.join(rootDir, file.path);

    let content = '';
    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      console.warn(`Could not read ${fullPath}:`, err);
      content = `// File not found: ${file.path}`;
    }

    const lines = content.split('\n');

    // Section Header
    children.push(
      new Paragraph({
        spacing: { before: 400, after: 100 },
        children: [
          new TextRun({
            text: `Module ${i + 1}: ${file.category}`,
            bold: true,
            size: 22,
            color: '008751',
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        spacing: { before: 50, after: 80 },
        children: [
          new TextRun({
            text: `File Path: `,
            bold: true,
            size: 18,
            font: 'Arial'
          }),
          new TextRun({
            text: file.path,
            bold: true,
            color: '1D4ED8',
            size: 18,
            font: 'Courier New'
          }),
          new TextRun({
            text: `  |  Lines: ${lines.length}`,
            size: 18,
            color: '6B7280',
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: file.description,
            italics: true,
            size: 18,
            color: '4B5563',
            font: 'Arial'
          })
        ]
      })
    );

    // Code Table with light shading and monospace font
    // Chunk lines for docx performance (every 25 lines or line by line in table)
    const codeParagraphs: Paragraph[] = [];
    
    // Group lines into manageable chunks for cleaner document rendering
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const lineNumStr = String(lineIdx + 1).padStart(4, ' ');
      const lineContent = lines[lineIdx];

      codeParagraphs.push(
        new Paragraph({
          spacing: { before: 0, after: 0, line: 240 },
          children: [
            new TextRun({
              text: `${lineNumStr} | `,
              color: '9CA3AF',
              size: 16,
              font: 'Courier New'
            }),
            new TextRun({
              text: lineContent || ' ',
              color: '1F2937',
              size: 16,
              font: 'Courier New'
            })
          ]
        })
      );
    }

    // Wrap code in a shaded container table
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: 'F9FAFB' },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: codeParagraphs
              })
            ]
          })
        ]
      }),
      new Paragraph({
        spacing: { before: 150, after: 250 },
        children: [
          new TextRun({
            text: `--- End of ${file.path} ---`,
            italics: true,
            size: 16,
            color: '9CA3AF',
            font: 'Arial'
          })
        ]
      })
    );
  }

  // Create the Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'E-Voting System Project (EVS) — Appendix: Source Code',
                    size: 16,
                    color: '9CA3AF',
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 16,
                    color: '6B7280',
                    font: 'Arial'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '6B7280',
                    font: 'Arial'
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: '6B7280',
                    font: 'Arial'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '6B7280',
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        },
        children
      }
    ]
  });

  // Ensure public directory exists
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Electronic_Voting_System_Source_Code_Appendix.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`Successfully generated: ${outputPath} (${buffer.length} bytes)`);
}

generateDocx().catch((err) => {
  console.error('Failed to generate docx appendix:', err);
  process.exit(1);
});
