export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// days: 0 = Sunday ... 6 = Saturday. Working hours are from..to (to is exclusive).
export const TRAINERS = [
  { id: 'tr-1', name: 'Arjun Nair', sportId: 'badminton', experience: 9, price: 700, rating: 4.8, reviews: 62, certs: ['BAI Level 2 Coach', 'Sports Nutrition Basics'], bio: 'Former state-level player. Works on footwork, smash technique and match play.', days: [1, 2, 3, 4, 5, 6], from: 6, to: 20 },
  { id: 'tr-2', name: 'Meera Iyer', sportId: 'badminton', experience: 5, price: 500, rating: 4.5, reviews: 31, certs: ['BAI Level 1 Coach'], bio: 'Patient coach for beginners and school-age players. Games-based drills.', days: [0, 2, 4, 6], from: 7, to: 19 },
  { id: 'tr-3', name: 'Rohan Das', sportId: 'basketball', experience: 7, price: 800, rating: 4.6, reviews: 44, certs: ['FIBA Level C Coach'], bio: 'Shooting mechanics, ball handling and defensive footwork.', days: [1, 2, 3, 4, 5], from: 16, to: 21 },
  { id: 'tr-4', name: 'Kabir Singh', sportId: 'football', experience: 10, price: 1000, rating: 4.7, reviews: 58, certs: ['AFC C Licence', 'First Aid'], bio: 'Ex-I-League academy coach. Passing, positioning and small-sided games.', days: [0, 1, 3, 5, 6], from: 6, to: 21 },
  { id: 'tr-5', name: 'Sana Khan', sportId: 'football', experience: 4, price: 600, rating: 4.3, reviews: 19, certs: ['AIFF D Licence'], bio: 'Fitness-first sessions for amateur and weekend players.', days: [1, 2, 3, 4, 5], from: 15, to: 21 },
  { id: 'tr-6', name: 'Vikram Rao', sportId: 'cricket', experience: 12, price: 900, rating: 4.9, reviews: 73, certs: ['BCCI Level 2 Coach'], bio: 'Batting technique and net sessions, with video review after every session.', days: [0, 1, 2, 3, 4, 5, 6], from: 6, to: 12 },
  { id: 'tr-7', name: 'Pooja Menon', sportId: 'cricket', experience: 6, price: 650, rating: 4.4, reviews: 27, certs: ['KSCA Level 1 Coach'], bio: 'Spin and medium-pace bowling specialist. Good with juniors.', days: [0, 2, 4, 6], from: 14, to: 20 },
  { id: 'tr-8', name: 'Aditya Shetty', sportId: 'tennis', experience: 8, price: 950, rating: 4.7, reviews: 49, certs: ['ITF Level 1 Coach'], bio: 'Serve, groundstroke consistency and doubles strategy.', days: [0, 1, 3, 5, 6], from: 6, to: 19 },
  { id: 'tr-9', name: 'Neha Kulkarni', sportId: 'swimming', experience: 11, price: 750, rating: 4.8, reviews: 66, certs: ['SFI Coach', 'Lifesaving Certified'], bio: 'Stroke correction for all four strokes. Adults and nervous beginners welcome.', days: [1, 2, 3, 4, 5, 6], from: 6, to: 21 },
  { id: 'tr-10', name: 'Faisal Ahmed', sportId: 'swimming', experience: 3, price: 400, rating: 4.1, reviews: 12, certs: ['Lifesaving Certified'], bio: 'Weekend water-confidence classes for kids.', days: [0, 6], from: 7, to: 18 },
  { id: 'tr-11', name: 'Ishaan Verma', sportId: 'skating', experience: 5, price: 450, rating: 4.4, reviews: 23, certs: ['RSFI Skating Coach'], bio: 'Balance, stopping and turning for beginners on inline skates.', days: [2, 3, 4, 5, 6], from: 15, to: 20 },
  { id: 'tr-12', name: 'Tanvi Joshi', sportId: 'gym', experience: 8, price: 600, rating: 4.6, reviews: 52, certs: ['ACE Personal Trainer'], bio: 'Strength programming and mobility work around your schedule.', days: [0, 1, 2, 3, 4, 5, 6], from: 6, to: 21 },
  { id: 'tr-13', name: 'Manoj Pillai', sportId: 'gym', experience: 15, price: 1000, rating: 4.9, reviews: 88, certs: ['NASM-CPT', 'Rehab Specialist'], bio: 'Strength and conditioning for athletes. Early-morning sessions only.', days: [1, 2, 3, 4, 5], from: 6, to: 11 },
  { id: 'tr-14', name: 'Divya Reddy', sportId: 'tabletennis', experience: 6, price: 350, rating: 4.5, reviews: 21, certs: ['TTFI Coach'], bio: 'Spin, serve variations and footwork drills.', days: [1, 3, 5], from: 16, to: 21 },
  { id: 'tr-15', name: 'Sameer Bhat', sportId: 'tabletennis', experience: 2, price: 250, rating: 4.0, reviews: 9, certs: ['Club Level Coach'], bio: 'Relaxed weekend sessions for first-time players.', days: [0, 6], from: 8, to: 18 },
];

export const trainerById = (id) => TRAINERS.find((t) => t.id === id);

export function daysLabel(days) {
  const key = days.join(',');
  if (key === '0,1,2,3,4,5,6') return 'Every day';
  if (key === '1,2,3,4,5') return 'Mon - Fri';
  if (key === '1,2,3,4,5,6') return 'Mon - Sat';
  return days.map((d) => DAY_NAMES[d]).join(', ');
}
