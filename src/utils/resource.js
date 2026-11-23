import { venueById, sportById } from '../data/facilities.js';
import { trainerById } from '../data/trainers.js';

// One place that turns a booking (facility OR trainer) into display text
export function describeBooking(b) {
  const sport = sportById(b.sportId);
  if (b.kind === 'trainer') {
    const t = trainerById(b.trainerId);
    return {
      kind: 'Trainer session',
      title: t ? t.name : 'Trainer',
      sub: sport ? `${sport.name} trainer` : 'Trainer',
    };
  }
  const v = venueById(b.venueId);
  return {
    kind: 'Facility booking',
    title: v ? v.name : 'Venue',
    sub: v ? `${sport ? sport.name : ''} \u00B7 ${v.area}` : '',
  };
}
