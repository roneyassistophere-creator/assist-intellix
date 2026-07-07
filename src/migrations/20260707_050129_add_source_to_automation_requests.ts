import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Guarded: local dev databases created via Payload's push mode already have
  // the enum type and column without this migration being recorded as run.
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_automation_requests_source" AS ENUM('composer', 'audit-form');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  ALTER TABLE "automation_requests" ADD COLUMN IF NOT EXISTS "source" "enum_automation_requests_source" DEFAULT 'composer';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "automation_requests" DROP COLUMN "source";
  DROP TYPE "public"."enum_automation_requests_source";`)
}
