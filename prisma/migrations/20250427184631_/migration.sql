-- CreateTable
CREATE TABLE "pos_event_entries" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pos_event_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_outputs" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pos_event_outputs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pos_event_entries" ADD CONSTRAINT "pos_event_entries_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_outputs" ADD CONSTRAINT "pos_event_outputs_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
