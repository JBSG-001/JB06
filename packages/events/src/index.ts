import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type TelemetryEventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_started'
  | 'payment_pending'
  | 'order_paid';

export interface TelemetryPayload {
  sessionId: string; // Anonymous session ID (e.g. "visitor_8841")
  eventType: TelemetryEventType;
  path: string;
  timestamp: string;
  country?: string;
  metadata?: Record<string, unknown>;
}

export interface RealtimeProvider {
  publish(event: TelemetryPayload): Promise<{ success: boolean; error?: string }>;
  subscribe(callback: (event: TelemetryPayload) => void): () => void;
}

// -----------------------------------------------------------------------------
// In-Memory Mock Provider (for local development, offline, and tests)
// -----------------------------------------------------------------------------
export class MockRealtimeProvider implements RealtimeProvider {
  private listeners: ((event: TelemetryPayload) => void)[] = [];

  async publish(event: TelemetryPayload): Promise<{ success: boolean }> {
    for (const listener of this.listeners) {
      listener(event);
    }
    return { success: true };
  }

  subscribe(callback: (event: TelemetryPayload) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

// -----------------------------------------------------------------------------
// Supabase Realtime Broadcast Provider
// -----------------------------------------------------------------------------
export class SupabaseRealtimeProvider implements RealtimeProvider {
  private client: SupabaseClient;
  private channelName: string;

  constructor(supabaseUrl: string, secretOrAnonKey: string, channelName = 'live-monitor') {
    this.client = createClient(supabaseUrl, secretOrAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    this.channelName = channelName;
  }

  async publish(event: TelemetryPayload): Promise<{ success: boolean; error?: string }> {
    try {
      const channel = this.client.channel(this.channelName);
      const res = await channel.send({
        type: 'broadcast',
        event: 'telemetry_event',
        payload: event,
      });

      if (res !== 'ok') {
        return { success: false, error: `Broadcast returned: ${res}` };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Broadcast error' };
    }
  }

  subscribe(callback: (event: TelemetryPayload) => void): () => void {
    const channel = this.client
      .channel(this.channelName)
      .on('broadcast', { event: 'telemetry_event' }, (payload) => {
        callback(payload.payload as TelemetryPayload);
      })
      .subscribe();

    return () => {
      this.client.removeChannel(channel);
    };
  }
}

export function createRealtimeProvider(): RealtimeProvider {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key && !url.includes('placeholder')) {
    return new SupabaseRealtimeProvider(url, key);
  }

  return new MockRealtimeProvider();
}

