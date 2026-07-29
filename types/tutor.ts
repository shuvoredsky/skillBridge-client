export interface TutorProfile {
  id: string;
  userId: string;
  bio: string | null;
  subjects: string[];
  hourlyRate: number;
  experience: string | null;
  education: string | null;
  rating: number;
  totalReviews: number;
  profilePhoto?: string | null;
  profilePhotoUrl?: string | null;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  documents?: TutorDocument[];
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  reviews?: any[];
}

export interface TutorDocument {
  id: string;
  tutorId: string;
  type: "DEGREE" | "NID" | "CERTIFICATE";
  url: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  subject: string;
  notes: string | null;
  meetingLink?: string | null;
  meetingPlatform?: "GOOGLE_MEET" | "ZOOM" | "MS_TEAMS" | null;
  student: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateProfilePayload {
  bio: string;
  subjects: string[];
  hourlyRate: number;
  experience?: string;
  education?: string;
}

export interface CreateAvailabilityPayload {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}