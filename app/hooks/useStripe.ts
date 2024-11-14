import { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const useStripe = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!
      );
      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStripeCheckout(checkoutData: any) {
    if (!stripe) {
      throw new Error("Stripe instance not loaded");
    }

    try {
      const response = await fetch("/api/stripe/create-pay-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      toast.error(`Error creating payment checkout`);
      console.log(error);
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: any) {
    if (!stripe) {
      throw new Error("Stripe instance not loaded");
    }

    try {
      const response = await fetch("/api/stripe/create-sub-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      toast.error(`Você está logado?`);
      console.log(error);
    }
  }

  async function handleCreateStripePortal() {
    const response = await fetch("/api/stripe/create-portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    window.location.href = data.url;
  }

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  };
};

export default useStripe;
