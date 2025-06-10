export interface AuthResponse {
  auth: Auth;
  userTenants: UserTenant[];
  user: User;
}

export interface Auth {
  mfaRequired: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expires: string;
  userId: string;
}

export interface UserTenant {
  id: string;
  _id: string;
  __v: number;
  vendorId: string;
  tenantId: string;
  name: string;
  timezone: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
  applicationUrl: string;
  isReseller: boolean;
  creatorEmail: string;
  metadata: string;
  loginUrl: string;
  alias: string;
  hasCustomLogin: boolean;
}

export interface User {
  id: string;
  name: string;
  profilePictureUrl: string;
  email: string;
  sub: string;
  verified: boolean;
  phoneNumber: string | null;
  provider: string;
  mfaEnrolled: boolean;
  metadata: string;
  vendorMetadata: any | null;
  tenantIds: string[];
  tenantId: string;
  roles: any[];
  permissions: any[];
  createdAt: string;
  isLocked: boolean;
  tenants: UserTenantInfo[];
  managedBy: string;
  groups: any[];
  subAccountAccessAllowed: boolean;
  activatedForTenant: boolean;
}

export interface UserTenantInfo {
  tenantId: string;
  roles: Role[];
  expirationDate: string | null;
  isDisabled: boolean;
}

export interface Role {
  id: string;
  vendorId: string;
  tenantId: string | null;
  key: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  firstUserRole: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  level: number;
}
