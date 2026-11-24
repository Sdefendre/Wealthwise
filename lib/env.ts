import { z } from "zod"

/**
 * Centralized, validated environment access.
 *
 * Server-only secrets live in `serverEnv` and must never be imported into
 * client components. Public values (safe to expose to the browser) live in
 * `publicEnv`.
 *
 * Validation is lazy so that `next build` can prerender pages without a full
 * environment; the schema is only enforced the first time a value is read at
 * runtime.
 */

const serverSchema = z.object({
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid connection string URL" }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  MISTRAL_API_KEY: z.string().min(1).optional(),
})

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL" }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
})

type ServerEnv = z.infer<typeof serverSchema>
type PublicEnv = z.infer<typeof publicSchema>

let cachedServerEnv: ServerEnv | null = null
let cachedPublicEnv: PublicEnv | null = null

function formatIssues(prefix: string, error: z.ZodError): never {
  const details = error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
  throw new Error(`${prefix}\n${details}`)
}

/** Validated server-only environment. Throws if accessed on the client. */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called in the browser")
  }
  if (cachedServerEnv) return cachedServerEnv
  const parsed = serverSchema.safeParse(process.env)
  if (!parsed.success) {
    formatIssues("Invalid server environment variables:", parsed.error)
  }
  cachedServerEnv = parsed.data
  return cachedServerEnv
}

/** Validated public environment, safe to use in the browser. */
export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
  if (!parsed.success) {
    formatIssues("Invalid public environment variables:", parsed.error)
  }
  cachedPublicEnv = parsed.data
  return cachedPublicEnv
}
