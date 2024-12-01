import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1732912825633 implements MigrationInterface {
    name = ' $npmConfigName1732912825633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "postviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "postID" uuid NOT NULL, CONSTRAINT "PK_49f9b3e312420ca023c39c96484" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."posts_prise_enum" AS ENUM('USD', 'EUR', 'UAH')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "image" text NOT NULL, "priseValue" numeric NOT NULL DEFAULT '1', "prise" "public"."posts_prise_enum" NOT NULL DEFAULT 'UAH', "carBrand" text NOT NULL, "town" text NOT NULL, "region" text NOT NULL, "model" text NOT NULL, "year" numeric NOT NULL, "usdPrice" numeric, "eurPrice" numeric, "uahPrice" numeric, "exchangeRateDate" TIMESTAMP NOT NULL, "editAttempts" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT false, "userID" uuid NOT NULL, "countOfViews" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refreshToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "userID" uuid NOT NULL, CONSTRAINT "PK_be91607b0697b092c2bdff83b45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carBrand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "model" text NOT NULL, "userID" uuid NOT NULL, CONSTRAINT "UQ_07bf05464904190733735afba14" UNIQUE ("name"), CONSTRAINT "PK_e7d1f05f169a3ac27b12f5aac9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('seller', 'sellervip', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "age" integer NOT NULL, "position" text, "role" "public"."users_role_enum" NOT NULL DEFAULT 'seller', "image" text, "isVerified" boolean NOT NULL DEFAULT false, "verifyToken" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cardealpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "town" text NOT NULL, CONSTRAINT "PK_ada83955902747e442b5e4b487d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "postviews" ADD CONSTRAINT "FK_f3b288b179855fd857416f44188" FOREIGN KEY ("postID") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_0a8c79bd1ad4e0dff867b2f6b8b" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshToken" ADD CONSTRAINT "FK_5babd42cd12e832d479766193b7" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carBrand" ADD CONSTRAINT "FK_4b52e6671ec10a08f2749a7765e" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carBrand" DROP CONSTRAINT "FK_4b52e6671ec10a08f2749a7765e"`);
        await queryRunner.query(`ALTER TABLE "refreshToken" DROP CONSTRAINT "FK_5babd42cd12e832d479766193b7"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_0a8c79bd1ad4e0dff867b2f6b8b"`);
        await queryRunner.query(`ALTER TABLE "postviews" DROP CONSTRAINT "FK_f3b288b179855fd857416f44188"`);
        await queryRunner.query(`DROP TABLE "cardealpoint"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "carBrand"`);
        await queryRunner.query(`DROP TABLE "refreshToken"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_prise_enum"`);
        await queryRunner.query(`DROP TABLE "postviews"`);
    }

}
