export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkflowStatus = "draft" | "active" | "archived";

export type Database = {
  public: {
    Tables: {
      workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          graph: Json;
          status: WorkflowStatus;
          inngest_trigger: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          graph?: Json;
          status?: WorkflowStatus;
          inngest_trigger?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          graph?: Json;
          status?: WorkflowStatus;
          inngest_trigger?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      workflow_status: WorkflowStatus;
    };
  };
};

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"];
