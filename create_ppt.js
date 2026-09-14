const pptxgen = require('pptxgenjs');
const pptx = new pptxgen();

pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
pptx.layout = 'WIDE';

const BLUE = '1e3a8a';
const ACCENT = '2563eb';
const GREEN = '16a34a';
const WHITE = 'ffffff';
const BLACK = '1f2937';
const GRAY = '6b7280';
const LIGHT = 'eff6ff';

function addBg(slide, color) { slide.background = { color }; }
function addBar(slide, y, h, color) { slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y, w: '100%', h, fill: { color } }); }
function title(slide, text, color = WHITE) { slide.addText(text, { x: 0.5, y: 0.2, w: 12, h: 0.8, fontSize: 36, bold: true, color }); }
function heading(slide, text, x, y, w, h, size = 22, bold = true, color = BLACK) { slide.addText(text, { x, y, w, h, fontSize: size, bold, color }); }
function bullets(slide, items, x, y, w, h, size = 18, color = BLACK) { slide.addText(items.map(t => ({ text: t, options: { fontSize: size, color, bullet: true, paraSpaceAfter: 8 } })), { x, y, w, h, valign: 'top' }); }
function box(slide, x, y, w, h, bgColor, text, textColor = BLACK, textSize = 14) {
  slide.addShape(pptx.shapes.RECTANGLE, { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.1 });
  slide.addText(text, { x, y, w, h, fontSize: textSize, bold: true, color: textColor, align: 'center', valign: 'middle' });
}

// Slide 1 - Title
let s = pptx.addSlide();
addBg(s, BLUE);
addBar(s, 3.2, 0.04, ACCENT);
s.addText('TeamMatch AI', { x: 1, y: 1.5, w: 11, h: 1.5, fontSize: 54, bold: true, color: WHITE, align: 'center' });
s.addText('AI-Powered Platform for Forming Better Project Teams', { x: 1, y: 2.8, w: 11, h: 0.8, fontSize: 24, color: '93c5fd', align: 'center' });
s.addText('Connecting Project Ideas with the Right Students', { x: 1, y: 3.6, w: 11, h: 0.8, fontSize: 20, color: 'bfdbfe', align: 'center' });
s.addText('Presented by: SUGURI SHIVA', { x: 1, y: 5.5, w: 11, h: 0.8, fontSize: 20, color: '93c5fd', align: 'center' });
s.addText('2026', { x: 1, y: 6.2, w: 11, h: 0.6, fontSize: 16, color: '93c5fd', align: 'center' });

// Slide 2 - Problem
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'The Problem');
bullets(s, [
  'Students have project ideas but cannot find the right teammates',
  'Team formation happens through friends, random allocation, or people they already know',
  'Many students have useful skills but don\'t know which projects need them',
  'No systematic way to match students with projects based on skills and interests',
  'Unbalanced teams with duplicate skills and missing capabilities',
  'Wasted time searching for teammates manually',
], 1, 1.8, 11, 5, 20);

// Slide 3 - Solution
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, GREEN);
title(s, 'Our Solution: TeamMatch AI');
bullets(s, ['Direction 1: Project → Student', 'Create a project with requirements', 'AI finds and recommends suitable students', 'Creator invites students to join', 'Students accept or decline invitations'], 1, 1.8, 5.5, 4.5, 17);
bullets(s, ['Direction 2: Student → Project', 'Build a skills and interests profile', 'AI discovers matching projects', 'Student sees match score and reasons', 'Student requests to join a project'], 7, 1.8, 5.5, 4.5, 17);
box(s, 4.5, 1.5, 4.3, 4.5, 'f0fdf4', 'Two-Way Matching\n\nThe core innovation: AI creates connections in BOTH directions between project ideas and students who want to build them.', BLACK, 16);

// Slide 4 - Architecture
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'System Architecture');
box(s, 0.5, 1.8, 3, 1.2, LIGHT, 'React + TypeScript\nFrontend', BLACK, 14);
box(s, 4.5, 1.8, 3, 1.2, 'f3e8ff', 'Tailwind CSS\nStyling', BLACK, 14);
box(s, 8.5, 1.8, 3, 1.2, 'ecfdf5', 'Vite\nBuild Tool', BLACK, 14);
box(s, 2.5, 3.5, 3, 1.2, 'fef3c7', 'Express.js\nBackend API', BLACK, 14);
box(s, 7.5, 3.5, 3, 1.2, 'ffedd5', 'Prisma ORM\nDatabase Layer', BLACK, 14);
box(s, 1.5, 5.2, 3, 1.2, 'dcfce7', 'SQLite\nDatabase', BLACK, 14);
box(s, 5.5, 5.2, 3, 1.2, 'e0f2fe', 'JWT Auth\nAuthentication', BLACK, 14);
box(s, 9.5, 5.2, 3, 1.2, 'fde68a', 'AI Matching\nEngine', BLACK, 14);

// Slide 5 - AI Matching
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'AI Matching Engine');
heading(s, 'Weighted Scoring Algorithm', 1, 1.5, 11, 0.6, 22, true, BLACK);
const scoring = [
  ['Skill Match', '40%', 'Compares project required skills with student skills'],
  ['Interest Match', '20%', 'Matches project domain interests with student interests'],
  ['Role Match', '15%', 'Checks if student preferred role matches project needs'],
  ['Experience Match', '10%', 'Compares experience level (Beginner/Intermediate/Advanced)'],
  ['Availability Match', '10%', 'Checks overlapping available days/hours'],
  ['Learning Goals', '5%', 'Bonus for skills student wants to learn'],
];
scoring.forEach(([name, weight, desc], i) => {
  const y = 2.3 + i * 0.7;
  box(s, 1, y, 2, 0.5, i % 2 === 0 ? ACCENT : '1e40af', `${name}: ${weight}`, WHITE, 13);
  s.addText(desc, { x: 3.3, y, w: 9, h: 0.5, fontSize: 14, color: BLACK, valign: 'middle' });
});

// Slide 6 - Features
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Key Features');
const features = [
  ['AI Recommendations', 'Smart matching with explainable scores'],
  ['Two-Way Matching', 'Project finds students AND students find projects'],
  ['Team Coverage', 'Analyzes skill coverage, missing skills'],
  ['Invitation System', 'Creators invite, students accept/decline'],
  ['Join Requests', 'Students request, creators accept/reject'],
  ['Notifications', 'Real-time alerts for all activities'],
  ['Search & Filters', 'Filter by skill, role, experience'],
  ['Theme Customizer', '6 color themes users can switch'],
  ['Responsive Design', 'Works on desktop, tablet, mobile'],
];
features.forEach(([t, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  box(s, 0.5 + col * 4.2, 1.6 + row * 1.8, 3.8, 1.5, LIGHT, '', BLACK);
  s.addText(t, { x: 0.7 + col * 4.2, y: 1.7 + row * 1.8, w: 3.4, h: 0.5, fontSize: 16, bold: true, color: ACCENT });
  s.addText(d, { x: 0.7 + col * 4.2, y: 2.3 + row * 1.8, w: 3.4, h: 0.6, fontSize: 13, color: GRAY });
});

// Slide 7 - User Flow
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'User Flow');
const flow = ['Register/Login', 'Create Profile\nor Project', 'AI Analyzes\nRequirements', 'AI Matches\nStudents', 'View Match %\n& Reasons', 'Invite or\nRequest', 'Accept /\nDecline', 'Team\nFormed!'];
flow.forEach((text, i) => {
  box(s, 0.3 + i * 1.6, 2, 1.3, 1.3, i < 4 ? ACCENT : GREEN, text, WHITE, 11);
  if (i < 7) s.addText('→', { x: 1.55 + i * 1.6, y: 2.2, w: 0.4, h: 0.5, fontSize: 20, bold: true, color: GRAY, align: 'center' });
});
heading(s, 'Project Creator Flow', 0.5, 4, 5.5, 0.5, 20, true, ACCENT);
bullets(s, ['1. Create project with requirements', '2. AI recommends suitable students', '3. View match scores and reasons', '4. Invite students', '5. Students accept or decline', '6. Review join requests'], 0.5, 4.6, 5.5, 2.5, 14);
heading(s, 'Student Flow', 7, 4, 5.5, 0.5, 20, true, GREEN);
bullets(s, ['1. Build skills and interests profile', '2. AI recommends matching projects', '3. View match scores and reasons', '4. Request to join projects', '5. Creator reviews and accepts', '6. Join the team'], 7, 4.6, 5.5, 2.5, 14);

// Slide 8 - Database
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Database Schema');
const tables = [
  ['users', 'id, email, password, name, role'],
  ['student_profiles', 'userId, college, dept, year'],
  ['projects', 'id, title, description, domain'],
  ['skills / interests / roles', 'id, name'],
  ['project_members', 'projectId, userId, role'],
  ['invitations', 'projectId, sender, receiver, status'],
  ['join_requests', 'projectId, studentId, status'],
  ['notifications', 'userId, type, title, message'],
];
tables.forEach(([t, f], i) => {
  const col = i % 4, row = Math.floor(i / 4);
  box(s, 0.3 + col * 3.2, 1.5 + row * 2.8, 3, 2.5, LIGHT, '', BLACK);
  s.addText(t, { x: 0.4 + col * 3.2, y: 1.6 + row * 2.8, w: 2.8, h: 0.5, fontSize: 13, bold: true, color: ACCENT, align: 'center' });
  s.addText(f, { x: 0.4 + col * 3.2, y: 2.2 + row * 2.8, w: 2.8, h: 1.5, fontSize: 11, color: GRAY, align: 'center' });
});

// Slide 9 - Tech Stack
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Technology Stack');
const stack = [
  ['Frontend', 'React 18\nTypeScript\nTailwind CSS\nVite\nReact Router\nLucide Icons', LIGHT],
  ['Backend', 'Node.js\nExpress.js\nTypeScript\nPrisma ORM\nJWT Auth\nbcryptjs', 'ecfdf5'],
  ['Database', 'SQLite\nPrisma Client\n14 Tables\nUUID Keys\nForeign Keys\nConstraints', 'f3e8ff'],
  ['AI Engine', 'Weighted Scoring\nSkill Aliases\nCosine Similarity\nTeam Coverage\nRole Matching\nAvailability Check', 'fde68a'],
];
stack.forEach(([title_, items, color], i) => {
  box(s, 0.3 + i * 3.2, 1.5, 3, 5.5, color, '', BLACK);
  s.addText(title_, { x: 0.4 + i * 3.2, y: 1.7, w: 2.8, h: 0.5, fontSize: 18, bold: true, color: BLACK, align: 'center' });
  s.addText(items, { x: 0.5 + i * 3.2, y: 2.4, w: 2.8, h: 4, fontSize: 14, color: BLACK, align: 'center', lineSpacingMultiple: 1.5 });
});

// Slide 10 - Deployment
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Deployment & Access');
box(s, 0.5, 1.8, 3.8, 2.5, '24292e', 'GitHub\nSource Code\nVersion Control\nGitHub.com', WHITE, 16);
box(s, 4.7, 1.8, 3.8, 2.5, '663399', 'Render.com\nFree Cloud Hosting\nAuto Deploy\nteammatch-ai.onrender.com', WHITE, 16);
box(s, 8.9, 1.8, 3.8, 2.5, '003b57', 'SQLite\nLightweight DB\nNo External Needed\nPortable & Simple', WHITE, 16);
heading(s, 'Access Methods', 1, 4.8, 11, 0.6, 24, true, BLACK);
bullets(s, [
  'Online: teammatch-ai.onrender.com (any device, anywhere)',
  'Local: localhost:5173 (on your PC)',
  'Custom URL: teammatchai.local (on your PC)',
  'Phone: Add to home screen from browser menu',
], 1, 5.5, 11, 2, 16);

// Slide 11 - Demo
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Demo');
heading(s, 'Live at: https://teammatch-ai.onrender.com', 1, 1.8, 11, 0.6, 24, true, ACCENT);
heading(s, 'Demo Accounts (Password: password123)', 1, 2.6, 11, 0.6, 20, true, BLACK);
const accounts = [['alice@college.edu', 'Alice Johnson', 'Both'], ['bob@college.edu', 'Bob Smith', 'Student'], ['carol@college.edu', 'Carol Davis', 'Student'], ['dave@college.edu', 'Dave Wilson', 'Student']];
accounts.forEach(([email, name, role], i) => {
  s.addText(email, { x: 2, y: 3.5 + i * 0.7, w: 3.5, h: 0.5, fontSize: 16, color: BLACK });
  s.addText(name, { x: 5.5, y: 3.5 + i * 0.7, w: 3, h: 0.5, fontSize: 16, color: BLACK });
  s.addText(role, { x: 8.5, y: 3.5 + i * 0.7, w: 2, h: 0.5, fontSize: 16, bold: true, color: ACCENT });
});

// Slide 12 - Future
s = pptx.addSlide();
addBg(s, WHITE);
addBar(s, 0, 1.2, ACCENT);
title(s, 'Future Scope');
const future = [
  ['LLM Integration', 'GPT/Claude for deeper\nrequirement analysis'],
  ['Real-time Chat', 'Built-in messaging\nbetween team members'],
  ['Mobile App', 'React Native\nAndroid/iOS app'],
  ['Advanced AI', 'Deep learning for\nbetter predictions'],
  ['Video Profiles', 'Students add video\nintros to profiles'],
  ['Analytics', 'Team performance\ntracking & insights'],
];
future.forEach(([t, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  box(s, 0.5 + col * 4.2, 1.6 + row * 2.8, 3.8, 2.3, LIGHT, '', BLACK);
  s.addText(t, { x: 0.7 + col * 4.2, y: 1.9 + row * 2.8, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: ACCENT, align: 'center' });
  s.addText(d, { x: 0.7 + col * 4.2, y: 2.6 + row * 2.8, w: 3.4, h: 1, fontSize: 14, color: BLACK, align: 'center' });
});

// Slide 13 - Thank You
s = pptx.addSlide();
addBg(s, BLUE);
s.addText('Thank You!', { x: 1, y: 2.2, w: 11, h: 1.5, fontSize: 54, bold: true, color: WHITE, align: 'center' });
s.addText('TeamMatch AI — Connecting Ideas with Talent', { x: 1, y: 3.8, w: 11, h: 0.8, fontSize: 24, color: '93c5fd', align: 'center' });
s.addText('https://teammatch-ai.onrender.com', { x: 1, y: 5, w: 11, h: 0.6, fontSize: 18, color: 'bfdbfe', align: 'center' });
s.addText('Questions?', { x: 1, y: 6, w: 11, h: 0.8, fontSize: 28, bold: true, color: WHITE, align: 'center' });

pptx.writeFile({ fileName: 'C:\\Users\\sugur\\OneDrive\\Desktop\\shiva f\\TeamMatch_AI_Presentation.pptx' })
  .then(() => console.log('Presentation created!'))
  .catch(e => console.error(e));
