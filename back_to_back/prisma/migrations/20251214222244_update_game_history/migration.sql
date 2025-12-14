/*
  Warnings:

  - You are about to drop the column `opponentId` on the `GameHistory` table. All the data in the column will be lost.
  - Added the required column `mode` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "durationMs" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "score" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "mode" TEXT NOT NULL,
    "tournamentRound" INTEGER,
    "tournamentPlayersCount" INTEGER,
    "playerPosition" INTEGER,
    CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GameHistory" ("date", "durationMs", "id", "playerId", "score", "userId") SELECT "date", "durationMs", "id", "playerId", "score", "userId" FROM "GameHistory";
DROP TABLE "GameHistory";
ALTER TABLE "new_GameHistory" RENAME TO "GameHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
