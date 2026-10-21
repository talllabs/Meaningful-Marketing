/* Early Development Index (EDI) — content and countywide figures for the proposal demo.
   Source: First 5 OC EDI content reference compiled from https://first5oc.org/resources/edi/
   on Oct 21, 2026. Nothing here is invented.

   THE LIVE MAP: First 5 OC's neighborhood map is an ArcGIS application maintained
   with its mapping partner. Per First 5 OC's guidance it must be EMBEDDED, not
   rebuilt, so neighborhood values are deliberately NOT stored in this file.
   Paste the exact iframe `src` from the current EDI page into `mapUrl` below.
   Do not guess an ArcGIS URL. While `mapUrl` is empty the page shows a labelled
   placeholder that links to the current live map. */
window.F5_DATA = window.F5_DATA || {};
window.F5_DATA.edi = {
  mapUrl: '',
  pageUrl: 'https://first5oc.org/resources/edi/',

  headline: {
    year: 2025, ready: 53.0,
    compareYear: 2015, compareReady: 48.2,
    source: 'First 5 Orange County',
    sourceUrl: 'https://first5oc.org/resources/edi/'
  },

  // Share of kindergartners on track in each developmental area.
  domains: [
    { id: 'physical',
      plain: 'Healthy, strong bodies', plainText: 'Coming to school rested and ready, with energy, coordination, and big and small muscles that work well.', kb: ['body', 'health'], title: 'Physical Health and Well-Being', short: 'Physical Health', icon: '🤸', y2015: 79.8, y2025: 80.3,
      text: 'Looks at physical readiness for the school day, physical independence, energy, coordination, and gross and fine motor abilities.' },
    { id: 'social',
      plain: 'Getting along with others', plainText: 'Playing and working with others, following routines, asking for what they need, and feeling confident.', kb: ['relationship'], title: 'Social Competence', short: 'Social Competence', icon: '🤝', y2015: 77.3, y2025: 78.9,
      text: 'Looks at children’s ability to cooperate with others, follow appropriate behavior expectations, communicate needs, demonstrate confidence, and participate socially.' },
    { id: 'emotional',
      plain: 'Handling big feelings', plainText: 'Being curious, trying new things, calming down, helping others, and thinking before acting.', kb: ['relationship'], title: 'Emotional Maturity', short: 'Emotional Maturity', icon: '💛', y2015: 79.6, y2025: 76.5,
      text: 'Looks at curiosity, willingness to try new experiences, emotional regulation, prosocial behavior, and the ability to reflect before acting.' },
    { id: 'language',
      plain: 'Words, books and numbers', plainText: 'Learning new words, loving books, early reading and counting, and remembering things.', kb: ['word', 'mind'], title: 'Language and Cognitive Development', short: 'Language & Cognition', icon: '🔤', y2015: 67.4, y2025: 74.4,
      text: 'Looks at vocabulary, early literacy, numeracy, memory, interest in books and reading, and the ability to organize and understand information.' },
    { id: 'communication',
      plain: 'Sharing ideas and stories', plainText: 'Understanding what others say, and telling about their experiences, ideas, wishes and feelings.', kb: ['word'], title: 'Communication Skills and General Knowledge', short: 'Communication & Knowledge', icon: '💬', y2015: 71.7, y2025: 75.1,
      text: 'Looks at children’s ability to understand verbal communication and communicate experiences, ideas, wishes, and feelings so others can understand them.' }
  ],
  domainSource: { label: 'CHOC 2025 Community Health Needs Assessment', url: 'https://choc.org/files/CHOC_2025_CHNA_Report.pdf' },

  // Parent-facing answers for Explore mode, drawn from First 5 OC's EDI page.
  faq: [
    { q: 'Is this a test of my child?', a: 'No. The EDI is never used to screen, identify or diagnose an individual child. It shows how groups of children are doing across neighborhoods and communities.' },
    { q: 'Who fills it out?', a: 'Kindergarten teachers, who receive online training and complete a short checklist for each child during the second half of the school year.' },
    { q: 'Will anyone see my child’s results?', a: 'Individual children are never reported publicly. Results are shared in aggregate, and neighborhoods with fewer than 10 children’s records are kept private.' },
    { q: 'Why does First 5 OC collect it?', a: 'To spot where families could use more support, guide programs and investments, and track progress over time with schools and community partners.' }
  ],

  mapSteps: [
    'Choose a geographic area using the dropdown controls.',
    'Choose an EDI domain.',
    'Choose the year of data.',
    'Hover over or click an area to see its readiness or not-ready percentages.',
    'Click elsewhere on the map to exit a selected area.',
    'Use the map’s home control to reset the zoom.'
  ],

  uses: [
    'Understand how groups of young children are developing', 'Identify communities where additional support may be needed',
    'Identify inequities', 'Inform policy', 'Guide investment', 'Target resources', 'Support resident and family engagement',
    'Support advocacy', 'Help providers coordinate services', 'Support grant applications',
    'Understand community assets and barriers', 'Track progress over time', 'Compare child outcomes with other neighborhood indicators'
  ],

  milestones: [
    'Third grade reading proficiency', 'Third grade math proficiency', 'Middle-school achievement',
    'Higher high-school grades', 'Higher test scores', 'On-time high-school graduation'
  ],

  facts: [
    { big: '2007', text: 'First 5 OC became the first site in the United States to collect EDI data.' },
    { big: '15+ years', text: 'of partnership with Orange County school districts to collect EDI data.' },
    { big: '100%', text: 'participation among public schools with a kindergarten population since 2015.' },
    { big: '103', text: 'core items, completed by kindergarten teachers in about 10 to 15 minutes per child.' }
  ],

  resources: [
    { label: 'Understanding the Early Development Index (2025, PDF)', url: 'https://first5oc.org/wp-content/uploads/2025/09/2025-Understanding-the-Early-Development-Index.pdf' },
    { label: 'EDI Background and Research Profile (2025, PDF)', url: 'https://first5oc.org/wp-content/uploads/2025/09/2025-EDI-Research-Profile.pdf' },
    { label: 'EDI Domain Spotlights', url: 'https://first5oc.org/english-early-development-index-spotlight/' },
    { label: 'Request EDI data or assistance', url: 'https://first5oc.org/resources/edi/request-form/' }
  ],
  requestOptions: [
    'An in-person EDI briefing from First 5 OC', 'A webinar briefing', 'Help preparing your own EDI briefing',
    'Help designing or facilitating community discussions', 'Help following through or tracking actions and change',
    'Additional neighborhood or organization-specific data or maps', 'Other custom EDI assistance'
  ],

  contact: { name: 'Cristina Blevins', email: 'Cristina.Blevins@first5.oc.gov', general: 'info@first5.oc.gov', phone: '(714) 834-5310' }
};
