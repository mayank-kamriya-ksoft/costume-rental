import {
  users,
  costumes,
  accessories,
  categories,
  bookings,
  bookingItems,
  type User,
  type InsertUser,
  type Costume,
  type InsertCostume,
  type Accessory,
  type InsertAccessory,
  type Category,
  type InsertCategory,
  type Booking,
  type InsertBooking,
  type BookingItem,
  type InsertBookingItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  
  // Authentication
  authenticateUser(email: string, password: string): Promise<User | null>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Costume operations
  getCostumes(filters?: {
    category?: string;
    theme?: string;
    size?: string;
    search?: string;
    status?: string;
  }): Promise<Costume[]>;
  getCostume(id: string): Promise<Costume | undefined>;
  createCostume(costume: InsertCostume): Promise<Costume>;
  updateCostume(id: string, costume: Partial<InsertCostume>): Promise<Costume>;
  deleteCostume(id: string): Promise<void>;

  // Accessory operations
  getAccessories(filters?: {
    category?: string;
    size?: string;
    search?: string;
    status?: string;
  }): Promise<Accessory[]>;
  getAccessory(id: string): Promise<Accessory | undefined>;
  createAccessory(accessory: InsertAccessory): Promise<Accessory>;
  updateAccessory(id: string, accessory: Partial<InsertAccessory>): Promise<Accessory>;
  deleteAccessory(id: string): Promise<void>;

  // Booking operations
  getBookings(status?: string): Promise<(Booking & { items: BookingItem[] })[]>;
  getUserBookings(userId: string, status?: string): Promise<(Booking & { items: BookingItem[] })[]>;
  getBooking(id: string): Promise<(Booking & { items: BookingItem[] }) | undefined>;
  createBooking(booking: InsertBooking, items: InsertBookingItem[]): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<void>;

  // Availability checking
  checkAvailability(itemId: string, itemType: 'costume' | 'accessory', startDate: Date, endDate: Date): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalRevenue: number;
    activeRentals: number;
    availableItems: number;
    overdueReturns: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }
    
    // Use bcrypt for password comparison
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    
    return null;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  // Costume operations
  async getCostumes(filters?: {
    category?: string;
    theme?: string;
    size?: string;
    search?: string;
    status?: string;
  }): Promise<Costume[]> {
    let query = db.select().from(costumes);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(costumes.categoryId, filters.category));
    }
    if (filters?.status) {
      conditions.push(eq(costumes.status, filters.status));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(costumes.name, `%${filters.search}%`),
          ilike(costumes.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(costumes.createdAt));
  }

  async getCostume(id: string): Promise<Costume | undefined> {
    const [costume] = await db.select().from(costumes).where(eq(costumes.id, id));
    return costume;
  }

  async createCostume(costumeData: InsertCostume): Promise<Costume> {
    const [costume] = await db.insert(costumes).values(costumeData).returning();
    return costume;
  }

  async updateCostume(id: string, costumeData: Partial<InsertCostume>): Promise<Costume> {
    const [costume] = await db
      .update(costumes)
      .set({ ...costumeData, updatedAt: new Date() })
      .where(eq(costumes.id, id))
      .returning();
    return costume;
  }

  async deleteCostume(id: string): Promise<void> {
    await db.delete(costumes).where(eq(costumes.id, id));
  }

  // Accessory operations
  async getAccessories(filters?: {
    category?: string;
    size?: string;
    search?: string;
    status?: string;
  }): Promise<Accessory[]> {
    let query = db.select().from(accessories);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(accessories.categoryId, filters.category));
    }
    if (filters?.status) {
      conditions.push(eq(accessories.status, filters.status));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(accessories.name, `%${filters.search}%`),
          ilike(accessories.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(accessories.createdAt));
  }

  async getAccessory(id: string): Promise<Accessory | undefined> {
    const [accessory] = await db.select().from(accessories).where(eq(accessories.id, id));
    return accessory;
  }

  async createAccessory(accessoryData: InsertAccessory): Promise<Accessory> {
    const [accessory] = await db.insert(accessories).values(accessoryData).returning();
    return accessory;
  }

  async updateAccessory(id: string, accessoryData: Partial<InsertAccessory>): Promise<Accessory> {
    const [accessory] = await db
      .update(accessories)
      .set({ ...accessoryData, updatedAt: new Date() })
      .where(eq(accessories.id, id))
      .returning();
    return accessory;
  }

  async deleteAccessory(id: string): Promise<void> {
    await db.delete(accessories).where(eq(accessories.id, id));
  }

  // Booking operations
  async getBookings(status?: string): Promise<(Booking & { items: BookingItem[] })[]> {
    let bookingsQuery = db.select().from(bookings);
    
    if (status) {
      bookingsQuery = bookingsQuery.where(eq(bookings.status, status));
    }
    
    const allBookings = await bookingsQuery.orderBy(desc(bookings.createdAt));
    
    // Get items for each booking
    const bookingsWithItems = await Promise.all(
      allBookings.map(async (booking) => {
        const items = await db
          .select()
          .from(bookingItems)
          .where(eq(bookingItems.bookingId, booking.id));
        return { ...booking, items };
      })
    );

    return bookingsWithItems;
  }

  async getUserBookings(userId: string, status?: string): Promise<(Booking & { items: BookingItem[] })[]> {
    let bookingsQuery = db.select().from(bookings).where(eq(bookings.userId, userId));
    
    if (status) {
      bookingsQuery = bookingsQuery.where(and(eq(bookings.userId, userId), eq(bookings.status, status)));
    }
    
    const userBookings = await bookingsQuery.orderBy(desc(bookings.createdAt));
    
    // Get items for each booking
    const bookingsWithItems = await Promise.all(
      userBookings.map(async (booking) => {
        const items = await db
          .select()
          .from(bookingItems)
          .where(eq(bookingItems.bookingId, booking.id));
        return { ...booking, items };
      })
    );

    return bookingsWithItems;
  }

  async getBooking(id: string): Promise<(Booking & { items: BookingItem[] }) | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    if (!booking) return undefined;

    const items = await db
      .select()
      .from(bookingItems)
      .where(eq(bookingItems.bookingId, booking.id));

    return { ...booking, items };
  }

  async createBooking(bookingData: InsertBooking, items: InsertBookingItem[]): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    
    // Insert booking items
    const itemsWithBookingId = items.map(item => ({
      ...item,
      bookingId: booking.id,
    }));
    
    await db.insert(bookingItems).values(itemsWithBookingId);

    // Update item statuses to rented
    for (const item of items) {
      if (item.itemType === 'costume') {
        await db
          .update(costumes)
          .set({ status: 'rented' })
          .where(eq(costumes.id, item.itemId));
      } else if (item.itemType === 'accessory') {
        await db
          .update(accessories)
          .set({ status: 'rented' })
          .where(eq(accessories.id, item.itemId));
      }
    }

    return booking;
  }

  async updateBooking(id: string, bookingData: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...bookingData, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id));

    // If completing booking, update item statuses back to available
    if (status === 'completed') {
      const items = await db
        .select()
        .from(bookingItems)
        .where(eq(bookingItems.bookingId, id));

      for (const item of items) {
        if (item.itemType === 'costume') {
          await db
            .update(costumes)
            .set({ status: 'available' })
            .where(eq(costumes.id, item.itemId));
        } else if (item.itemType === 'accessory') {
          await db
            .update(accessories)
            .set({ status: 'available' })
            .where(eq(accessories.id, item.itemId));
        }
      }
    }
  }

  async checkAvailability(
    itemId: string, 
    itemType: 'costume' | 'accessory', 
    startDate: Date, 
    endDate: Date
  ): Promise<boolean> {
    // Check if item exists and is available
    let item;
    if (itemType === 'costume') {
      [item] = await db.select().from(costumes).where(eq(costumes.id, itemId));
    } else {
      [item] = await db.select().from(accessories).where(eq(accessories.id, itemId));
    }

    if (!item || item.status !== 'available') {
      return false;
    }

    // Check for overlapping bookings
    const overlappingBookings = await db
      .select({ id: bookings.id })
      .from(bookings)
      .innerJoin(bookingItems, eq(bookingItems.bookingId, bookings.id))
      .where(
        and(
          eq(bookingItems.itemId, itemId),
          eq(bookingItems.itemType, itemType),
          eq(bookings.status, 'active'),
          or(
            and(gte(bookings.startDate, startDate), lte(bookings.startDate, endDate)),
            and(gte(bookings.endDate, startDate), lte(bookings.endDate, endDate)),
            and(lte(bookings.startDate, startDate), gte(bookings.endDate, endDate))
          )
        )
      );

    return overlappingBookings.length === 0;
  }

  async getDashboardStats(): Promise<{
    totalRevenue: number;
    activeRentals: number;
    availableItems: number;
    overdueReturns: number;
  }> {
    // Calculate total revenue (sum of all paid bookings)
    const revenueResult = await db
      .select({ 
        totalRevenue: sql<number>`COALESCE(sum(${bookings.totalAmount}::numeric), 0)`
      })
      .from(bookings)
      .where(eq(bookings.paymentStatus, 'paid'));

    // Count active rentals
    const activeRentalsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, 'active'));

    // Count available items (costumes + accessories)
    const availableCostumesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(costumes)
      .where(eq(costumes.status, 'available'));

    const availableAccessoriesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(accessories)
      .where(eq(accessories.status, 'available'));

    // Count overdue returns
    const now = new Date();
    const overdueReturnsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, 'active'),
          lte(bookings.endDate, now)
        )
      );

    return {
      totalRevenue: Number(revenueResult[0]?.totalRevenue) || 0,
      activeRentals: Number(activeRentalsResult[0]?.count) || 0,
      availableItems: (Number(availableCostumesResult[0]?.count) || 0) + (Number(availableAccessoriesResult[0]?.count) || 0),
      overdueReturns: Number(overdueReturnsResult[0]?.count) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
