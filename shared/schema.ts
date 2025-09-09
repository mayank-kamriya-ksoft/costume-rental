import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // Hashed password
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  dateOfBirth: timestamp("date_of_birth"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // Hashed password
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  role: varchar("role").notNull().default("admin"), // admin, superadmin
  permissions: jsonb("permissions").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'costume' or 'accessory'
});

export const costumes = pgTable("costumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  themes: jsonb("themes").$type<string[]>().default([]),
  imageUrl: varchar("image_url"),
  status: varchar("status").notNull().default('available'), // available, rented, cleaning, damaged
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accessories = pgTable("accessories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  linkedCharacters: jsonb("linked_characters").$type<string[]>().default([]),
  imageUrl: varchar("image_url"),
  status: varchar("status").notNull().default('available'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default('active'), // active, completed, overdue, cancelled
  paymentStatus: varchar("payment_status").notNull().default('pending'), // pending, paid, refunded
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookingItems = pgTable("booking_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id),
  itemType: varchar("item_type").notNull(), // 'costume' or 'accessory'
  itemId: varchar("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  size: varchar("size"),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  costumes: many(costumes),
  accessories: many(accessories),
}));

export const costumesRelations = relations(costumes, ({ one }) => ({
  category: one(categories, {
    fields: [costumes.categoryId],
    references: [categories.id],
  }),
}));

export const accessoriesRelations = relations(accessories, ({ one }) => ({
  category: one(categories, {
    fields: [accessories.categoryId],
    references: [categories.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  items: many(bookingItems),
}));

export const bookingItemsRelations = relations(bookingItems, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingItems.bookingId],
    references: [bookings.id],
  }),
}));

// Insert Schemas
// User registration schema (excludes password confirmation)
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
  emailVerified: true,
});

// Registration form schema with password confirmation
export const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertCostumeSchema = createInsertSchema(costumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccessorySchema = createInsertSchema(accessories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingItemSchema = createInsertSchema(bookingItems).omit({
  id: true,
});

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid admin email address'),
  password: z.string().min(1, 'Password is required'),
});

// Admin schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Costume = typeof costumes.$inferSelect;
export type InsertCostume = z.infer<typeof insertCostumeSchema>;

export type Accessory = typeof accessories.$inferSelect;
export type InsertAccessory = z.infer<typeof insertAccessorySchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type BookingItem = typeof bookingItems.$inferSelect;
export type InsertBookingItem = z.infer<typeof insertBookingItemSchema>;
