import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "automation_requests" ADD COLUMN "wants_plan" boolean DEFAULT false;
  ALTER TABLE "automation_requests" ADD COLUMN "attachments" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "automation_requests" DROP COLUMN "wants_plan";
  ALTER TABLE "automation_requests" DROP COLUMN "attachments";`)
}
