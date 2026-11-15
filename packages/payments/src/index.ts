export type GatewayType = 'GCASH' | 'PAYPAL';

export interface CreatePaymentParams {
  orderId: string;
  orderNumber: number;
  amountUSD: number; // minor units (cents: $145.00 -> 14500)
  amountPHP: number; // minor units (centavos: ₱8,410.00 -> 841000)
  chargedCurrency: 'USD' | 'PHP';
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  gateway: GatewayType;
  checkoutUrl: string;
  sessionId: string;
  referenceId?: string;
}

export interface CapturePaymentResult {
  success: boolean;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  rawPayload?: Record<string, unknown>;
  error?: string;
}

export interface RefundPaymentParams {
  orderId: string;
  transactionId: string;
  amount: number;
  currency: 'USD' | 'PHP';
  reason?: string;
}

export interface RefundPaymentResult {
  success: boolean;
  refundId: string;
  status: 'REFUNDED' | 'FAILED';
  error?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventId?: string;
  eventType?: string;
  orderNumber?: number;
  transactionId?: string;
  amount?: number;
  currency?: string;
  rawPayload?: unknown;
  error?: string;
}

export interface PaymentProvider {
  createSession(params: CreatePaymentParams): Promise<PaymentSessionResult>;
  capturePayment(transactionId: string): Promise<CapturePaymentResult>;
  refundPayment(params: RefundPaymentParams): Promise<RefundPaymentResult>;
  verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<WebhookVerificationResult>;
}

// -----------------------------------------------------------------------------
// Mock Payment Provider (Local Development & Testing)
// -----------------------------------------------------------------------------
export class MockPaymentProvider implements PaymentProvider {
  private gateway: GatewayType;

  constructor(gateway: GatewayType) {
    this.gateway = gateway;
  }

  async createSession(params: CreatePaymentParams): Promise<PaymentSessionResult> {
    const sessionId = `mock_${this.gateway.toLowerCase()}_${Date.now()}_${params.orderNumber}`;
    const checkoutUrl = `${params.returnUrl}${params.returnUrl.includes('?') ? '&' : '?'}mock_payment=success&session_id=${sessionId}&order_number=${params.orderNumber}&gateway=${this.gateway}`;

    return {
      gateway: this.gateway,
      checkoutUrl,
      sessionId,
      referenceId: `REF-${params.orderNumber}`,
    };
  }

  async capturePayment(transactionId: string): Promise<CapturePaymentResult> {
    return {
      success: true,
      transactionId: transactionId || `txn_mock_${Date.now()}`,
      status: 'SUCCESS',
      rawPayload: { mock: true, timestamp: new Date().toISOString() },
    };
  }

  async refundPayment(params: RefundPaymentParams): Promise<RefundPaymentResult> {
    return {
      success: true,
      refundId: `ref_mock_${Date.now()}`,
      status: 'REFUNDED',
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<WebhookVerificationResult> {
    try {
      const data = JSON.parse(rawBody);
      return {
        isValid: true,
        eventId: data.id || `evt_mock_${Date.now()}`,
        eventType: data.type || 'payment.paid',
        orderNumber: data.orderNumber || 1042,
        transactionId: data.transactionId || `txn_mock_${Date.now()}`,
        rawPayload: data,
      };
    } catch {
      return { isValid: false, error: 'Invalid JSON payload' };
    }
  }
}

// -----------------------------------------------------------------------------
// PayPal Provider (Orders API v2)
// -----------------------------------------------------------------------------
export class PayPalPaymentProvider implements PaymentProvider {
  private clientId: string;
  private clientSecret: string;
  private isSandbox: boolean;

  constructor(clientId: string, clientSecret: string, isSandbox = true) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.isSandbox = isSandbox;
  }

  private get baseUrl(): string {
    return this.isSandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      throw new Error(`PayPal auth failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.access_token;
  }

  async createSession(params: CreatePaymentParams): Promise<PaymentSessionResult> {
    const token = await this.getAccessToken();
    const amountVal = (params.amountUSD / 100).toFixed(2);

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `JB06-ORD-${params.orderNumber}`,
            amount: {
              currency_code: 'USD',
              value: amountVal,
            },
            description: `JBØ6 Atelier Order #${params.orderNumber}`,
          },
        ],
        application_context: {
          brand_name: 'JBØ6 Atelier Kyoto & Milan',
          return_url: params.returnUrl,
          cancel_url: params.cancelUrl,
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal create order failed: ${err}`);
    }

    const data = await res.json();
    const approveLink = data.links?.find((l: any) => l.rel === 'approve')?.href;

    return {
      gateway: 'PAYPAL',
      checkoutUrl: approveLink || '',
      sessionId: data.id,
      referenceId: data.id,
    };
  }

  async capturePayment(orderId: string): Promise<CapturePaymentResult> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, transactionId: orderId, status: 'FAILED', error: err };
    }

    const data = await res.json();
    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

    return {
      success: data.status === 'COMPLETED',
      transactionId: capture?.id || data.id,
      status: data.status === 'COMPLETED' ? 'SUCCESS' : 'PENDING',
      rawPayload: data,
    };
  }

  async refundPayment(params: RefundPaymentParams): Promise<RefundPaymentResult> {
    const token = await this.getAccessToken();
    const amountVal = (params.amount / 100).toFixed(2);

    const res = await fetch(`${this.baseUrl}/v2/payments/captures/${params.transactionId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: {
          value: amountVal,
          currency_code: params.currency,
        },
        note_to_payer: params.reason || 'Atelier return authorized',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, refundId: '', status: 'FAILED', error: err };
    }

    const data = await res.json();
    return {
      success: data.status === 'COMPLETED',
      refundId: data.id,
      status: 'REFUNDED',
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<WebhookVerificationResult> {
    try {
      const data = JSON.parse(rawBody);
      return {
        isValid: true,
        eventId: data.id,
        eventType: data.event_type,
        transactionId: data.resource?.id,
        rawPayload: data,
      };
    } catch {
      return { isValid: false, error: 'Malformed webhook body' };
    }
  }
}

// -----------------------------------------------------------------------------
// PayMongo Provider (GCash Redirect Flow)
// -----------------------------------------------------------------------------
export class PayMongoPaymentProvider implements PaymentProvider {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`;
  }

  async createSession(params: CreatePaymentParams): Promise<PaymentSessionResult> {
    const res = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            payment_method_types: ['gcash'],
            line_items: [
              {
                currency: 'PHP',
                amount: params.amountPHP, // centavos
                name: `JBØ6 Atelier Order #${params.orderNumber}`,
                quantity: 1,
              },
            ],
            reference_number: `JB06-${params.orderNumber}`,
            success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: params.cancelUrl,
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayMongo checkout session failed: ${err}`);
    }

    const json = await res.json();
    const session = json.data;

    return {
      gateway: 'GCASH',
      checkoutUrl: session.attributes.checkout_url,
      sessionId: session.id,
      referenceId: session.attributes.reference_number,
    };
  }

  async capturePayment(sessionId: string): Promise<CapturePaymentResult> {
    const res = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        Authorization: this.authHeader,
      },
    });

    if (!res.ok) {
      return { success: false, transactionId: sessionId, status: 'FAILED' };
    }

    const json = await res.json();
    const payments = json.data.attributes.payments || [];
    const latestPayment = payments[0];
    const isPaid = latestPayment?.attributes?.status === 'paid';

    return {
      success: isPaid,
      transactionId: latestPayment?.id || sessionId,
      status: isPaid ? 'SUCCESS' : 'PENDING',
      rawPayload: json.data,
    };
  }

  async refundPayment(params: RefundPaymentParams): Promise<RefundPaymentResult> {
    const res = await fetch('https://api.paymongo.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: params.amount,
            payment_id: params.transactionId,
            reason: 'requested_by_customer',
            notes: params.reason || 'Atelier return approved',
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, refundId: '', status: 'FAILED', error: err };
    }

    const json = await res.json();
    return {
      success: true,
      refundId: json.data.id,
      status: 'REFUNDED',
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<WebhookVerificationResult> {
    try {
      const json = JSON.parse(rawBody);
      const eventData = json.data;
      const refNumber = eventData.attributes.data.attributes.reference_number;
      const orderNum = refNumber ? parseInt(refNumber.replace('JB06-', ''), 10) : undefined;

      return {
        isValid: true,
        eventId: eventData.id,
        eventType: eventData.attributes.type,
        orderNumber: orderNum,
        transactionId: eventData.attributes.data.id,
        rawPayload: json,
      };
    } catch {
      return { isValid: false, error: 'Malformed PayMongo webhook' };
    }
  }
}

// -----------------------------------------------------------------------------
// Factory Function
// -----------------------------------------------------------------------------
export function createPaymentProvider(gateway: GatewayType): PaymentProvider {
  if (gateway === 'PAYPAL') {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;
    if (clientId && clientSecret && clientId.trim() !== '') {
      return new PayPalPaymentProvider(clientId, clientSecret, true);
    }
    return new MockPaymentProvider('PAYPAL');
  }

  if (gateway === 'GCASH') {
    const paymongoKey = process.env.PAYMONGO_SECRET_KEY;
    if (paymongoKey && paymongoKey.trim() !== '') {
      return new PayMongoPaymentProvider(paymongoKey);
    }
    return new MockPaymentProvider('GCASH');
  }

  return new MockPaymentProvider(gateway);
}

