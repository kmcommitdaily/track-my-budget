ALTER TABLE "users" RENAME TO "appUsersTable";--> statement-breakpoint
ALTER TABLE "appUsersTable" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "budget" DROP CONSTRAINT "budget_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "income_transactions" DROP CONSTRAINT "income_transactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "salary" DROP CONSTRAINT "salary_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_user_id_appUsersTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."appUsersTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_user_id_appUsersTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."appUsersTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_appUsersTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."appUsersTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary" ADD CONSTRAINT "salary_user_id_appUsersTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."appUsersTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appUsersTable" ADD CONSTRAINT "appUsersTable_email_unique" UNIQUE("email");