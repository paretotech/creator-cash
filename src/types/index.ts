export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'digital' | 'physical';
}

export interface ShoutoutOption {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: string; // e.g., "24 hours", "3-5 days"
}

export interface HireService {
  id: string;
  title: string;
  description: string;
  price: number;
  timeEstimate: string; // e.g., "2 weeks", "1 month"
}

export interface PrivateGroup {
  id: string;
  name: string;
  description: string;
  membershipFee: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  benefits: string[];
}

export interface CreatorSettings {
  enableQuestions: boolean;
  enableCalls: boolean;
  enableProducts: boolean;
  enableShoutouts: boolean;
  enableHiring: boolean;
  enablePrivateGroups: boolean;
  enableTips: boolean;
  enableWaitlist: boolean;
  enableFavorites: boolean;
}

export interface QuestionResponseOption {
  id: string;
  type: 'text' | 'video' | 'audio';
  title: string;
  description: string;
  price: number;
  estimatedResponseTime: string;
}

export interface Favorite {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  affiliateLink?: boolean;
}

export interface Creator {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  questionResponseOptions: QuestionResponseOption[];
  callPrice: {
    min: number;
    max: number;
  };
  products: Product[];
  shoutoutOptions: ShoutoutOption[];
  hireServices: HireService[];
  privateGroups: PrivateGroup[];
  favorites: Favorite[];
  waitlistConfig?: {
    title?: string;
    description: string;
    interestCategories?: string[];
    estimatedWaitTime?: string;
    customQuestions?: Array<{
      id: string;
      question: string;
      required: boolean;
    }>;
  };
  settings: CreatorSettings;
}

export interface Question {
  id: string;
  creatorUsername: string;
  senderName: string;
  senderEmail: string;
  content: string;
  amount: number;
  responseOptionId: string;
  responseType: 'text' | 'video' | 'audio';
  status: 'pending' | 'answered';
  timestamp: string;
  response?: string;
}

export interface CallBooking {
  id: string;
  creatorUsername: string;
  bookerName: string;
  bookerEmail: string;
  duration: number;
  preferredDate: string[];
  notes: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: string;
}

export interface Tip {
  id: string;
  creatorUsername: string;
  senderName: string;
  message?: string;
  amount: number;
  timestamp: string;
}

export interface WaitlistItem {
  id: string;
  creatorUsername: string;
  subscriberName: string;
  subscriberEmail: string;
  reason?: string;
  interests: string[];
  notificationPreference: 'email' | 'sms' | 'both';
  phone?: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}
