import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { sendContactEmails } from "./mailer.js";
import { insertMessageSchema } from "../shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {

    try {
      // Honeypot: bots fill the hidden field; pretend success and drop it.
      if (req.body?.honey) {
        return res.status(200).json({ success: true, message: "Message received successfully" });
      }

      const messageData = insertMessageSchema.parse(req.body);

      await storage.createMessage(messageData);

      // The message is already persisted, so an email failure must not fail the request.
      try {
        await sendContactEmails(messageData);
      } catch (mailError) {
        console.error("Contact email error:", mailError);
      }

      res.status(200).json({
        success: true,
        message: "Message received successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "An error occurred while processing your message" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
