import type { Stay, Testimonial, NavLink } from './types';

export const mockStays: Stay[] = [
  {
    id: '1',
    name: 'The Forest Dream',
    slug: 'the-forest-dream',
    short_description: 'A secluded tent for an immersive nature experience.',
    long_description: 'Nestled deep within the ancient woods, The Forest Dream offers unparalleled privacy and a direct connection to nature. Wake up to the sound of birds and spend your evenings by a crackling fire. This tent features a queen-sized bed, a cozy sitting area, and a private deck overlooking the forest floor.',
    price_per_night: 250,
    max_guests: 2,
    amenities: ['fireplace', 'pet-friendly', 'wifi'],
    images: ['stay-1', 'stay-1-gallery-1', 'stay-1-gallery-2'],
    is_featured: true,
  },
  {
    id: '2',
    name: 'The Star Gazer',
    slug: 'the-star-gazer',
    short_description: 'A geodesic dome with panoramic sky views.',
    long_description: 'Our Star Gazer dome is a unique retreat with a transparent ceiling, perfect for watching the night sky from the comfort of your bed. It includes a king-sized bed, a modern kitchenette, a private jacuzzi, and a telescope for astronomical observation.',
    price_per_night: 400,
    max_guests: 2,
    amenities: ['jacuzzi', 'kitchenette', 'wifi', 'ac'],
    images: ['stay-2', 'stay-2-gallery-1', 'stay-2-gallery-2'],
    is_featured: true,
  },
  {
    id: '3',
    name: 'The River Whisper',
    slug: 'the-river-whisper',
    short_description: 'A tranquil cabin situated by a gentle river.',
    long_description: 'The River Whisper cabin combines rustic charm with modern luxury. Enjoy the soothing sounds of the flowing river from your private porch. This spacious cabin is ideal for families, featuring two bedrooms, a full kitchen, and a large living area with a stone fireplace.',
    price_per_night: 350,
    max_guests: 4,
    amenities: ['kitchenette', 'fireplace', 'pet-friendly', 'wifi'],
    images: ['stay-3', 'stay-3-gallery-1', 'stay-3-gallery-2'],
    is_featured: true,
  },
];

export const mockTestimonials: Testimonial[] = [
    {
        id: '1',
        quote: "An absolutely magical experience. The attention to detail was incredible, and we felt completely disconnected from the world. We're already planning our next trip back!",
        author: 'Jessica L.',
        location: 'New York, NY',
        imageId: 'testimonial-1'
    },
    {
        id: '2',
        quote: "Glampify is the perfect blend of luxury and nature. The accommodations were pristine, and the service was top-notch. The private jacuzzi under the stars was the highlight of our stay.",
        author: 'Mark T.',
        location: 'San Francisco, CA',
        imageId: 'testimonial-2'
    }
];

export const navLinks: NavLink[] = [
    { href: '/stays', label: 'Stays' },
    { href: '/experience', label: 'Experience' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export const footerLinks = {
    company: [
        { href: '/about', label: 'About Us' },
        { href: '/faq', label: 'FAQ' },
        { href: '/updates', label: 'Updates' },
    ],
    support: [
        { href: '/contact', label: 'Contact' },
        { href: '/policies', label: 'Policies' },
    ],
};
