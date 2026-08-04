
export interface RegisterDto {
    fullName: string,
    email: string,
    password: string
}

export interface LoginDto{
    email : string,
    password: string
}

export interface AuthResponseDto {
    user: {
        id: string,
        fullName: string,
        email: string
    };
    accessToken: string,
    refreshToken: string
}

export interface logoutDto {
    refreshToken: string
}