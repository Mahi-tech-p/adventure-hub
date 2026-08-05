export interface UserProfileDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatarUrl: string | null;
  bio: string | null;
}
export interface updateProfileDto {
    fullName?: string,
    phone? : string,
    dateofBirth? : string,
    gender? : string,
    bio? : string
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}