import { users, messages, type User, type InsertUser, type Message, type InsertMessage } from "../shared/schema.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn("⚠️ SUPABASE_URL or SUPABASE_ANON_KEY missing. Backend will not persist data correctly.");
    }

    this.supabase = createClient(url || "", key || "");
  }

  async getUser(_id: number): Promise<User | undefined> {
    // Implement standard user auth if needed, for portfolio we focus on messages
    throw new Error("Standard users not yet implemented in SupabaseStorage");
  }

  async getUserByUsername(_username: string): Promise<User | undefined> {
    throw new Error("Standard users not yet implemented in SupabaseStorage");
  }

  async createUser(_insertUser: InsertUser): Promise<User> {
    throw new Error("Standard users not yet implemented in SupabaseStorage");
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const { data, error } = await this.supabase
      .from("messages")
      .insert([insertMessage])
      .select()
      .single();

    if (error) {
      console.error("Error inserting message into Supabase:", error);
      throw new Error(`Failed to save message: ${error.message}`);
    }

    return data as Message;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  currentId: number;
  messageId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.currentId = 1;
    this.messageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.messages.set(id, message);
    return message;
  }
}

// Export SupabaseStorage if credentials exist, else fallback to MemStorage
export const storage = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? new SupabaseStorage()
  : new MemStorage();

