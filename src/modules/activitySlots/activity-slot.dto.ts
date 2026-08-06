export interface CreateActivitySlotDto {
  activityId: string;

  slotDate: string;

  startTime: string;

  endTime: string;

  capacity: number;

  priceOverride?: string;
}

export interface UpdateActivitySlotDto
  extends Partial<CreateActivitySlotDto> {}

export interface ActivitySlotResponseDto {
  id: string;

  activityId: string;

  slotDate: string;

  startTime: string;

  endTime: string;

  capacity: number;

  bookedCount: number;

  availableCount: number;

  priceOverride: string | null;

  status:
    | "AVAILABLE"
    | "FULL"
    | "CANCELLED";

  createdAt: Date;
}