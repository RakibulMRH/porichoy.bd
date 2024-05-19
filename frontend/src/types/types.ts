export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    type: string;
    profilePicture: string | null;
    userSessions: UserSession[];
    tenant: Tenant | null;
    subscriptions: Subscription[];
    feedbackReceived: Feedback[];
    feedbackGiven: Feedback[];
    replies: Reply[];
    consultationsBooked: Consultation[];
    consultationsHosted: Consultation[];
    consultationSlots: ConsultationSlot[];
  }
  
  export enum UserType {
    Admin = 'admin',
    Client = 'client',
    AdExpert = 'adExpert',
  }
  
  export interface UserSession {
    session_id: number;
    session_token: string;
    created_at: Date;
    expires_at: Date | null;
    user: User;
  }
  
  export interface Tenant {
    id: number;
    name: string;
    domain: string;
    subscriptionPlan: string;
    paymentDetails: string | null;
    users: User[];
    subscription: Subscription | null;
  }
  
  export interface Subscription {
    id: number;
    startDate: Date;
    endDate: Date;
    paymentStatus: string;
    paymentMethod: string;
    tenant: Tenant;
    plan: SubscriptionPlan;
    user: User;
  }
  
  export interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    subscriptions: Subscription[];
  }
  
  export interface Feedback {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;
    adExpert: User;
    client: User;
    replies: Reply[];
  }
  
  export interface Reply {
    id: number;
    comment: string;
    createdAt: Date;
    feedback: Feedback;
    user: User;
    parentReply: Reply | null;
    replies: Reply[];
  }
  
  export interface Consultation {
    id: number;
    status: string;
    scheduledAt: Date | null;
    client: User;
    adExpert: User;
    slot: ConsultationSlot;
    waitingListPosition: number | null;
  }
  
  export interface ConsultationSlot {
    id: number;
    startTime: Date;
    endTime: Date;
    adExpert: User;
    consultations: Consultation[];
    }

 
 