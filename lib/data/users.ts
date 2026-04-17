import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  mapIUserCreateToUserInsert,
  mapUserRecordToIUser,
} from "@/lib/data/mappers";
import type { IUser } from "@/lib/domain/types";
import type { UserRecord, UserRole, AuthProvider } from "@/lib/data/types";
import { SupabaseConfigError } from "@/lib/supabase/server";

const USERS_TABLE = "users";

export async function findUserById(id: string): Promise<IUser | null> {
  if (!process.env.SUPABASE_URL) {
    throw new SupabaseConfigError();
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle<UserRecord>();

  if (error) {
    throw error;
  }

  return data ? mapUserRecordToIUser(data) : null;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  if (!process.env.SUPABASE_URL) {
    throw new SupabaseConfigError();
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle<UserRecord>();

  if (error) {
    throw error;
  }

  return data ? mapUserRecordToIUser(data) : null;
}

export async function createUserRecord(input: {
  email: string;
  name: string;
  password?: string;
  picture?: string;
  role?: UserRole;
  provider: AuthProvider;
  googleId?: string;
  isEmailVerified?: boolean;
}): Promise<IUser> {
  if (!process.env.SUPABASE_URL) {
    throw new SupabaseConfigError();
  }

  const supabase = getSupabaseAdminClient();
  const payload = mapIUserCreateToUserInsert(input);

  const { data, error } = await supabase
    .from(USERS_TABLE)
    .insert(payload)
    .select("*")
    .single<UserRecord>();

  if (error) {
    throw error;
  }

  return mapUserRecordToIUser(data);
}

export async function updateUserLastLoginAt(userId: string): Promise<void> {
  if (!process.env.SUPABASE_URL) {
    throw new SupabaseConfigError();
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from(USERS_TABLE)
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function ensureDefaultAdminUser(input: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<void> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return;
  }

  await createUserRecord({
    email: input.email,
    name: input.name,
    password: input.passwordHash,
    role: "admin",
    provider: "email",
    isEmailVerified: true,
  });
}
