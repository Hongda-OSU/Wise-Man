import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

import * as schema from "@/db/schema";

export const DATABASE_NAME = "wise-man.db";

// Opened once at module scope: expo-sqlite hands back the same connection for a
// given name, and every caller wants the same one.
const sqlite = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

export const db = drizzle(sqlite, { schema });
