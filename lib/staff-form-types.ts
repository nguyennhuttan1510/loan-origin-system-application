import {z} from 'zod'

export const staffFormSchema = z.object({
  name: z.string().min(1, "Fullname is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  nationalId: z.string().min(1, "NationalId is required"),
  national: z.string().min(1, "National is required"),
  roles: z.array(z.string()).min(1, "Roles is required"),
})

export type StaffFormTypes = z.infer<typeof staffFormSchema> & {id?: number}