export const SPORTS = [
  { id: 'badminton', name: 'Badminton', blurb: 'Wooden indoor courts with glare-free lighting.' },
  { id: 'basketball', name: 'Basketball', blurb: 'Full-size hardcourts, indoor and open-air.' },
  { id: 'football', name: 'Football', blurb: '5-a-side and 7-a-side turf pitches.' },
  { id: 'cricket', name: 'Cricket', blurb: 'Practice net lanes, bowling machine on request.' },
  { id: 'tennis', name: 'Tennis', blurb: 'Hard and clay courts, floodlit till late.' },
  { id: 'swimming', name: 'Swimming', blurb: '25 m lap lanes with lifeguards on duty.' },
  { id: 'skating', name: 'Skating', blurb: 'Smooth concrete rink for inline and quad skates.' },
  { id: 'gym', name: 'Gym', blurb: 'Strength floor and cardio deck, trainer on call.' },
  { id: 'tabletennis', name: 'Table Tennis', blurb: 'Tournament tables in a quiet hall.' },
];

export const VENUES = [
  { id: 'bd-1', sportId: 'badminton', name: 'Smash Hall A', area: 'Koramangala', price: 300, surface: 'Wooden floor', amenities: ['Racket rental', 'Changing rooms', 'Parking'] },
  { id: 'bd-2', sportId: 'badminton', name: 'Shuttle Point', area: 'HSR Layout', price: 240, surface: 'Synthetic mat', amenities: ['Water station', 'Parking'] },
  { id: 'bk-1', sportId: 'basketball', name: 'Hoops Yard', area: 'Indiranagar', price: 600, surface: 'Outdoor hardcourt', amenities: ['Floodlights', 'Ball rental', 'Seating'] },
  { id: 'bk-2', sportId: 'basketball', name: 'Baseline Arena', area: 'Whitefield', price: 750, surface: 'Indoor maple', amenities: ['Scoreboard', 'Changing rooms', 'Parking'] },
  { id: 'fb-1', sportId: 'football', name: 'Turf Nine', area: 'Jayanagar', price: 1400, surface: '7-a-side turf', amenities: ['Floodlights', 'Bibs provided', 'Parking'] },
  { id: 'fb-2', sportId: 'football', name: 'Kickoff Park', area: 'Yelahanka', price: 1000, surface: '5-a-side turf', amenities: ['Floodlights', 'Cafe'] },
  { id: 'cr-1', sportId: 'cricket', name: 'Net Lanes 1-4', area: 'Malleshwaram', price: 500, surface: 'Turf wickets', amenities: ['Bowling machine', 'Kit rental'] },
  { id: 'cr-2', sportId: 'cricket', name: 'Pitch Perfect Nets', area: 'JP Nagar', price: 450, surface: 'Matting wickets', amenities: ['Coach on request', 'Parking'] },
  { id: 'tn-1', sportId: 'tennis', name: 'Baseline Courts', area: 'Basavanagudi', price: 550, surface: 'Hard court', amenities: ['Floodlights', 'Racket rental'] },
  { id: 'tn-2', sportId: 'tennis', name: 'Clay & Co.', area: 'Indiranagar', price: 800, surface: 'Clay court', amenities: ['Coach on request', 'Changing rooms'] },
  { id: 'sw-1', sportId: 'swimming', name: 'Blue Lane Pool', area: 'Koramangala', price: 250, surface: '25 m pool', amenities: ['Lifeguard', 'Lockers', 'Showers'] },
  { id: 'sw-2', sportId: 'swimming', name: 'Aqua Deck', area: 'Whitefield', price: 300, surface: '25 m heated pool', amenities: ['Lifeguard', 'Lockers', 'Parking'] },
  { id: 'sk-1', sportId: 'skating', name: 'Rink Zero', area: 'HSR Layout', price: 200, surface: 'Concrete rink', amenities: ['Skate rental', 'Protective gear'] },
  { id: 'sk-2', sportId: 'skating', name: 'Roll Republic', area: 'Jayanagar', price: 180, surface: 'Smooth cement', amenities: ['Skate rental', 'Seating'] },
  { id: 'gm-1', sportId: 'gym', name: 'Iron House', area: 'JP Nagar', price: 150, surface: 'Strength floor', amenities: ['Trainer on call', 'Lockers', 'Showers'] },
  { id: 'gm-2', sportId: 'gym', name: 'Pulse Fitness', area: 'Malleshwaram', price: 180, surface: 'Cardio + weights', amenities: ['Trainer on call', 'Parking'] },
  { id: 'tt-1', sportId: 'tabletennis', name: 'Spin Room', area: 'Basavanagudi', price: 120, surface: 'Tournament tables', amenities: ['Paddle rental', 'AC hall'] },
  { id: 'tt-2', sportId: 'tabletennis', name: 'Rally Club', area: 'Yelahanka', price: 100, surface: 'Standard tables', amenities: ['Paddle rental'] },
];

export const AREAS = [...new Set(VENUES.map((v) => v.area))].sort();
export const sportById = (id) => SPORTS.find((s) => s.id === id);
export const venueById = (id) => VENUES.find((v) => v.id === id);
