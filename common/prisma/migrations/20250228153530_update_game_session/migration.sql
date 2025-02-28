-- CreateTable
CREATE TABLE "game_session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "players" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_session_pkey" PRIMARY KEY ("id")
);
