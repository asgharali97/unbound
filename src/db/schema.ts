import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type JsonObject = Record<string, unknown>;

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    timezone: varchar("timezone", { length: 100 })
      .default("UTC")
      .notNull(),
    ...timestamps,
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_email_unique").on(table.email),
    index("user_deleted_at_idx").on(table.deletedAt),
  ],
);

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("session_token_unique").on(table.token),
    index("session_user_id_idx").on(table.userId),
    index("session_expires_at_idx").on(table.expiresAt),
  ],
);

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
    index("account_user_id_idx").on(table.userId),
  ],
);

export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
    index("verification_expires_at_idx").on(table.expiresAt),
  ],
);

export const corsairIntegrations = pgTable("corsair_integrations", {
  id: text("id").primaryKey(),
  ...timestamps,
  name: text("name").notNull(),
  config: jsonb("config").$type<JsonObject>().default({}).notNull(),
  dek: text("dek"),
});

export const corsairAccounts = pgTable(
  "corsair_accounts",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    tenantId: text("tenant_id").notNull(),
    integrationId: text("integration_id")
      .notNull()
      .references(() => corsairIntegrations.id),
    config: jsonb("config").$type<JsonObject>().default({}).notNull(),
    dek: text("dek"),
  },
  (table) => [
    index("corsair_accounts_tenant_id_idx").on(table.tenantId),
    index("corsair_accounts_integration_id_idx").on(table.integrationId),
  ],
);

export const corsairEntities = pgTable(
  "corsair_entities",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id),
    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull(),
    version: text("version").notNull(),
    data: jsonb("data").$type<JsonObject>().default({}).notNull(),
  },
  (table) => [
    index("corsair_entities_account_type_idx").on(
      table.accountId,
      table.entityType,
    ),
  ],
);

export const corsairEvents = pgTable(
  "corsair_events",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").$type<JsonObject>().default({}).notNull(),
    status: text("status"),
  },
  (table) => [
    index("corsair_events_account_created_at_idx").on(
      table.accountId,
      table.createdAt,
    ),
    index("corsair_events_status_idx").on(table.status),
  ],
);

export const corsairPermissions = pgTable(
  "corsair_permissions",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    token: text("token").notNull(),
    plugin: text("plugin").notNull(),
    endpoint: text("endpoint").notNull(),
    args: text("args").notNull(),
    tenantId: text("tenant_id").default("default").notNull(),
    status: text("status").default("pending").notNull(),
    expiresAt: text("expires_at").notNull(),
    error: text("error"),
  },
  (table) => [
    uniqueIndex("corsair_permissions_token_unique").on(table.token),
    index("corsair_permissions_tenant_status_idx").on(
      table.tenantId,
      table.status,
    ),
    index("corsair_permissions_expires_at_idx").on(table.expiresAt),
  ],
);

export const agentActionTypeEnum = pgEnum("agent_action_type", [
  "email",
  "calendar",
  "workflow",
]);

export const agentActionStatusEnum = pgEnum("agent_action_status", [
  "planned",
  "awaiting_confirmation",
  "executing",
  "completed",
  "partially_completed",
  "failed",
  "cancelled",
]);

export const agentStepTypeEnum = pgEnum("agent_step_type", [
  "create_email_draft",
  "send_email",
  "create_calendar_event",
  "update_calendar_event",
]);

export const agentStepStatusEnum = pgEnum("agent_step_status", [
  "pending",
  "executing",
  "completed",
  "failed",
  "skipped",
  "cancelled",
]);

export const agentActions = pgTable(
  "agent_actions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    command: text("command").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: agentActionTypeEnum("type").notNull(),
    status: agentActionStatusEnum("status").default("planned").notNull(),
    planVersion: integer("plan_version").default(1).notNull(),
    idempotencyKey: uuid("idempotency_key").defaultRandom().notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorCode: varchar("error_code", { length: 100 }),
    errorMessage: text("error_message"),
    ...timestamps,
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("agent_actions_idempotency_key_unique").on(
      table.idempotencyKey,
    ),
    index("agent_actions_user_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
    index("agent_actions_user_status_idx").on(table.userId, table.status),
  ],
);

export const agentActionSteps = pgTable(
  "agent_action_steps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actionId: uuid("action_id")
      .notNull()
      .references(() => agentActions.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    type: agentStepTypeEnum("type").notNull(),
    status: agentStepStatusEnum("status").default("pending").notNull(),
    input: jsonb("input").$type<JsonObject>().notNull(),
    output: jsonb("output").$type<JsonObject>(),
    corsairAccountId: text("corsair_account_id").references(
      () => corsairAccounts.id,
      { onDelete: "set null" },
    ),
    externalEntityId: text("external_entity_id"),
    attemptCount: integer("attempt_count").default(0).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorCode: varchar("error_code", { length: 100 }),
    errorMessage: text("error_message"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("agent_action_steps_action_position_unique").on(
      table.actionId,
      table.position,
    ),
    index("agent_action_steps_status_idx").on(table.status),
    index("agent_action_steps_corsair_account_idx").on(
      table.corsairAccountId,
    ),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  agentActions: many(agentActions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const corsairIntegrationsRelations = relations(
  corsairIntegrations,
  ({ many }) => ({
    accounts: many(corsairAccounts),
  }),
);

export const corsairAccountsRelations = relations(
  corsairAccounts,
  ({ one, many }) => ({
    integration: one(corsairIntegrations, {
      fields: [corsairAccounts.integrationId],
      references: [corsairIntegrations.id],
    }),
    entities: many(corsairEntities),
    events: many(corsairEvents),
    actionSteps: many(agentActionSteps),
  }),
);

export const corsairEntitiesRelations = relations(
  corsairEntities,
  ({ one }) => ({
    account: one(corsairAccounts, {
      fields: [corsairEntities.accountId],
      references: [corsairAccounts.id],
    }),
  }),
);

export const corsairEventsRelations = relations(
  corsairEvents,
  ({ one }) => ({
    account: one(corsairAccounts, {
      fields: [corsairEvents.accountId],
      references: [corsairAccounts.id],
    }),
  }),
);

export const agentActionsRelations = relations(
  agentActions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [agentActions.userId],
      references: [users.id],
    }),
    steps: many(agentActionSteps),
  }),
);

export const agentActionStepsRelations = relations(
  agentActionSteps,
  ({ one }) => ({
    action: one(agentActions, {
      fields: [agentActionSteps.actionId],
      references: [agentActions.id],
    }),
    corsairAccount: one(corsairAccounts, {
      fields: [agentActionSteps.corsairAccountId],
      references: [corsairAccounts.id],
    }),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CorsairIntegration = typeof corsairIntegrations.$inferSelect;
export type CorsairAccount = typeof corsairAccounts.$inferSelect;
export type CorsairEntity = typeof corsairEntities.$inferSelect;
export type CorsairEvent = typeof corsairEvents.$inferSelect;
export type CorsairPermission = typeof corsairPermissions.$inferSelect;
export type AgentAction = typeof agentActions.$inferSelect;
export type NewAgentAction = typeof agentActions.$inferInsert;
export type AgentActionStep = typeof agentActionSteps.$inferSelect;
export type NewAgentActionStep = typeof agentActionSteps.$inferInsert;
