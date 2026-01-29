export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    avatar_url?: string
    full_name?: string
  }
}

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAdmin: boolean
}
