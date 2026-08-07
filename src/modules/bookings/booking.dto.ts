export interface CreateBookingDto {
  activityId: string;

  slotId: string;

  numberOfTickets: number;
}

export interface BookingResponseDto {
  id: string;

  bookingReference: string;

  userId: string;

  activityId: string;

  slotId: string;

  numberOfTickets: number;

  pricePerTicket: string;

  totalAmount: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

  createdAt: Date;
}