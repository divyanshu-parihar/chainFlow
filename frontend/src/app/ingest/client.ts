import { Inngest } from "inngest";

// Common event names to ensure consistency between frontend and backend
export const Events = {
  HELLO_WORLD: "hello.world"
} as const;

export const inngest = new Inngest({ 
  id: "core",
  isDev: true,
  // Point to your local Inngest server
  baseUrl: "http://localhost:8288",
  // For local development, you might not need an event key
  // But if your local setup requires one, uncomment and set it here
  eventKey: "abcd"
});