export interface User {
  id?: number;
  name: string;
  email: string;
  dob?: Date;
  weight?: number;
  height?: number;
  profile_pic?: string;
  profile_pic_public_id?: string;
  role: "gymmer" | "viewer";
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  dob?: string;
  weight?: number;
  height?: number;
  profile_pic?: string;
  profile_pic_public_id?: string;
  role: "gymmer" | "viewer";
}

export interface UpdateUserDTO {
  name?: string;
  email: string;
  dob?: string;
  weight?: number;
  height?: number;
  profile_pic?: string;
  profile_pic_public_id?: string;
  role?: "gymmer" | "viewer";
}
