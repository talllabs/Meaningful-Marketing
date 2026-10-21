/* Learning Link — ILLUSTRATIVE SAMPLE DATA
   ⚠ Location names, addresses, phone numbers, schedules and services are
   INVENTED for a proposal demo. Do not treat any of it as real.

   HOW STAFF WOULD UPDATE THIS TWICE A YEAR
   - Add a new entry to `terms` (e.g. Spring 2027) and set `currentTerm`.
   - Under each location's `schedules`, add sessions for the new term id.
   - Locations with no sessions for the current term automatically show a
     "Schedule coming soon" message instead of disappearing.
   In production this would map to a CMS collection (one record per location,
   with a repeatable "session" field grouped by term). */
window.F5_DATA = window.F5_DATA || {};
window.F5_DATA.learningLink = {
  currentTerm: 'fall-2026',
  terms: [
    { id: 'fall-2026', label: 'Fall 2026', range: 'Aug 2026 – Jan 2027', updated: 'Aug 1, 2026' },
    { id: 'spring-2027', label: 'Spring 2027', range: 'Feb 2027 – Jul 2027', updated: 'Draft · publishes Jan 2027' }
  ],
  taxonomy: {
    regions: [
      { id: 'north', label: 'North County' },
      { id: 'central', label: 'Central County' },
      { id: 'west', label: 'West County' },
      { id: 'south', label: 'South County' }
    ],
    days: [
      { id: 'Mon', label: 'Mon' }, { id: 'Tue', label: 'Tue' }, { id: 'Wed', label: 'Wed' },
      { id: 'Thu', label: 'Thu' }, { id: 'Fri', label: 'Fri' }, { id: 'Sat', label: 'Sat' }
    ],
    times: [
      { id: 'morning', label: 'Morning (before noon)' },
      { id: 'afternoon', label: 'Afternoon (12–5 pm)' },
      { id: 'evening', label: 'Evening (after 5 pm)' }
    ],
    languages: [
      { id: 'en', label: 'English' }, { id: 'es', label: 'Español' }, { id: 'vi', label: 'Tiếng Việt' }, { id: 'ko', label: '한국어' }
    ],
    services: [
      { id: 'playlearn', label: 'Play & learn groups' },
      { id: 'screening', label: 'Developmental screenings' },
      { id: 'workshops', label: 'Parent workshops' },
      { id: 'books', label: 'Free books' },
      { id: 'kinder', label: 'Kindergarten prep' }
    ],
    settings: [
      { id: 'library', label: 'Library' },
      { id: 'community', label: 'Community center' },
      { id: 'school', label: 'School campus' },
      { id: 'frc', label: 'Family resource center' },
      { id: 'park', label: 'Park & rec' }
    ]
  },

  // x / y = position (0–100) on the simplified illustrative county map.
  locations: [
    {
      id: 'ana-1', name: 'Sample Site: Northside Family Center', setting: 'frc', city: 'Anaheim', region: 'north', x: 33, y: 22,
      address: '100 Example Ave, Anaheim, CA 92800', phone: '(000) 555-0101',
      languages: ['en', 'es'], services: ['playlearn', 'screening', 'workshops'], dropIn: true,
      access: 'Ground floor, stroller parking, accessible restroom.',
      schedules: {
        'fall-2026': [
          { day: 'Tue', start: '09:30', end: '11:00', name: 'Play & Learn (ages 0–3)', lang: 'en' },
          { day: 'Thu', start: '09:30', end: '11:00', name: 'Juega y Aprende (0–3 años)', lang: 'es' },
          { day: 'Thu', start: '18:00', end: '19:30', name: 'Parent workshop: Bedtime routines', lang: 'es' }
        ],
        'spring-2027': [
          { day: 'Tue', start: '09:30', end: '11:00', name: 'Play & Learn (ages 0–3)', lang: 'en' },
          { day: 'Wed', start: '10:00', end: '11:30', name: 'Juega y Aprende (0–3 años)', lang: 'es' }
        ]
      }
    },
    {
      id: 'ful-1', name: 'Sample Site: Hillcrest Library Branch', setting: 'library', city: 'Fullerton', region: 'north', x: 24, y: 12,
      address: '200 Example Blvd, Fullerton, CA 92800', phone: '(000) 555-0102',
      languages: ['en', 'ko'], services: ['playlearn', 'books'], dropIn: true,
      access: 'Elevator access; story room on second floor.',
      schedules: {
        'fall-2026': [
          { day: 'Mon', start: '10:00', end: '11:00', name: 'Baby & Me Rhymes', lang: 'en' },
          { day: 'Wed', start: '10:00', end: '11:00', name: 'Toddler Story Play', lang: 'en' },
          { day: 'Sat', start: '10:30', end: '11:30', name: '한국어 이야기 시간 (Korean story time)', lang: 'ko' }
        ],
        'spring-2027': []
      }
    },
    {
      id: 'bp-1', name: 'Sample Site: Parkview Elementary Room 4', setting: 'school', city: 'Buena Park', region: 'north', x: 14, y: 20,
      address: '300 Example St, Buena Park, CA 92800', phone: '(000) 555-0103',
      languages: ['en', 'es'], services: ['kinder', 'playlearn'], dropIn: false,
      access: 'Enter through main office; registration required.',
      schedules: {
        'fall-2026': [
          { day: 'Wed', start: '13:00', end: '14:30', name: 'Ready for K: Pre-K playgroup', lang: 'en' },
          { day: 'Fri', start: '13:00', end: '14:30', name: 'Listos para el Kínder', lang: 'es' }
        ],
        'spring-2027': [
          { day: 'Wed', start: '13:00', end: '14:30', name: 'Ready for K: Pre-K playgroup', lang: 'en' }
        ]
      }
    },
    {
      id: 'or-1', name: 'Sample Site: Orchard Park Rec Room', setting: 'park', city: 'Orange', region: 'central', x: 47, y: 30,
      address: '400 Example Way, Orange, CA 92800', phone: '(000) 555-0104',
      languages: ['en'], services: ['playlearn'], dropIn: true,
      access: 'Single-level building next to playground.',
      schedules: {
        'fall-2026': [
          { day: 'Fri', start: '09:00', end: '10:30', name: 'Move & Play (ages 1–4)', lang: 'en' }
        ],
        'spring-2027': [
          { day: 'Fri', start: '09:00', end: '10:30', name: 'Move & Play (ages 1–4)', lang: 'en' },
          { day: 'Sat', start: '09:30', end: '11:00', name: 'Weekend Family Play', lang: 'en' }
        ]
      }
    },
    {
      id: 'sa-1', name: 'Sample Site: Riverside Community Hub', setting: 'community', city: 'Santa Ana', region: 'central', x: 40, y: 40,
      address: '500 Example Ave, Santa Ana, CA 92700', phone: '(000) 555-0105',
      languages: ['es', 'en'], services: ['playlearn', 'screening', 'workshops', 'books'], dropIn: true,
      access: 'Accessible entrance on east side; Spanish-speaking staff on site.',
      schedules: {
        'fall-2026': [
          { day: 'Mon', start: '09:30', end: '11:00', name: 'Juega y Aprende', lang: 'es' },
          { day: 'Wed', start: '09:30', end: '11:00', name: 'Juega y Aprende', lang: 'es' },
          { day: 'Wed', start: '17:30', end: '19:00', name: 'Taller para padres: Hablemos de emociones', lang: 'es' },
          { day: 'Sat', start: '10:00', end: '12:00', name: 'Developmental screening clinic', lang: 'en' }
        ],
        'spring-2027': [
          { day: 'Mon', start: '09:30', end: '11:00', name: 'Juega y Aprende', lang: 'es' },
          { day: 'Sat', start: '10:00', end: '12:00', name: 'Developmental screening clinic', lang: 'en' }
        ]
      }
    },
    {
      id: 'sa-2', name: 'Sample Site: Centro Familiar Library Annex', setting: 'library', city: 'Santa Ana', region: 'central', x: 37, y: 46,
      address: '510 Example St, Santa Ana, CA 92700', phone: '(000) 555-0106',
      languages: ['es', 'en'], services: ['books', 'playlearn', 'kinder'], dropIn: true,
      access: 'Street-level entrance; children’s area near front desk.',
      schedules: {
        'fall-2026': [
          { day: 'Tue', start: '15:30', end: '16:30', name: 'Cuentos y canciones', lang: 'es' },
          { day: 'Thu', start: '15:30', end: '16:30', name: 'Ready for K Story Time', lang: 'en' }
        ],
        'spring-2027': []
      }
    },
    {
      id: 'gg-1', name: 'Sample Site: Little Saigon Family Room', setting: 'frc', city: 'Garden Grove', region: 'west', x: 27, y: 38,
      address: '600 Example Blvd, Garden Grove, CA 92800', phone: '(000) 555-0107',
      languages: ['vi', 'en'], services: ['playlearn', 'workshops', 'screening'], dropIn: true,
      access: 'Accessible parking in front; Vietnamese-speaking staff.',
      schedules: {
        'fall-2026': [
          { day: 'Tue', start: '10:00', end: '11:30', name: 'Vui Chơi và Học Hỏi (0–5 tuổi)', lang: 'vi' },
          { day: 'Thu', start: '10:00', end: '11:30', name: 'Play & Learn (0–5)', lang: 'en' },
          { day: 'Sat', start: '09:00', end: '10:30', name: 'Hội thảo phụ huynh: Chuẩn bị vào mẫu giáo', lang: 'vi' }
        ],
        'spring-2027': [
          { day: 'Tue', start: '10:00', end: '11:30', name: 'Vui Chơi và Học Hỏi (0–5 tuổi)', lang: 'vi' }
        ]
      }
    },
    {
      id: 'wm-1', name: 'Sample Site: Westminster Learning Center', setting: 'community', city: 'Westminster', region: 'west', x: 22, y: 47,
      address: '700 Example Ave, Westminster, CA 92600', phone: '(000) 555-0108',
      languages: ['vi', 'en', 'es'], services: ['playlearn', 'books'], dropIn: true,
      access: 'Single-level; accessible restrooms; stroller-friendly.',
      schedules: {
        'fall-2026': [
          { day: 'Mon', start: '16:00', end: '17:00', name: 'Giờ Kể Chuyện (Story time)', lang: 'vi' },
          { day: 'Fri', start: '10:00', end: '11:00', name: 'Play & Learn (0–3)', lang: 'en' }
        ],
        'spring-2027': [
          { day: 'Mon', start: '16:00', end: '17:00', name: 'Giờ Kể Chuyện (Story time)', lang: 'vi' }
        ]
      }
    },
    {
      id: 'hb-1', name: 'Sample Site: Seaside Community Room', setting: 'community', city: 'Huntington Beach', region: 'west', x: 22, y: 60,
      address: '800 Example Ln, Huntington Beach, CA 92600', phone: '(000) 555-0109',
      languages: ['en'], services: ['playlearn', 'workshops'], dropIn: false,
      access: 'Accessible ramp at rear entrance.',
      schedules: {
        'fall-2026': [
          { day: 'Thu', start: '17:30', end: '19:00', name: 'Working Parents Evening Playgroup', lang: 'en' }
        ],
        'spring-2027': [
          { day: 'Thu', start: '17:30', end: '19:00', name: 'Working Parents Evening Playgroup', lang: 'en' }
        ]
      }
    },
    {
      id: 'cm-1', name: 'Sample Site: Mesa Verde Rec Center', setting: 'park', city: 'Costa Mesa', region: 'central', x: 37, y: 58,
      address: '900 Example Dr, Costa Mesa, CA 92600', phone: '(000) 555-0110',
      languages: ['en', 'es'], services: ['playlearn', 'kinder'], dropIn: true,
      access: 'Accessible entrance; shaded outdoor play area.',
      schedules: {
        'fall-2026': [
          { day: 'Wed', start: '09:30', end: '11:00', name: 'Outdoor Play & Learn', lang: 'en' },
          { day: 'Sat', start: '10:00', end: '11:30', name: 'Familias Activas', lang: 'es' }
        ],
        'spring-2027': []
      }
    },
    {
      id: 'irv-1', name: 'Sample Site: Woodbridge Family Library', setting: 'library', city: 'Irvine', region: 'south', x: 55, y: 52,
      address: '1000 Example Pkwy, Irvine, CA 92600', phone: '(000) 555-0111',
      languages: ['en', 'ko'], services: ['books', 'playlearn', 'screening'], dropIn: true,
      access: 'Elevator; quiet room available for nursing parents.',
      schedules: {
        'fall-2026': [
          { day: 'Tue', start: '10:30', end: '11:30', name: 'Baby Lapsit', lang: 'en' },
          { day: 'Thu', start: '13:30', end: '15:00', name: 'Developmental screening (by appointment)', lang: 'en' },
          { day: 'Sat', start: '11:00', end: '12:00', name: '한국어 놀이 시간 (Korean play time)', lang: 'ko' }
        ],
        'spring-2027': [
          { day: 'Tue', start: '10:30', end: '11:30', name: 'Baby Lapsit', lang: 'en' }
        ]
      }
    },
    {
      id: 'mv-1', name: 'Sample Site: Canyon View Elementary', setting: 'school', city: 'Mission Viejo', region: 'south', x: 72, y: 66,
      address: '1100 Example Rd, Mission Viejo, CA 92600', phone: '(000) 555-0112',
      languages: ['en', 'es'], services: ['kinder', 'workshops'], dropIn: false,
      access: 'Check in at front office; registration required.',
      schedules: {
        'fall-2026': [
          { day: 'Mon', start: '15:00', end: '16:30', name: 'Kinder Ready Club', lang: 'en' },
          { day: 'Wed', start: '18:00', end: '19:00', name: 'Parent night: Kindergarten registration', lang: 'en' }
        ],
        'spring-2027': [
          { day: 'Mon', start: '15:00', end: '16:30', name: 'Kinder Ready Club', lang: 'en' },
          { day: 'Mon', start: '16:45', end: '17:45', name: 'Club Listos para el Kínder', lang: 'es' }
        ]
      }
    },
    {
      id: 'ln-1', name: 'Sample Site: Hillside Family Resource Room', setting: 'frc', city: 'Laguna Niguel', region: 'south', x: 70, y: 80,
      address: '1200 Example Ct, Laguna Niguel, CA 92600', phone: '(000) 555-0113',
      languages: ['en', 'es'], services: ['screening', 'workshops'], dropIn: false,
      access: 'Accessible parking; interpreters available on request.',
      schedules: {
        'fall-2026': [],
        'spring-2027': [
          { day: 'Tue', start: '09:30', end: '11:00', name: 'Play & Learn (new for Spring)', lang: 'en' }
        ]
      }
    },
    {
      id: 'sc-1', name: 'Sample Site: Coastline Rec Hall', setting: 'park', city: 'San Clemente', region: 'south', x: 86, y: 92,
      address: '1300 Example Ave, San Clemente, CA 92600', phone: '(000) 555-0114',
      languages: ['en', 'es'], services: ['playlearn', 'books'], dropIn: true,
      access: 'Single-level hall near beach parking.',
      schedules: {
        'fall-2026': [
          { day: 'Thu', start: '10:00', end: '11:00', name: 'Beach Town Playgroup', lang: 'en' },
          { day: 'Sat', start: '10:00', end: '11:00', name: 'Juegos en Familia', lang: 'es' }
        ],
        'spring-2027': [
          { day: 'Thu', start: '10:00', end: '11:00', name: 'Beach Town Playgroup', lang: 'en' }
        ]
      }
    },
    {
      id: 'tus-1', name: 'Sample Site: Old Town Family Space', setting: 'community', city: 'Tustin', region: 'central', x: 51, y: 41,
      address: '1400 Example St, Tustin, CA 92700', phone: '(000) 555-0115',
      languages: ['en', 'es', 'vi'], services: ['playlearn', 'workshops', 'books'], dropIn: true,
      access: 'Accessible entrance; free on-site parking.',
      schedules: {
        'fall-2026': [
          { day: 'Mon', start: '18:00', end: '19:00', name: 'Family Evening Play', lang: 'en' },
          { day: 'Fri', start: '09:30', end: '10:30', name: 'Vui Chơi Cùng Bé', lang: 'vi' }
        ],
        'spring-2027': [
          { day: 'Mon', start: '18:00', end: '19:00', name: 'Family Evening Play', lang: 'en' }
        ]
      }
    }
  ]
};
