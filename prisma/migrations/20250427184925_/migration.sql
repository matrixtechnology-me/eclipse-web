/*
  Warnings:

  - A unique constraint covering the columns `[pos_id]` on the table `pos_events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pos_events_pos_id_key" ON "pos_events"("pos_id");
