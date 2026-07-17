import { Listing, Photo, Review } from "./types";

// Import local image assets for type safety and Vite compilation
import photo0 from "./assets/image1_files/a9831aeb-f441-44f5-a38f-4cf54e3f0fcf.jpeg";
import photo1 from "./assets/image1_files/a45feaa2-b607-4092-83ac-5fd4b2894959.jpeg";
import photo2 from "./assets/image1_files/f1da1c3d-0d10-481e-9b63-c71f9073f30b.jpeg";
import photo3 from "./assets/image1_files/090d8b0b-b539-42c0-84f8-e1fb0cdf9a93.jpeg";
import photo4 from "./assets/image1_files/9be71047-fc52-438a-9270-75cb470f6752.jpeg";
import photo5 from "./assets/image1_files/f6de1663-4e9c-4414-b63b-29a154a92ee1.jpeg";
import photo6 from "./assets/image1_files/2367476f-11c4-4a14-a7c6-267be62c1d59.jpeg";
import photo7 from "./assets/image1_files/34529829-a971-44d3-ac2f-90ea3678a34d.jpeg";
import photo8 from "./assets/image1_files/153aa732-4935-48b8-a6fe-b469b6af5efc.jpeg";
import photo9 from "./assets/image1_files/3c6e6809-1bb1-47a6-8e24-aff593e1c28f.jpeg";
import photo10 from "./assets/image1_files/56c44812-52c0-4481-90d8-101ec1f34c7a.jpeg";
import photo11 from "./assets/image1_files/ddc853d7-e658-405c-bedc-8f31106c447e.jpeg";
import photo12 from "./assets/image1_files/67c61c6f-6260-4809-9510-0360e58a345d.jpeg";
import photo13 from "./assets/image1_files/1c827136-4a85-4fe0-8e69-3fd8ea19bb17.jpeg";
import photo14 from "./assets/image1_files/0622ab42-b851-4d55-9d9f-df3143bc5909.jpeg";
import photo15 from "./assets/image1_files/a74e3c0b-3188-4442-9146-1cd4d6ea45df.jpeg";
import photo16 from "./assets/image1_files/48a8ffbc-fbf7-4f84-bc29-ee400da3f08b.jpeg";
import photo17 from "./assets/image1_files/3cf31697-f3f3-4c60-82c4-029acb119ae4.jpeg";
import photo18 from "./assets/image1_files/97c78f8a-5090-4663-aebc-ba4e13b47092.jpeg";
import photo19 from "./assets/image1_files/9aa8e65f-94ac-4ba0-9a10-9ec91e536d22.jpeg";
import photo20 from "./assets/image1_files/246bd88d-4dd6-4117-a401-02a36ebfcf16.jpeg";
import photo21 from "./assets/image1_files/4fede77d-7a71-446f-89e3-263af937f3fa.jpeg";
import photo22 from "./assets/image1_files/79f59adb-5a5f-4d6c-8109-1f01f4ca0d03.jpeg";
import photo23 from "./assets/image1_files/f19d8c0a-1d88-42a4-9218-686d4f0db7e4.jpeg";
import photo24 from "./assets/image1_files/23ea6621-6f74-4baa-acea-2fd03e312b41.jpeg";
import photo25 from "./assets/image1_files/5adfdf3e-d497-4efc-ab8c-fc559dab311e.jpeg";
import photo26 from "./assets/image1_files/608748cd-6ee7-4a71-88a2-ba79d3ddba5a.jpeg";
import photo27 from "./assets/image1_files/5b856fde-a393-41bf-b373-c9d02e64221f.jpeg";
import photo28 from "./assets/image1_files/c904e1ab-a39d-4ef0-bdea-8c0bd16b9e3d.jpeg";
import photo29 from "./assets/image1_files/42befad7-fb29-473d-91db-b03e7a544d1d.jpeg";
import photo30 from "./assets/image1_files/fc02f48f-a937-42c5-895d-f9cc3113d6ca.jpeg";
import photo31 from "./assets/image1_files/929545d3-e241-46c0-8a70-c24531ce7b54.jpeg";
import photo32 from "./assets/image1_files/8eb65a8b-e795-4870-b141-6f63b1be24ae.jpeg";
import photo33 from "./assets/image1_files/70325367-cbae-4993-b560-18cd3f6edd53.jpeg";
import photo34 from "./assets/image1_files/cc7a56bd-242c-498a-9aef-0cffac619e54.jpeg";
import photo35 from "./assets/image1_files/30ad93b2-293f-494d-b645-626303c6cb93.jpeg";
import photo36 from "./assets/image1_files/9642a60d-e9de-4e1a-89c2-9ebd230f4a74.jpeg";
import photo37 from "./assets/image1_files/b6599f26-d65c-4df0-baf2-ef18c82a86a3.jpeg";
import photo38 from "./assets/image1_files/dc01fd46-b119-48d3-a43b-f6c093e26eca.jpeg";
import photo39 from "./assets/image1_files/fe37b80e-da8a-4225-b27b-dfbb5d763c01.jpeg";
import photo40 from "./assets/image1_files/3c90338e-86b4-423f-aae1-279e0ccc3a18.jpeg";
import photo41 from "./assets/image1_files/862d936c-0f34-4e50-af87-b519e2781d19.jpeg";
import photo42 from "./assets/image1_files/79addceb-8c2d-419b-80ff-e29af426a94c.jpeg";

// Import other assets in image1_files
import hostAvatar from "./assets/image1_files/host.jpeg";
import co1 from "./assets/image1_files/co1.jpg";
import co2 from "./assets/image1_files/co2.jpg";
import co3 from "./assets/image1_files/co3.jpg";

import s1 from "./assets/image1_files/s1.jpeg";
import s2 from "./assets/image1_files/s2.jpeg";
import s3 from "./assets/image1_files/s3.jpeg";
import s4 from "./assets/image1_files/s4.jpeg";
import s5 from "./assets/image1_files/s5.jpeg";
import s6 from "./assets/image1_files/s6.jpeg";

import rev1 from "./assets/image1_files/rev1.jpeg";
import rev2 from "./assets/image1_files/rev2.jpeg";
import rev3 from "./assets/image1_files/rev3.jpeg";
import rev4 from "./assets/image1_files/rev4.jpeg";
import rev5 from "./assets/image1_files/rev5.jpeg";

export const listing: Listing = {
  title: "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10",
  location: "Candolim, Goa, India",
  rating: 4.95,
  reviewCount: 19,
  isSuperhost: false,
  host: {
    name: "Mirashya Homes",
    avatar: hostAvatar,
    yearsHosting: 2,
    isSuperhost: false,
  },
  stats: { guests: 3, bedrooms: 1, beds: 1, baths: 1 },
  pricePerNight: 4820,
  currency: "₹",
  nights: 5,
  cleaningFee: 1500,
  serviceFee: 2899,
  description: [
    "🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴"
  ],
  amenities: [
    { icon: "waves", label: "Hot tub", category: "Bathroom" },
    { icon: "wind", label: "Hairdryer", category: "Bathroom" },
    { icon: "droplet", label: "Shampoo & conditioner", category: "Bathroom" },
    { icon: "shower-gel", label: "Shower gel", category: "Bathroom" },
    { icon: "cleaning-products", label: "Cleaning products", category: "Bathroom" },
    { icon: "hot-water", label: "Hot water", category: "Bathroom" },
    { icon: "washing-machine", label: "Washing machine", category: "Laundry" },
    { icon: "shirt", label: "Hangers", category: "Closet" },
    { icon: "iron", label: "Iron", category: "Closet" },
    { icon: "bed", label: "Bed linen & pillows", category: "Bedroom" },
    { icon: "blinds", label: "Room-darkening blinds", category: "Bedroom" },
    { icon: "closet", label: "Clothes storage", category: "Bedroom" },
    { icon: "baby", label: "Cot", category: "Family" },
    { icon: "wifi", label: "Wifi", category: "Internet" },
    { icon: "briefcase", label: "Dedicated workspace", category: "Internet/Work" },
    { icon: "utensils", label: "Kitchen", category: "Dining" },
    { icon: "fridge", label: "Fridge", category: "Dining" },
    { icon: "freezer", label: "Freezer", category: "Dining" },
    { icon: "microwave", label: "Microwave", category: "Dining" },
    { icon: "cooker", label: "Cooker", category: "Dining" },
    { icon: "coffee", label: "Coffee", category: "Dining" },
    { icon: "toaster", label: "Toaster", category: "Dining" },
    { icon: "blender", label: "Blender", category: "Dining" },
    { icon: "wine-glass", label: "Wine glasses", category: "Dining" },
    { icon: "kettle", label: "Kettle", category: "Dining" },
    { icon: "cooking-basics", label: "Cooking basics", category: "Dining" },
    { icon: "crockery", label: "Crockery and cutlery", category: "Dining" },
    { icon: "wind", label: "Air conditioning", category: "Climate" },
    { icon: "fan", label: "Ceiling fan", category: "Climate" },
    { icon: "tv", label: "TV", category: "Entertainment" },
    { icon: "shield", label: "Carbon monoxide alarm", category: "Safety" },
    { icon: "shield-alert", label: "Smoke alarm", category: "Safety" },
    { icon: "camera", label: "Exterior security cameras on property", category: "Safety" },
    { icon: "key", label: "Private entrance", category: "Location" },
    { icon: "balcony", label: "Patio or balcony", category: "Outdoor" },
    { icon: "outdoor-dining", label: "Outdoor dining area", category: "Outdoor" },
    { icon: "car", label: "Free parking on premises", category: "Facilities" },
    { icon: "pool", label: "Pool", category: "Facilities" },
    { icon: "gym", label: "Gym", category: "Facilities" },
    { icon: "paw", label: "Pets allowed", category: "Services" },
    { icon: "cleaning", label: "Cleaning available during stay", category: "Services" },
    { icon: "calendar", label: "Long-term stays allowed", category: "Services" },
    { icon: "door", label: "Self check-in", category: "Services" },
    { icon: "droplet", label: "Body soap", category: "Bathroom" },
    { icon: "droplet", label: "Shampoo", category: "Bathroom" },
    { icon: "shirt", label: "Ironing board", category: "Closet" },
    { icon: "bed", label: "Extra pillows and blankets", category: "Bedroom" },
    { icon: "utensils", label: "Oven", category: "Dining" },
    { icon: "utensils", label: "Dishes and silverware", category: "Dining" },
    { icon: "balcony", label: "Outdoor furniture", category: "Outdoor" }
  ],
  categoryRatings: [
    { label: "Cleanliness", value: 5.0 },
    { label: "Accuracy", value: 5.0 },
    { label: "Check-in", value: 5.0 },
    { label: "Communication", value: 5.0 },
    { label: "Location", value: 4.8 },
    { label: "Value", value: 4.8 },
  ],
};

export const photos: Photo[] = [
  { src: photo0, alt: "Living room 1", room: "Living room 1" },
  { src: photo1, alt: "Living room 1", room: "Living room 1" },
  { src: photo2, alt: "Living room 1", room: "Living room 1" },
  { src: photo3, alt: "Living room 2", room: "Living room 2" },
  { src: photo4, alt: "Living room 2", room: "Living room 2" },
  { src: photo5, alt: "Living room 2", room: "Living room 2" },
  { src: photo6, alt: "Living room 2", room: "Living room 2" },
  { src: photo7, alt: "Living room 2", room: "Living room 2" },
  { src: photo8, alt: "Living room 2", room: "Living room 2" },
  { src: photo9, alt: "Living room 2", room: "Living room 2" },
  { src: photo10, alt: "Full kitchen", room: "Full kitchen" },
  { src: photo11, alt: "Full kitchen", room: "Full kitchen" },
  { src: photo12, alt: "Bedroom", room: "Bedroom" },
  { src: photo13, alt: "Bedroom", room: "Bedroom" },
  { src: photo14, alt: "Bedroom", room: "Bedroom" },
  { src: photo15, alt: "Bedroom", room: "Bedroom" },
  { src: photo16, alt: "Bedroom", room: "Bedroom" },
  { src: photo17, alt: "Bedroom", room: "Bedroom" },
  { src: photo18, alt: "Full bathroom", room: "Full bathroom" },
  { src: photo19, alt: "Gym", room: "Gym" },
  { src: photo20, alt: "Gym", room: "Gym" },
  { src: photo21, alt: "Gym", room: "Gym" },
  { src: photo22, alt: "Gym", room: "Gym" },
  { src: photo23, alt: "Gym", room: "Gym" },
  { src: photo24, alt: "Exterior", room: "Exterior" },
  { src: photo25, alt: "Exterior", room: "Exterior" },
  { src: photo26, alt: "Exterior", room: "Exterior" },
  { src: photo27, alt: "Exterior", room: "Exterior" },
  { src: photo28, alt: "Exterior", room: "Exterior" },
  { src: photo29, alt: "Exterior", room: "Exterior" },
  { src: photo30, alt: "Pool", room: "Pool" },
  { src: photo31, alt: "Pool", room: "Pool" },
  { src: photo32, alt: "Pool", room: "Pool" },
  { src: photo33, alt: "Additional photos", room: "Additional photos" },
  { src: photo34, alt: "Additional photos", room: "Additional photos" },
  { src: photo35, alt: "Additional photos", room: "Additional photos" },
  { src: photo36, alt: "Additional photos", room: "Additional photos" },
  { src: photo37, alt: "Additional photos", room: "Additional photos" },
  { src: photo38, alt: "Additional photos", room: "Additional photos" },
  { src: photo39, alt: "Additional photos", room: "Additional photos" },
  { src: photo40, alt: "Additional photos", room: "Additional photos" },
  { src: photo41, alt: "Additional photos", room: "Additional photos" },
  { src: photo42, alt: "Additional photos", room: "Additional photos" },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Amit",
    date: "1 week ago",
    yearsOnPlatform: 0, // 2 months
    text: "Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.",
    avatarColor: "#C1852A",
    rating: 5,
    tags: ["Comfort", "Location", "Hospitality"]
  },
  {
    id: "r2",
    name: "Aheesh",
    date: "2 weeks ago",
    yearsOnPlatform: 3,
    text: "We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.",
    avatarColor: "#059669",
    rating: 5,
    avatar: rev1,
    tags: ["Comfort", "Cleanliness", "Accuracy", "Hospitality"]
  },
  {
    id: "r3",
    name: "Samiksha",
    date: "May 2026",
    yearsOnPlatform: 0.7, // 8 months
    text: "the host nitish was really great help",
    avatarColor: "#7C3AED",
    rating: 5,
    avatar: rev2,
    tags: ["Hospitality"]
  },
  {
    id: "r4",
    name: "Vedant",
    date: "May 2026",
    yearsOnPlatform: 4,
    text: "We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine. The highlight of our stay was definitely the jacuzzi. It was clean, well-kept, and the perfect place to relax after a day of exploring Goa. It added a luxurious touch to our vacation and made our experience even more memorable. The property was exactly as described, well-equipped, and offered a peaceful atmosphere. We would highly recommend this place to anyone looking for a comfortable, clean, and relaxing stay in Goa. Looking forward to visiting again!",
    avatarColor: "#8B6FC4",
    rating: 5,
    tags: ["Comfort", "Cleanliness", "Hot tub", "Condition"]
  },
  {
    id: "r5",
    name: "Vaibhav S",
    date: "May 2026",
    yearsOnPlatform: 3,
    text: "Great great experience living out there , can't expect more , will always look for it in the future and will recommend my friends too.",
    avatarColor: "#2563EB",
    rating: 5,
    avatar: rev3,
    tags: ["Comfort"]
  },
  {
    id: "r6",
    name: "Mohd",
    date: "May 2026",
    yearsOnPlatform: 5,
    text: "Great place. Exactly as described in the listing.",
    avatarColor: "#0891B2",
    rating: 5,
    avatar: rev4,
    tags: ["Accuracy"]
  },
  {
    id: "r7",
    name: "Rahul",
    date: "April 2026",
    yearsOnPlatform: 1,
    text: "The private jacuzzi was absolutely amazing! So clean and relaxing. The bed was super comfortable as well. Highly recommend this stay.",
    avatarColor: "#DC2626",
    rating: 5,
    tags: ["Hot tub", "Comfort"]
  },
  {
    id: "r8",
    name: "Priya",
    date: "April 2026",
    yearsOnPlatform: 2,
    text: "Host was extremely accommodating and check-in was seamless. The photos accurately represent this beautiful space.",
    avatarColor: "#DB2777",
    rating: 5,
    tags: ["Hospitality", "Accuracy"]
  },
  {
    id: "r9",
    name: "Aditya",
    date: "March 2026",
    yearsOnPlatform: 1,
    text: "Pristine condition and spotless cleanliness. You can tell they put a lot of effort into maintaining the property. Will return!",
    avatarColor: "#D97706",
    rating: 5,
    tags: ["Condition", "Cleanliness"]
  },
  {
    id: "r10",
    name: "Ananya",
    date: "March 2026",
    yearsOnPlatform: 0.5,
    text: "Very warm hospitality. Nitish and the team made sure we had everything we needed.",
    avatarColor: "#059669",
    rating: 5,
    tags: ["Hospitality"]
  },
  {
    id: "r11",
    name: "Siddharth",
    date: "February 2026",
    yearsOnPlatform: 3,
    text: "The kitchen is fully equipped and the jacuzzi is the best part of the balcony. Had a wonderful time.",
    avatarColor: "#2563EB",
    rating: 5,
    tags: ["Hot tub", "Amenities"]
  },
  {
    id: "r12",
    name: "Neha",
    date: "February 2026",
    yearsOnPlatform: 1.5,
    text: "Lovely interior decor and a very cozy vibe. We felt completely relaxed and comfortable throughout our stay.",
    avatarColor: "#7C3AED",
    rating: 5,
    tags: ["Comfort", "Decor"]
  },
  {
    id: "r13",
    name: "Karan",
    date: "January 2026",
    yearsOnPlatform: 2,
    text: "Everything matched the listing description perfectly. The team was very communicative and responsive.",
    avatarColor: "#B45309",
    rating: 5,
    tags: ["Accuracy", "Hospitality"]
  },
  {
    id: "r14",
    name: "Sneha",
    date: "January 2026",
    yearsOnPlatform: 1,
    text: "Loved the indoor spaces and the jacuzzi. Ideal place to unwind after a busy week.",
    avatarColor: "#047857",
    rating: 5,
    tags: ["Hot tub", "Indoor spaces"]
  },
  {
    id: "r15",
    name: "Rohan",
    date: "December 2025",
    yearsOnPlatform: 2.5,
    text: "Great amenities, high-speed wifi, and great support from the host team. Very responsive.",
    avatarColor: "#4338CA",
    rating: 5,
    tags: ["Hospitality", "Amenities"]
  },
  {
    id: "r16",
    name: "Tanvi",
    date: "December 2025",
    yearsOnPlatform: 0.8,
    text: "Excellent location near the main attractions in Candolim. The apartment condition was great, just a minor issue with the bathroom tap which was resolved quickly.",
    avatarColor: "#BE185D",
    rating: 4,
    tags: ["Location", "Condition"]
  },
  {
    id: "r17",
    name: "Arjun",
    date: "November 2025",
    yearsOnPlatform: 3,
    text: "Super clean rooms and spacious indoor layout. Loved the setup of the living room and sofa.",
    avatarColor: "#15803D",
    rating: 5,
    tags: ["Cleanliness", "Indoor spaces"]
  },
  {
    id: "r18",
    name: "Ishaan",
    date: "October 2025",
    yearsOnPlatform: 2,
    text: "Beautiful decor accents and very helpful hosts. They helped us with scooter rentals and recommendations.",
    avatarColor: "#6D28D9",
    rating: 5,
    tags: ["Hospitality", "Decor"]
  },
  {
    id: "r19",
    name: "Riya",
    date: "September 2025",
    yearsOnPlatform: 1.2,
    text: "The jacuzzi on the private deck is a dream! The listing description is 100% accurate. Very clean and well-kept condition.",
    avatarColor: "#A21CAF",
    rating: 5,
    tags: ["Hot tub", "Accuracy", "Condition"]
  }
];

export interface StayNearby {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
}

export const staysNearby: StayNearby[] = [
  { id: "s1", title: "Beautiful Studio with a view to die for", price: 23600, rating: 4.91, image: s1 },
  { id: "s2", title: "NAQAB - 1bhk with private pool", price: 42218, rating: 4.95, image: s2 },
  { id: "s3", title: "Greentique Luxury Flat with plunge pool, Calangute", price: 44506, rating: 4.94, image: s3 },
  { id: "s4", title: "The Tropical Studio | 5 mins to Beach", price: 22824, rating: 4.96, image: s4 },
  { id: "s5", title: "Luxury Casa Bella 1BHK with plunge pool, Calangute", price: 39942, rating: 4.93, image: s5 },
  { id: "s6", title: "Kanso by Earthen Window | Jacuzzi | Terrace | Pool", price: 45648, rating: 4.92, image: s6 },
  { id: "s7", title: "Luxury Apt | Private Pool | 6 Mins from Beach", price: 48786, rating: 4.93, image: s2 },
  { id: "s8", title: "Serendipity Cottage - Calm Stay in Calangute-Baga.", price: 22824, rating: 4.92, image: s4 },
];

export const coHosts = [
  { name: "Sharath", avatar: co1 },
  { name: "Aman Dev Pahwa", avatar: co2 },
  { name: "Maria Karen Priyanka", avatar: co3 },
  { name: "Simran", avatar: rev5 },
  { name: "Pallavi", avatar: rev1 },
  { name: "Sanyukta", avatar: rev2 },
  { name: "Shruti", avatar: "", bg: "rgb(253, 231, 239)", fg: "rgb(212, 53, 110)" },
  { name: "Amisha", avatar: "", bg: "rgb(231, 240, 253)", fg: "rgb(58, 110, 204)" }
];
