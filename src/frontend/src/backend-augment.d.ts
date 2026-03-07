// Augment backendInterface and Backend class to include authorization and stripe
// methods injected by Caffeine components (authorization, stripe).
// Both this file and backend.ts are in src/, so the relative path is ./backend

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    setStripeConfiguration(config: {
      secretKey: string;
      allowedCountries: string[];
    }): Promise<void>;
    isStripeConfigured(): Promise<boolean>;
    createCheckoutSession(
      items: Array<{
        currency: string;
        productName: string;
        productDescription: string;
        priceInCents: number;
        quantity: number;
      }>,
      successUrl: string,
      cancelUrl: string,
    ): Promise<string>;
  }

  // Extend the Backend class so it satisfies the augmented interface
  interface Backend {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    setStripeConfiguration(config: {
      secretKey: string;
      allowedCountries: string[];
    }): Promise<void>;
    isStripeConfigured(): Promise<boolean>;
    createCheckoutSession(
      items: Array<{
        currency: string;
        productName: string;
        productDescription: string;
        priceInCents: number;
        quantity: number;
      }>,
      successUrl: string,
      cancelUrl: string,
    ): Promise<string>;
  }
}
export {};
