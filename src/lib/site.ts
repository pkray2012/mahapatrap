// Fixed business facts used by the site chrome (header, footer, forms, sticky bar).
// Page copy itself comes only from content/pages/*.md.
export const SITE = {
  name: 'Mahapatra Plumbing Services',
  origin: 'https://mahapatraplumbing.in',
  phoneDisplay: '+91 9668875352',
  tel: 'tel:+919668875352',
  wa: '919668875352',
  email: 'amareshmohapatra143@gmail.com',
  addressLines: ['District Center, Chandrasekharpur', 'Bhubaneswar, Odisha 751016'],
  hours: 'Open daily 8 AM – 10 PM',
  mapsUrl: 'https://www.google.com/maps?cid=4373818382391816251',
  mapsEmbed: 'https://maps.google.com/maps?cid=4373818382391816251&output=embed',
};

export const waLink = (text: string) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text)}`;

// Order used in nav, footer and home listing.
export const SERVICE_ORDER = [
  'leak-and-blockage-repair',
  'bathroom-and-kitchen-fittings',
  'geyser-installation-and-repair',
  'water-tank-and-motor-repair',
  'pipeline-and-concealed-plumbing',
  'drain-cleaning-and-sewer-jetting',
  'septic-tank-cleaning',
  'bathroom-plumbing-renovation',
  'new-bathroom-and-house-plumbing',
  'sewerage-and-drainage-works',
  'water-tank-cleaning',
  'borewell-pump-and-pipe-repair',
  'commercial-plumbing',
];

export const AREA_ORDER = [
  'chandrasekharpur',
  'patia',
  'kiit',
  'infocity',
  'niladri-vihar',
  'sailashree-vihar',
  'jayadev-vihar',
  'nayapalli',
];

// Options of the Area select in both forms.
export const AREA_OPTIONS: [string, string][] = [
  ['chandrasekharpur', 'Chandrasekharpur'],
  ['patia', 'Patia'],
  ['kiit', 'KIIT'],
  ['infocity', 'Infocity'],
  ['niladri-vihar', 'Niladri Vihar'],
  ['sailashree-vihar', 'Sailashree Vihar'],
  ['jayadev-vihar', 'Jayadev Vihar'],
  ['nayapalli', 'Nayapalli'],
  ['other', 'Other area in Bhubaneswar'],
];
