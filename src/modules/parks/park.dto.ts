export interface CreateParkDto {
  name: string;
  description?: string;
  shortDescription?: string;

  phone?: string;
  email?: string;
  website?: string;

  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;

  latitude?: number;
  longitude?: number;

  openingTime?: string;
  closingTime?: string;
}

export interface ParkResponseDto {
  id: string;
  name: string;
  slug: string;

  description: string | null;
  shortDescription: string | null;

  phone: string | null;
  email: string | null;
  website: string | null;

  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string | null;

  latitude: number | null;
  longitude: number | null;

  openingTime: string | null;
  closingTime: string | null;

  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
}

export interface UpdateParkDto extends Partial<CreateParkDto>{}