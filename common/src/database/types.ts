/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface _PrismaMigrations {
  applied_steps_count: Generated<number>;
  checksum: string;
  finished_at: Timestamp | null;
  id: string;
  logs: string | null;
  migration_name: string;
  rolled_back_at: Timestamp | null;
  started_at: Generated<Timestamp>;
}

export interface GameSession {
  createdAt: Generated<Timestamp>;
  id: string;
  players: Json;
  status: string;
}

export interface Player {
  id: string;
  playerId: string;
  skill: number;
  timestamp: Generated<Timestamp>;
}

export interface User {
  createdAt: Generated<Timestamp>;
  email: string | null;
  id: string;
  password: string;
  username: string;
}

export interface DB {
  _prisma_migrations: _PrismaMigrations;
  GameSession: GameSession;
  Player: Player;
  User: User;
}
