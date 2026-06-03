export const USER_TYPE = {
  CLIENT:         'CLIENT',
  STAFF:          'STAFF',
  ADMIN:          'ROLE_ADMIN',
  SUPER_ADMIN:    'SUPER_ADMIN',
  CREDIT_MANAGER: 'CREDIT_MANAGER',
  RISK_MANAGER:   'RISK_MANAGER',
  SALES_STAFF:    'SALES_STAFF',
} as const;
export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE];

/** Roles that can access the Underwriting Dashboard */
export const UNDERWRITING_ROLES: UserType[] = [
  USER_TYPE.SUPER_ADMIN,
  USER_TYPE.ADMIN,
  USER_TYPE.CREDIT_MANAGER,
  USER_TYPE.RISK_MANAGER,
];

/** Returns true if the user has at least one of the given roles */
export function hasAnyRole(roles: UserType[] | undefined, ...check: UserType[]): boolean {
  return (roles ?? []).some((r) => check.includes(r));
}
