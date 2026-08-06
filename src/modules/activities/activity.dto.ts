import { PaginationQueryDto } from "../../shared/pagination/pagination.dto.js";

export interface CreateActivityDto {
  parkId: string;

  name: string;
  description?: string;
  shortDescription?: string;

  price: string;
  currency?: string;

  durationMinutes: number;

  minimumAge?: number;
  maximumAge?: number;

  minimumHeight?: number;
  maximumHeight?: number;

  minimumWeight?: number;
  maximumWeight?: number;

  capacity: number;

  difficulty: "EASY" | "MEDIUM" | "HARD";
}
export interface UpdateActivityDto extends Partial<CreateActivityDto> {}

export interface ActivityResponseDto {
  id: string;

  parkId: string;

  name: string;
  slug: string;

  description: string | null;
  shortDescription: string | null;

  price: string;
  currency: string;

  durationMinutes: number;

  minimumAge: number | null;
  maximumAge: number | null;

  minimumHeight: number | null;
  maximumHeight: number | null;

  minimumWeight: number | null;
  maximumWeight: number | null;

  capacity: number;

  difficulty: "EASY" | "MEDIUM" | "HARD";

  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";

  isActive: boolean;

  createdAt: Date;
}

export interface GetActivitiesDto extends PaginationQueryDto {
  parkId?: string;

  difficulty: "EASY" | "MEDIUM" | "HARD";
  status?: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  isActive?: boolean
}
