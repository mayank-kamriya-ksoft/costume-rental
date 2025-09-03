import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCostumeSchema, insertAccessorySchema, insertBookingSchema, insertBookingItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Costume routes
  app.get("/api/costumes", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        theme: req.query.theme as string,
        size: req.query.size as string,
        search: req.query.search as string,
        status: req.query.status as string,
      };
      const costumes = await storage.getCostumes(filters);
      res.json(costumes);
    } catch (error) {
      console.error("Error fetching costumes:", error);
      res.status(500).json({ message: "Failed to fetch costumes" });
    }
  });

  app.get("/api/costumes/:id", async (req, res) => {
    try {
      const costume = await storage.getCostume(req.params.id);
      if (!costume) {
        return res.status(404).json({ message: "Costume not found" });
      }
      res.json(costume);
    } catch (error) {
      console.error("Error fetching costume:", error);
      res.status(500).json({ message: "Failed to fetch costume" });
    }
  });

  app.post("/api/costumes", async (req, res) => {
    try {
      const validatedData = insertCostumeSchema.parse(req.body);
      const costume = await storage.createCostume(validatedData);
      res.status(201).json(costume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating costume:", error);
      res.status(500).json({ message: "Failed to create costume" });
    }
  });

  app.put("/api/costumes/:id", async (req, res) => {
    try {
      const validatedData = insertCostumeSchema.partial().parse(req.body);
      const costume = await storage.updateCostume(req.params.id, validatedData);
      res.json(costume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating costume:", error);
      res.status(500).json({ message: "Failed to update costume" });
    }
  });

  app.delete("/api/costumes/:id", async (req, res) => {
    try {
      await storage.deleteCostume(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting costume:", error);
      res.status(500).json({ message: "Failed to delete costume" });
    }
  });

  // Accessory routes
  app.get("/api/accessories", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        size: req.query.size as string,
        search: req.query.search as string,
        status: req.query.status as string,
      };
      const accessories = await storage.getAccessories(filters);
      res.json(accessories);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      res.status(500).json({ message: "Failed to fetch accessories" });
    }
  });

  app.get("/api/accessories/:id", async (req, res) => {
    try {
      const accessory = await storage.getAccessory(req.params.id);
      if (!accessory) {
        return res.status(404).json({ message: "Accessory not found" });
      }
      res.json(accessory);
    } catch (error) {
      console.error("Error fetching accessory:", error);
      res.status(500).json({ message: "Failed to fetch accessory" });
    }
  });

  app.post("/api/accessories", async (req, res) => {
    try {
      const validatedData = insertAccessorySchema.parse(req.body);
      const accessory = await storage.createAccessory(validatedData);
      res.status(201).json(accessory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating accessory:", error);
      res.status(500).json({ message: "Failed to create accessory" });
    }
  });

  app.put("/api/accessories/:id", async (req, res) => {
    try {
      const validatedData = insertAccessorySchema.partial().parse(req.body);
      const accessory = await storage.updateAccessory(req.params.id, validatedData);
      res.json(accessory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating accessory:", error);
      res.status(500).json({ message: "Failed to update accessory" });
    }
  });

  app.delete("/api/accessories/:id", async (req, res) => {
    try {
      await storage.deleteAccessory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting accessory:", error);
      res.status(500).json({ message: "Failed to delete accessory" });
    }
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const status = req.query.status as string;
      const bookings = await storage.getBookings(status);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  const createBookingSchema = z.object({
    booking: insertBookingSchema,
    items: z.array(insertBookingItemSchema),
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { booking, items } = createBookingSchema.parse(req.body);
      
      // Check availability for all items
      for (const item of items) {
        const isAvailable = await storage.checkAvailability(
          item.itemId,
          item.itemType as 'costume' | 'accessory',
          new Date(booking.startDate),
          new Date(booking.endDate)
        );
        
        if (!isAvailable) {
          return res.status(400).json({ 
            message: `Item "${item.itemName}" is not available for the selected dates` 
          });
        }
      }

      const newBooking = await storage.createBooking(booking, items);
      res.status(201).json(newBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(req.params.id, validatedData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      await storage.updateBookingStatus(req.params.id, status);
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status" });
      }
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Availability check
  app.post("/api/availability", async (req, res) => {
    try {
      const { itemId, itemType, startDate, endDate } = z.object({
        itemId: z.string(),
        itemType: z.enum(['costume', 'accessory']),
        startDate: z.string(),
        endDate: z.string(),
      }).parse(req.body);

      const isAvailable = await storage.checkAvailability(
        itemId,
        itemType,
        new Date(startDate),
        new Date(endDate)
      );

      res.json({ available: isAvailable });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
