export interface Host {
  name: string;
  avatar: string;
  yearsHosting: number;
  isSuperhost: boolean;
}

export interface ListingStats {
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}

export interface Amenity {
  icon: string;
  label: string;
  category: string;
}

export interface Photo {
  src: string;
  alt: string;
  room: string;
}

export interface Review {
  id: string;
  name: string;
  date: string;
  yearsOnPlatform: number;
  text: string;
  avatarColor: string;
  rating: number;
  avatar?: string;
  tags?: string[];
}

export interface Listing {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  isSuperhost: boolean;
  host: Host;
  stats: ListingStats;
  pricePerNight: number;
  currency: string;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
  description: string[];
  amenities: Amenity[];
  categoryRatings: { label: string; value: number }[];
}
