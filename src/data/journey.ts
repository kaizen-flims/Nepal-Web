export type SoundMood = 'wind' | 'quiet' | 'water' | 'warm';
export type Transition = 'iris' | 'slide' | 'rise' | 'fade' | 'match' | 'horizon';
export interface ResearchSource { label: string; title: string; url: string; }
export const SOURCES = {
  geography: { label: 'Nepal Tourism Board', title: 'Geography of Nepal', url: 'https://trade.ntb.gov.np/know-nepal/geography/' },
  valley: { label: 'UNESCO', title: 'Kathmandu Valley · World Heritage', url: 'https://whc.unesco.org/en/list/121/' },
  hiti: { label: 'UNESCO / World Monuments Fund', title: 'Reviving Kathmandu Valley’s water heritage', url: 'https://www.unesco.org/en/articles/cultural-heritage-driver-climate-action-resilient-world-heritage-cities-towns-asia-and-pacific' },
  food: { label: 'Nepal Tourism Board', title: 'Food & culinary traditions', url: 'https://ntb.gov.np/en/things-to-do/food-&-culinary' },
  tihar: { label: 'Nepal Tourism Board', title: 'Tihar', url: 'https://ntb.gov.np/tihar' },
  tharu: { label: 'Nepal Tourism Board', title: 'Tharu culture in Chitwan', url: 'https://ntb.gov.np/en/exploring-tharu-culture-in-chitwan-nepals-indigenous-heritage' },
  chitwan: { label: 'UNESCO', title: 'Chitwan National Park · World Heritage', url: 'https://whc.unesco.org/en/list/284/' },
  mustang: { label: 'Nepal Tourism Board', title: 'Upper Mustang & Lo Manthang', url: 'https://ntb.gov.np/en/lo-manthang-monastery--mustang' },
  climate: { label: 'Nepal Tourism Board', title: 'Climate & the Himalayan rain shadow', url: 'https://ntb.gov.np/plan-your-trip/about-nepal/climate' },
  ice: { label: 'ICIMOD', title: 'Monitoring Tsho Rolpa · research published 2020', url: 'https://www.icimod.org/remote-sensing-and-field-validation-confirm-expansion-of-tsho-rolpa-glacial-lake' },
  royal: { label: 'Monsoon · scholarly research', title: 'Tusha Hiti: the royal bath in Sundari Chowk', url: 'https://digitalcommons.lmu.edu/monsoon-sasa-journal/vol1/iss1/2/' },
} satisfies Record<string, ResearchSource>;

export interface JourneyScene {
  id: string; place: string; lines: string[]; copy: string; caption: string;
  photo?: string; kind?: 'essay'; transition: Transition; duration: number; mood: SoundMood;
  source?: keyof typeof SOURCES;
  detail?: string;
  notes?: { label: string; text: string }[];
  mark?: string;
}

/** Reading beats have a longer scroll hold; the final photograph comes last. */
export const SCENES: JourneyScene[] = [
  { id: 'land', place: 'THE MIDDLE HILLS', lines: ['BEYOND', 'THE SUMMIT.'], copy: 'Before another mountain, a different Nepal. Paddy fields, wooded ridges and the cultivated hills of Balthali.', caption: 'Balthali · Kavre', photo: 'land', transition: 'iris', duration: 2.6, mood: 'wind' },
  { id: 'terrain', place: 'FIELD NOTE 01 · GEOGRAPHY', lines: ['A VERTICAL', 'COUNTRY.'], copy: 'Nepal is usually described through three broad geographical regions. Snow is only one part of the story.', caption: 'From the plains to the high Himalaya', kind: 'essay', transition: 'rise', duration: 3.8, mood: 'quiet', source: 'geography', mark: '03', notes: [
    { label: 'Terai', text: 'The southern lowlands: plains, forests and agricultural landscapes.' },
    { label: 'Middle hills', text: 'Ridges and river valleys, with cities, villages and cultivated slopes.' },
    { label: 'Himalaya', text: 'The high mountain region, where altitude reshapes climate and terrain.' },
  ] },
  { id: 'heritage', place: 'BHAKTAPUR', lines: ['HISTORY,', 'STILL ALIVE.'], copy: 'Tiered roofs. Fired brick. Carved timber. In the Kathmandu Valley, Newar craftsmanship gives a city its texture.', caption: 'Bhaktapur Durbar Square', photo: 'heritage', transition: 'slide', duration: 2.7, mood: 'warm', source: 'valley' },
  { id: 'patan', place: 'PATAN · LALITPUR', lines: ['LOOK', 'CLOSER.'], copy: 'The detail is the architecture. Doorways, windows and roof struts carry the work of stone, timber and bronze traditions.', caption: 'A courtyard in Patan', photo: 'patan', transition: 'match', duration: 2.7, mood: 'quiet', source: 'valley' },
  { id: 'seven', place: 'FIELD NOTE 02 · LIVING HERITAGE', lines: ['ONE VALLEY.', 'SEVEN ZONES.'], copy: 'Kathmandu Valley is one UNESCO World Heritage property with seven monument zones. Palace squares, Buddhist stupas and Hindu temple precincts form a connected cultural landscape.', caption: 'Inscribed in 1979', kind: 'essay', transition: 'fade', duration: 4.1, mood: 'quiet', source: 'valley', mark: '07', notes: [
    { label: 'Three squares', text: 'Hanuman Dhoka, Patan and Bhaktapur.' },
    { label: 'Two stupas', text: 'Swayambhu and Boudhanath.' },
    { label: 'Two temple precincts', text: 'Pashupati and Changu Narayan.' },
  ] },
  { id: 'sacred', place: 'BOUDHANATH', lines: ['A MOMENT', 'OF STILLNESS.'], copy: 'A white hemisphere beneath a gilded tower. At Boudhanath, the shape of the stupa anchors the surrounding city.', caption: 'Boudhanath · Kathmandu', photo: 'stupa', transition: 'iris', duration: 2.9, mood: 'quiet', source: 'valley' },
  { id: 'wheels', place: 'A SMALLER SCALE', lines: ['THE WORLD', 'KEEPS TURNING.'], copy: 'From the great stupa to the prayer wheel. Gilded forms recur at a smaller scale, within the same sacred place.', caption: 'A prayer wheel · Boudhanath', photo: 'prayer-wheel', transition: 'match', duration: 2.6, mood: 'quiet' },
  { id: 'people', place: 'POTTERY SQUARE', lines: ['MADE', 'BY HAND.'], copy: 'Clay, a turning wheel, a working square. Bhaktapur’s living heritage is also the everyday labour of its people.', caption: 'Pottery Square · Bhaktapur', photo: 'life', transition: 'rise', duration: 2.6, mood: 'warm' },
  { id: 'hiti', place: 'SUNDARI CHOWK · PATAN', lines: ['WATER,', 'IN STONE.'], copy: 'A gilt spout at Tusha Hiti, the royal bath of Sundari Chowk. Water architecture here carries a remarkable density of carved detail.', caption: 'Tusha Hiti · Patan Durbar Square', photo: 'hiti', transition: 'horizon', duration: 2.9, mood: 'water', source: 'royal' },
  { id: 'water', place: 'FIELD NOTE 03 · THE WORKING CITY', lines: ['HERITAGE', 'THAT FLOWS.'], copy: 'Public hitis are more than ornaments. They are water infrastructure, meeting places and part of Newar cultural life.', detail: 'A UNESCO-published case study describes how restoring Yenga Hiti in Kathmandu brought an ancient water system back into operation. Repairing channels and water-flow mechanisms mattered as much as conserving the carved stone. Community participation supports its care.', caption: 'The restoration described here is at Yenga Hiti, Kathmandu', kind: 'essay', transition: 'fade', duration: 4.5, mood: 'water', source: 'hiti', mark: 'H₂O' },
  { id: 'food', place: 'AT THE TABLE', lines: ['MORE THAN', 'A FAVOURITE.'], copy: 'Momo may be the familiar first bite. Nepal’s food traditions also include lentil-based bara, fermented leafy gundruk and grain-based dhido.', caption: 'Momo · Nepal’s wider culinary story', photo: 'food', transition: 'slide', duration: 2.9, mood: 'warm', source: 'food' },
  { id: 'festival', place: 'TIHAR', lines: ['LET THERE', 'BE LIGHT.'], copy: 'Across five days, Tihar honours crows, dogs, cows and family bonds. Lamps are part of the story; the relationships are the heart of it.', caption: 'Tihar · A traditional oil lamp', photo: 'festival', transition: 'fade', duration: 2.9, mood: 'warm', source: 'tihar' },
  { id: 'tharu', place: 'FIELD NOTE 04 · THE TERAI', lines: ['MORE THAN', 'ONE RHYTHM.'], copy: 'A country’s culture cannot be reduced to one festival. For Tharu communities, Maghi in mid-January marks the New Year: a time of renewal and gathering.', detail: 'In Chitwan, Tharu traditions include clay, bamboo and thatch in domestic architecture, stick-dance performances, and foods such as dhikri, steamed rice-flour dumplings. These are living regional traditions, not a single national costume.', caption: 'Tharu communities · Southern Nepal', kind: 'essay', transition: 'rise', duration: 4.5, mood: 'quiet', source: 'tharu', mark: 'MAGHI' },
  { id: 'wild', place: 'CHITWAN', lines: ['THE OTHER', 'WILD NEPAL.'], copy: 'Below the mountains: sal forest, grassland and river habitats. Chitwan shelters the greater one-horned rhinoceros and Bengal tiger.', caption: 'A rhinoceros and calf · Chitwan National Park', photo: 'chitwan', transition: 'horizon', duration: 3.0, mood: 'wind', source: 'chitwan' },
  { id: 'adventure', place: 'THE KALI GANDAKI VALLEY', lines: ['TAKE THE', 'LONG WAY.'], copy: 'A suspension bridge near Tatopani. The route north follows a changing landscape, rather than one endless mountain view.', caption: 'Tatopani · Kali Gandaki Valley', photo: 'adventure', transition: 'slide', duration: 2.7, mood: 'wind' },
  { id: 'mustang', place: 'UPPER MUSTANG', lines: ['ON THE', 'OTHER SIDE.'], copy: 'At Lo Manthang, a walled settlement sits in the high, dry landscape of Upper Mustang. The rain shadow changes the palette.', caption: 'Lo Manthang · Upper Mustang', photo: 'mustang', transition: 'horizon', duration: 3.0, mood: 'wind', source: 'mustang' },
  { id: 'rain', place: 'FIELD NOTE 05 · WEATHER & LAND', lines: ['WHERE THE', 'RAIN STOPS.'], copy: 'Mountains influence where moisture falls. Manang and Mustang lie in a Himalayan rain shadow and are much drier than Nepal’s monsoon-facing slopes.', detail: 'That is why green hills and dry, ochre landscapes can belong to the same country. Geography changes the weather; the weather helps shape what grows and how a place looks.', caption: 'One country, sharply different climates', kind: 'essay', transition: 'fade', duration: 3.9, mood: 'quiet', source: 'climate', mark: 'RAIN' },
  { id: 'gokyo', place: 'THE HIGH HIMALAYA', lines: ['A DIFFERENT', 'KIND OF BLUE.'], copy: 'A high-altitude lake at Gokyo. At this scale, water, rock and mountain light become the whole composition.', caption: 'Gokyo · Khumbu', photo: 'gokyo', transition: 'horizon', duration: 3.0, mood: 'water' },
  { id: 'ice', place: 'FIELD NOTE 06 · A CHANGING HIMALAYA', lines: ['BEAUTIFUL.', 'AND CHANGING.'], copy: 'A glacial landscape is not frozen in time. Researchers study changing lakes because water can become a risk for people downstream.', detail: 'At Tsho Rolpa, a different lake in Nepal’s Rolwaling Valley, a study published by ICIMOD in 2020 combined satellite images and field observations to track expansion toward a glacier. Monitoring helps communities understand changing flood hazards.', caption: 'Research case: Tsho Rolpa · Rolwaling Valley', kind: 'essay', transition: 'fade', duration: 4.5, mood: 'quiet', source: 'ice', mark: 'ICE' },
  { id: 'finale', place: 'PHEWA LAKE · POKHARA', lines: ['NEPAL'], copy: 'Not one landscape. Not one story.', caption: 'Carry a little of it with you.', photo: 'quiet', transition: 'fade', duration: 4.0, mood: 'water' },
];

export const SCENE_STARTS = SCENES.map((_, index) => SCENES.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0));
export const FILM_DURATION = SCENES.reduce((sum, scene) => sum + scene.duration, 0);
