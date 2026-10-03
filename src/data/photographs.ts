// Metadata and derivative licences accompany every local photograph.
import { assetUrl } from '@/lib/asset-url';
import photographs from '../../public/images/nepal/journey/sources.json';

export const PHOTOGRAPHS = photographs.map((photo) => ({
  ...photo,
  src: assetUrl(photo.src),
  mobile: assetUrl(photo.mobile),
  srcSet: photo.srcSet.split(', ').map((candidate) => assetUrl(candidate)).join(', '),
}));
export const PHOTO_BY_ID = Object.fromEntries(PHOTOGRAPHS.map((photo) => [photo.id, photo]));
