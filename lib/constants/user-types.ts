export const USER_TYPE = { CLIENT: 'CLIENT', STAFF: 'STAFF', ADMIN: 'ADMIN' } as const;
export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE];
