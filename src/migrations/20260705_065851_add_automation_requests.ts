import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_automation_requests_tool" AS ENUM('workflow-automation', 'ai-chatbots', 'crm-automation', 'custom-ai-agents', 'rpa', 'email-marketing-automation');
  CREATE TYPE "public"."enum_automation_requests_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TABLE "automation_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"prompt" varchar NOT NULL,
  	"tool" "enum_automation_requests_tool" NOT NULL,
  	"status" "enum_automation_requests_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "automation_requests_id" integer;
  CREATE INDEX "automation_requests_updated_at_idx" ON "automation_requests" USING btree ("updated_at");
  CREATE INDEX "automation_requests_created_at_idx" ON "automation_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_automation_requests_fk" FOREIGN KEY ("automation_requests_id") REFERENCES "public"."automation_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_automation_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("automation_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "automation_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "automation_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_automation_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_automation_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "automation_requests_id";
  DROP TYPE "public"."enum_automation_requests_tool";
  DROP TYPE "public"."enum_automation_requests_status";`)
}
