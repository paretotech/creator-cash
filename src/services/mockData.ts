import { Creator, Question, CallBooking, Tip, Product, ShoutoutOption, HireService, PrivateGroup, CreatorSettings, WaitlistItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock creator data
export const creators: Record<string, Creator> = {
  'johndoe': {
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Digital creator and web developer. Ask me anything about React and web development!',
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
    questionResponseOptions: [
      {
        id: 'qro1',
        type: 'text',
        title: 'Text Response',
        description: 'I will answer your question with a detailed text response',
        price: 5,
        estimatedResponseTime: '24-48 hours'
      },
      {
        id: 'qro2',
        type: 'video',
        title: 'Video Response',
        description: 'I will record a video answering your question in detail',
        price: 25,
        estimatedResponseTime: '3-5 days'
      },
      {
        id: 'qro3',
        type: 'audio',
        title: 'Audio Response',
        description: 'I will record an audio message answering your question',
        price: 15,
        estimatedResponseTime: '2-3 days'
      }
    ],
    callPrice: {
      min: 25,
      max: 200
    },
    settings: {
      enableQuestions: true,
      enableCalls: true,
      enableProducts: true,
      enableShoutouts: true,
      enableHiring: true,
      enablePrivateGroups: true,
      enableTips: true,
      enableWaitlist: true,
      enableFavorites: true
    },
    waitlistConfig: {
      description: 'Join my waitlist to be notified when I have availability. Limited spots are available!',
      estimatedWaitTime: '2-4 weeks'
    },
    products: [
      {
        id: '1',
        title: 'React Mastery Course',
        description: 'A comprehensive course that takes you from React basics to advanced patterns',
        price: 49.99,
        imageUrl: 'https://picsum.photos/seed/react/300/200',
        type: 'digital'
      },
      {
        id: '2',
        title: 'Web Dev Notebook',
        description: 'Hardcover notebook with code snippets and dev tips printed on each page',
        price: 24.99,
        imageUrl: 'https://picsum.photos/seed/notebook/300/200',
        type: 'physical'
      }
    ],
    shoutoutOptions: [
      {
        id: 'so1',
        title: 'Twitter/X Mention',
        description: 'I will give you a shoutout in a tweet to my followers',
        price: 15,
        deliveryTime: '24-48 hours'
      },
      {
        id: 'so2',
        title: 'GitHub Project Star',
        description: 'I will review your GitHub project, star it, and share it with my developer network',
        price: 25,
        deliveryTime: '3-5 days'
      }
    ],
    hireServices: [
      {
        id: 'hs1',
        title: 'Custom Web Development',
        description: 'I will build a custom website or web application for your business or personal needs',
        price: 1500,
        timeEstimate: '2-3 weeks'
      },
      {
        id: 'hs2',
        title: 'Code Review & Optimization',
        description: 'I will review your existing codebase and provide optimization recommendations',
        price: 250,
        timeEstimate: '3-5 days'
      }
    ],
    privateGroups: [
      {
        id: 'pg1',
        name: 'Dev Inner Circle',
        description: 'Join my private developer community with weekly live coding sessions and exclusive content',
        membershipFee: 19.99,
        billingCycle: 'monthly',
        benefits: [
          'Weekly live coding sessions',
          'Private Discord access',
          'Code reviews',
          'Early access to new courses'
        ]
      }
    ],
    favorites: [
      {
        id: 'fav-1',
        title: 'VS Code',
        description: 'My favorite code editor with great extensions for web development',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1200px-Visual_Studio_Code_1.35_icon.svg.png',
        link: 'https://code.visualstudio.com/',
        category: 'Development Tools'
      },
      {
        id: 'fav-2',
        title: 'React Documentation',
        description: 'The best resource for learning React from the ground up',
        imageUrl: 'https://reactjs.org/logo-og.png',
        link: 'https://reactjs.org/docs/getting-started.html',
        category: 'Learning Resources'
      },
      {
        id: 'fav-3',
        title: 'Mechanical Keyboard',
        description: 'My favorite keyboard for coding - improves productivity and feels great',
        imageUrl: 'https://m.media-amazon.com/images/I/71NW1vZEpxL._AC_UY218_.jpg',
        link: 'https://www.amazon.com/mechanical-keyboards/s?k=mechanical+keyboards',
        category: 'Hardware',
        affiliateLink: true
      }
    ]
  },
  'janedoe': {
    username: 'janedoe',
    name: 'Jane Doe',
    bio: 'Content creator and social media specialist. I help brands build their online presence.',
    avatarUrl: 'https://i.pravatar.cc/300?img=5',
    questionResponseOptions: [
      {
        id: 'qro4',
        type: 'text',
        title: 'Text Response',
        description: 'I will provide a detailed text response to your question',
        price: 10,
        estimatedResponseTime: '1-2 days'
      },
      {
        id: 'qro5',
        type: 'video',
        title: 'Video Response',
        description: 'I will create a personalized video answering your question',
        price: 35,
        estimatedResponseTime: '3-4 days'
      }
    ],
    callPrice: {
      min: 50,
      max: 150
    },
    settings: {
      enableQuestions: true,
      enableCalls: true,
      enableProducts: true,
      enableShoutouts: true,
      enableHiring: true,
      enablePrivateGroups: true,
      enableTips: true,
      enableWaitlist: true,
      enableFavorites: true
    },
    waitlistConfig: {
      description: 'Join my waitlist to be notified when I have availability. Limited spots are available!',
      estimatedWaitTime: '2-4 weeks'
    },
    products: [
      {
        id: '3',
        title: 'Social Media Playbook',
        description: 'My top strategies for growing your audience across all major platforms',
        price: 39.99,
        imageUrl: 'https://picsum.photos/seed/playbook/300/200',
        type: 'digital'
      },
      {
        id: '4',
        title: 'Content Calendar Template',
        description: 'Premium template to plan your content 12 months in advance',
        price: 19.99,
        imageUrl: 'https://picsum.photos/seed/calendar/300/200',
        type: 'digital'
      },
      {
        id: '5',
        title: 'Content Creator Hoodie',
        description: 'Premium hoodie with minimalist design',
        price: 59.99,
        imageUrl: 'https://picsum.photos/seed/hoodie/300/200',
        type: 'physical'
      }
    ],
    shoutoutOptions: [
      {
        id: 'so3',
        title: 'Instagram Story Mention',
        description: 'I will mention you or your brand in my Instagram Story',
        price: 35,
        deliveryTime: '24 hours'
      },
      {
        id: 'so4',
        title: 'Instagram Post Feature',
        description: 'I will create a dedicated post featuring your brand or product with my honest review',
        price: 100,
        deliveryTime: '3-5 days'
      },
      {
        id: 'so5',
        title: 'TikTok Integration',
        description: 'I will organically mention or showcase your product in one of my TikTok videos',
        price: 150,
        deliveryTime: '1 week'
      }
    ],
    hireServices: [
      {
        id: 'hs3',
        title: 'Social Media Strategy',
        description: 'I will create a comprehensive social media strategy tailored to your brand',
        price: 500,
        timeEstimate: '1 week'
      },
      {
        id: 'hs4',
        title: 'Content Creation Package',
        description: 'I will create a month\'s worth of content for your social media platforms',
        price: 750,
        timeEstimate: '2 weeks'
      }
    ],
    privateGroups: [
      {
        id: 'pg2',
        name: 'Content Creator Club',
        description: 'Join my exclusive community of content creators for networking, tips, and collaboration opportunities',
        membershipFee: 24.99,
        billingCycle: 'monthly',
        benefits: [
          'Monthly masterclass sessions',
          'Private networking community',
          'Early access to my new templates',
          'Collaboration opportunities'
        ]
      }
    ],
    favorites: [
      {
        id: 'fav-4',
        title: 'Ring Light',
        description: 'Perfect lighting setup for content creation and video calls',
        imageUrl: 'https://m.media-amazon.com/images/I/71jmjOxxT1L._AC_UY218_.jpg',
        link: 'https://www.amazon.com/ring-lights/s?k=ring+lights',
        category: 'Content Creation',
        affiliateLink: true
      },
      {
        id: 'fav-5',
        title: 'Canva Pro',
        description: 'My essential design tool for creating social media graphics and presentations',
        imageUrl: 'https://static.canva.com/static/images/canva_logo_100x100@2x.png',
        link: 'https://www.canva.com/pro/',
        category: 'Design Tools'
      },
      {
        id: 'fav-6',
        title: 'Social Media Marketing Book',
        description: 'This book changed my approach to social media strategy',
        imageUrl: 'https://m.media-amazon.com/images/I/61KS7JOJEkL._SY466_.jpg',
        link: 'https://www.amazon.com/Social-Media-Marketing-All-One/dp/1119696771/',
        category: 'Books',
        affiliateLink: true
      }
    ]
  },
  'janelle': {
    username: 'janelle',
    name: 'Janelle',
    bio: 'Fashion influencer. Ask me anything about fashion and sewing!',
    avatarUrl: 'https://i.pravatar.cc/300?img=9',
    questionResponseOptions: [
      {
        id: 'qro6',
        type: 'text',
        title: 'Standard Text Response',
        description: 'I will answer your fashion question with a detailed text response',
        price: 15,
        estimatedResponseTime: '24 hours'
      },
      {
        id: 'qro7',
        type: 'text',
        title: 'Premium Text Response',
        description: 'I will provide an in-depth answer with fashion recommendations and links to products',
        price: 30,
        estimatedResponseTime: '48 hours'
      },
      {
        id: 'qro8',
        type: 'video',
        title: 'Video Style Advice',
        description: 'I will record a personalized video with style advice and demonstration',
        price: 75,
        estimatedResponseTime: '3-5 days'
      }
    ],
    callPrice: {
      min: 75,
      max: 250
    },
    settings: {
      enableQuestions: true,
      enableCalls: true,
      enableProducts: true,
      enableShoutouts: true,
      enableHiring: true,
      enablePrivateGroups: true,
      enableTips: true,
      enableWaitlist: true,
      enableFavorites: true
    },
    waitlistConfig: {
      description: 'Join my waitlist to be notified when I have availability. Limited spots are available!',
      estimatedWaitTime: '2-4 weeks'
    },
    products: [
      {
        id: '6',
        title: 'Fashion Forward E-Book',
        description: 'My guide to predicting and adapting to upcoming fashion trends',
        price: 29.99,
        imageUrl: 'https://picsum.photos/seed/fashion/300/200',
        type: 'digital'
      },
      {
        id: '7',
        title: 'Beginner Sewing Patterns Bundle',
        description: 'Digital patterns with step-by-step instructions for creating your first garments',
        price: 34.99,
        imageUrl: 'https://picsum.photos/seed/sewing/300/200',
        type: 'digital'
      },
      {
        id: '8',
        title: 'Sustainable Fabric Swatches',
        description: 'Collection of eco-friendly fabric samples with information cards',
        price: 45.99,
        imageUrl: 'https://picsum.photos/seed/fabric/300/200',
        type: 'physical'
      },
      {
        id: '9',
        title: 'Signature Scarf',
        description: 'My limited edition designer scarf made from premium silk',
        price: 89.99,
        imageUrl: 'https://picsum.photos/seed/scarf/300/200',
        type: 'physical'
      }
    ],
    shoutoutOptions: [
      {
        id: 'so6',
        title: 'OOTD Instagram Feature',
        description: 'I will feature your product in my Outfit Of The Day post on Instagram',
        price: 120,
        deliveryTime: '1 week'
      },
      {
        id: 'so7',
        title: 'Styled Photoshoot',
        description: 'Professional photos of me styling your product, delivered to you for marketing use',
        price: 250,
        deliveryTime: '2 weeks'
      }
    ],
    hireServices: [
      {
        id: 'hs5',
        title: 'Custom Fashion Design',
        description: 'I will design a custom garment or collection based on your requirements',
        price: 1000,
        timeEstimate: '1 month'
      },
      {
        id: 'hs6',
        title: 'Personal Styling Session',
        description: 'I will help you define your personal style and create a capsule wardrobe plan',
        price: 200,
        timeEstimate: '1 week'
      },
      {
        id: 'hs7',
        title: 'Sewing Pattern Creation',
        description: 'I will create a custom digital sewing pattern based on your design ideas',
        price: 350,
        timeEstimate: '2 weeks'
      }
    ],
    privateGroups: [
      {
        id: 'pg3',
        name: 'Stitch & Style Society',
        description: 'My exclusive community for fashion enthusiasts and home sewists',
        membershipFee: 29.99,
        billingCycle: 'monthly',
        benefits: [
          'Weekly sewing tutorials',
          'Monthly trend forecasts',
          'Exclusive pattern releases',
          'Community challenges',
          'Direct message access to me'
        ]
      },
      {
        id: 'pg4',
        name: 'Fashion Industry Insiders',
        description: 'Premium group for serious fashion professionals with industry connections',
        membershipFee: 99.99,
        billingCycle: 'quarterly',
        benefits: [
          'Industry networking events',
          'Trend forecasting workshops',
          'Guest sessions with fashion designers',
          'Early access to fashion week content',
          'Portfolio reviews'
        ]
      }
    ],
    favorites: [
      {
        id: 'fav-7',
        title: 'Sewing Machine',
        description: 'The best sewing machine for beginners and intermediate sewers',
        imageUrl: 'https://m.media-amazon.com/images/I/71euCOZHBAL._AC_UY218_.jpg',
        link: 'https://www.amazon.com/sewing-machines/s?k=sewing+machines',
        category: 'Sewing Equipment',
        affiliateLink: true
      },
      {
        id: 'fav-8',
        title: 'Sustainable Fabric Shop',
        description: 'My favorite place to source eco-friendly fabrics for projects',
        imageUrl: 'https://images.pexels.com/photos/4614226/pexels-photo-4614226.jpeg',
        link: 'https://www.spoonflower.com/en/shop/fabric',
        category: 'Materials'
      },
      {
        id: 'fav-9',
        title: 'Fashion Illustration Course',
        description: 'This course helped me improve my design sketching skills',
        imageUrl: 'https://images.pexels.com/photos/6758029/pexels-photo-6758029.jpeg',
        link: 'https://www.skillshare.com/classes/Fashion-Illustration-Draw-Fashion-Sketches-like-a-Fashion-Designer/1070944309',
        category: 'Courses'
      }
    ]
  }
};

// Interface for product purchase
export interface ProductPurchase {
  id: string;
  creatorUsername: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress?: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'processed' | 'shipped' | 'delivered';
  timestamp: string;
}

// Interface for shoutout booking
export interface ShoutoutBooking {
  id: string;
  creatorUsername: string;
  buyerName: string;
  buyerEmail: string;
  shoutoutOptionId: string;
  details: string;
  amount: number;
  status: 'pending' | 'scheduled' | 'completed';
  timestamp: string;
}

// Interface for hire service booking
export interface HireServiceBooking {
  id: string;
  creatorUsername: string;
  clientName: string;
  clientEmail: string;
  hireServiceId: string;
  projectDetails: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: string;
}

// Interface for private group membership
export interface GroupMembership {
  id: string;
  creatorUsername: string;
  memberName: string;
  memberEmail: string;
  groupId: string;
  startDate: string;
  nextBillingDate: string;
  amount: number;
  status: 'active' | 'cancelled';
  timestamp: string;
}

// Mock storage for various services
let questions: Question[] = [];
let bookings: CallBooking[] = [];
let tips: Tip[] = [];
let waitlistItems: WaitlistItem[] = [];
let purchases: ProductPurchase[] = [];
let shoutoutBookings: ShoutoutBooking[] = [];
let hireServiceBookings: HireServiceBooking[] = [];
let groupMemberships: GroupMembership[] = [];

// Mock API functions
export const getCreator = (username: string): Creator | null => {
  return creators[username] || null;
};

export const askQuestion = (
  creatorUsername: string,
  senderName: string,
  senderEmail: string,
  content: string,
  amount: number,
  responseOptionId: string,
  responseType: 'text' | 'video' | 'audio'
): Question => {
  const newQuestion: Question = {
    id: uuidv4(),
    creatorUsername,
    senderName,
    senderEmail,
    content,
    amount,
    responseOptionId,
    responseType,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  questions.push(newQuestion);
  return newQuestion;
};

export const bookCall = (
  creatorUsername: string,
  bookerName: string,
  bookerEmail: string,
  duration: number,
  preferredDate: string[],
  notes: string,
  amount: number
): CallBooking => {
  const newBooking: CallBooking = {
    id: uuidv4(),
    creatorUsername,
    bookerName,
    bookerEmail,
    duration,
    preferredDate,
    notes,
    amount,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

export const sendTip = (
  creatorUsername: string,
  senderName: string,
  message: string,
  amount: number
): Tip => {
  const newTip: Tip = {
    id: uuidv4(),
    creatorUsername,
    senderName,
    message,
    amount,
    timestamp: new Date().toISOString()
  };
  
  tips.push(newTip);
  return newTip;
};

export const purchaseProduct = (
  creatorUsername: string,
  buyerName: string,
  buyerEmail: string,
  productId: string,
  quantity: number = 1,
  shippingAddress?: string
): ProductPurchase => {
  const creator = getCreator(creatorUsername);
  if (!creator) {
    throw new Error(`Creator ${creatorUsername} not found`);
  }
  
  const product = creator.products.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }
  
  // For physical products, shipping address is required
  if (product.type === 'physical' && !shippingAddress) {
    throw new Error('Shipping address is required for physical products');
  }
  
  const purchase: ProductPurchase = {
    id: uuidv4(),
    creatorUsername,
    buyerName,
    buyerEmail,
    shippingAddress,
    productId,
    quantity,
    amount: product.price * quantity,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  purchases.push(purchase);
  return purchase;
};

// Get all data for a specific creator
export const getCreatorQuestions = (username: string): Question[] => {
  return questions.filter(q => q.creatorUsername === username);
};

export const getCreatorBookings = (username: string): CallBooking[] => {
  return bookings.filter(b => b.creatorUsername === username);
};

export const getCreatorTips = (username: string): Tip[] => {
  return tips.filter(t => t.creatorUsername === username);
};

export const getCreatorProducts = (username: string): Product[] => {
  const creator = getCreator(username);
  return creator ? creator.products : [];
};

export const getCreatorPurchases = (username: string): ProductPurchase[] => {
  return purchases.filter(p => p.creatorUsername === username);
};

// Shoutout functions
export const getShoutoutOption = (username: string, optionId: string): ShoutoutOption | undefined => {
  const creator = getCreator(username);
  return creator?.shoutoutOptions.find(option => option.id === optionId);
};

export const bookShoutout = (
  creatorUsername: string,
  buyerName: string,
  buyerEmail: string,
  shoutoutOptionId: string,
  details: string
): ShoutoutBooking => {
  const creator = getCreator(creatorUsername);
  if (!creator) {
    throw new Error(`Creator ${creatorUsername} not found`);
  }
  
  const option = creator.shoutoutOptions.find(opt => opt.id === shoutoutOptionId);
  if (!option) {
    throw new Error(`Shoutout option ${shoutoutOptionId} not found`);
  }
  
  const booking: ShoutoutBooking = {
    id: uuidv4(),
    creatorUsername,
    buyerName,
    buyerEmail,
    shoutoutOptionId,
    details,
    amount: option.price,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  shoutoutBookings.push(booking);
  return booking;
};

export const getCreatorShoutoutBookings = (username: string): ShoutoutBooking[] => {
  return shoutoutBookings.filter(booking => booking.creatorUsername === username);
};

// Hire service functions
export const getHireService = (username: string, serviceId: string): HireService | undefined => {
  const creator = getCreator(username);
  return creator?.hireServices.find(service => service.id === serviceId);
};

export const bookHireService = (
  creatorUsername: string,
  clientName: string,
  clientEmail: string,
  hireServiceId: string,
  projectDetails: string
): HireServiceBooking => {
  const creator = getCreator(creatorUsername);
  if (!creator) {
    throw new Error(`Creator ${creatorUsername} not found`);
  }
  
  const service = creator.hireServices.find(srv => srv.id === hireServiceId);
  if (!service) {
    throw new Error(`Hire service ${hireServiceId} not found`);
  }
  
  const booking: HireServiceBooking = {
    id: uuidv4(),
    creatorUsername,
    clientName,
    clientEmail,
    hireServiceId,
    projectDetails,
    amount: service.price,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  hireServiceBookings.push(booking);
  return booking;
};

export const getCreatorHireServiceBookings = (username: string): HireServiceBooking[] => {
  return hireServiceBookings.filter(booking => booking.creatorUsername === username);
};

// Private group functions
export const getPrivateGroup = (username: string, groupId: string): PrivateGroup | undefined => {
  const creator = getCreator(username);
  return creator?.privateGroups.find(group => group.id === groupId);
};

export const joinPrivateGroup = (
  creatorUsername: string,
  memberName: string,
  memberEmail: string,
  groupId: string
): GroupMembership => {
  const creator = getCreator(creatorUsername);
  if (!creator) {
    throw new Error(`Creator ${creatorUsername} not found`);
  }
  
  const group = creator.privateGroups.find(grp => grp.id === groupId);
  if (!group) {
    throw new Error(`Private group ${groupId} not found`);
  }
  
  const today = new Date();
  let nextBillingDate = new Date(today);
  
  // Calculate next billing date based on billing cycle
  switch (group.billingCycle) {
    case 'monthly':
      nextBillingDate.setMonth(today.getMonth() + 1);
      break;
    case 'quarterly':
      nextBillingDate.setMonth(today.getMonth() + 3);
      break;
    case 'annually':
      nextBillingDate.setFullYear(today.getFullYear() + 1);
      break;
  }
  
  const membership: GroupMembership = {
    id: uuidv4(),
    creatorUsername,
    memberName,
    memberEmail,
    groupId,
    startDate: today.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
    amount: group.membershipFee,
    status: 'active',
    timestamp: new Date().toISOString()
  };
  
  groupMemberships.push(membership);
  return membership;
};

export const getCreatorGroupMemberships = (username: string): GroupMembership[] => {
  return groupMemberships.filter(membership => membership.creatorUsername === username);
};

// Settings functions
export const updateCreatorSettings = (
  username: string,
  newSettings: Partial<CreatorSettings>
): Creator | null => {
  const creator = getCreator(username);
  if (!creator) {
    return null;
  }
  
  // Update the settings in our mock data
  const creatorRecord = creators[username];
  if (creatorRecord) {
    creatorRecord.settings = {
      ...creatorRecord.settings,
      ...newSettings
    };
    return creatorRecord;
  }
  
  return null;
};

// Waitlist functions
export const joinWaitlist = (
  creatorUsername: string,
  subscriberName: string,
  subscriberEmail: string,
  reason?: string,
  interests: string[] = [],
  notificationPreference: 'email' | 'sms' | 'both' = 'email',
  phone?: string
): WaitlistItem | null => {
  const creator = getCreator(creatorUsername);
  
  if (!creator || !creator.settings.enableWaitlist) {
    return null;
  }
  
  const newWaitlistItem: WaitlistItem = {
    id: uuidv4(),
    creatorUsername,
    subscriberName,
    subscriberEmail,
    reason,
    interests,
    notificationPreference,
    phone,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  waitlistItems.push(newWaitlistItem);
  return newWaitlistItem;
};

// Get waitlist items for a creator
export const getWaitlistItems = (creatorUsername: string): WaitlistItem[] => {
  return waitlistItems.filter((item: WaitlistItem) => item.creatorUsername === creatorUsername);
};

// Update waitlist item status
export const updateWaitlistItemStatus = (
  itemId: string,
  newStatus: 'pending' | 'accepted' | 'rejected'
): WaitlistItem | null => {
  const itemIndex = waitlistItems.findIndex((item: WaitlistItem) => item.id === itemId);
  
  if (itemIndex === -1) {
    return null;
  }
  
  waitlistItems[itemIndex].status = newStatus;
  return { ...waitlistItems[itemIndex] };
};
