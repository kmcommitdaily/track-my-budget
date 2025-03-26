ALTER TABLE "budget" DROP CONSTRAINT "budget_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "budget" DROP CONSTRAINT "budget_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "income_transactions" DROP CONSTRAINT "income_transactions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "income_transactions" DROP CONSTRAINT "income_transactions_salary_id_salary_id_fk";
--> statement-breakpoint
ALTER TABLE "income_transactions" DROP CONSTRAINT "income_transactions_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_budget_id_budget_id_fk";
--> statement-breakpoint
ALTER TABLE "salary" DROP CONSTRAINT "salary_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "salary" DROP CONSTRAINT "salary_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "remaining_amount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "income_transactions" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "income_transactions" ALTER COLUMN "salary_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "income_transactions" ALTER COLUMN "company_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "budget_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_salary_id_salary_id_fk" FOREIGN KEY ("salary_id") REFERENCES "public"."salary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_budget_id_budget_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budget"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary" ADD CONSTRAINT "salary_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary" ADD CONSTRAINT "salary_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;