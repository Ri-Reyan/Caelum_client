"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import AxiosInstance from "@/utils/axiosInstance";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [clientSecret, setClientSecret] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Create Payment Intent via axiosInstance
  useEffect(() => {
    if (!orderId) return;

    const initPaymentIntent = async () => {
      try {
        const response = await AxiosInstance.post(
          `/api/payment/create/${orderId}`,
        );

        if (response.data?.success) {
          setClientSecret(response.data.data.clientSecret);
          setOrderSummary(response.data.data.order);
        } else {
          throw new Error(
            response.data?.message || "Failed to initialize payment",
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.message ||
            err.message ||
            "Could not load checkout session",
        );
      } finally {
        setLoading(false);
      }
    };

    initPaymentIntent();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-stone-400">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-stone-100 py-12 px-4 sm:px-8 flex justify-center items-center">
      <div className="w-full max-w-xl bg-[#18181b] border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-6 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} /> Stripe Secure Payment
          </div>
        </div>

        {errorMsg ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            ⚠️ {errorMsg}
          </div>
        ) : (
          <div>
            {/* ORDER SUMMARY */}
            <div className="bg-[#121214] border border-stone-800 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase text-stone-500 font-semibold">
                  Total Payable
                </p>
                <h3 className="text-2xl font-black text-white">
                  ${orderSummary?.totalPrice?.toLocaleString()}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] bg-stone-800 text-stone-300 px-3 py-1 rounded-md font-mono">
                  Order #{orderId?.slice(-6)}
                </span>
                <p className="text-xs text-stone-400 mt-1">
                  Quantity: {orderSummary?.quantity}
                </p>
              </div>
            </div>

            {/* DEMO CARD BANNER */}
            <DemoCardHelper />

            {/* STRIPE PAYMENT FORM */}
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#ffffff",
                      colorBackground: "#121214",
                      colorText: "#ffffff",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <StripePaymentForm />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// DEMO CARD HELPER COMPONENT
// ========================================================================
function DemoCardHelper() {
  const [copied, setCopied] = useState(false);
  const cardNumber = "4242 4242 4242 4242";

  const handleCopy = () => {
    navigator.clipboard.writeText("4242424242424242");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
          Stripe Demo Card
        </p>
        <p className="text-xs font-mono text-stone-200 mt-0.5">{cardNumber}</p>
        <p className="text-[10px] text-stone-500 mt-0.5">
          Exp: Future Date | CVC: Any 3 Digits
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
      >
        {copied ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Copy size={14} />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

// ========================================================================
// STRIPE PAYMENT FORM COMPONENT
// ========================================================================
function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [payError, setPayError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPayError("");

    // 1. Stripe payment confirmation
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setPayError(error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const response = await AxiosInstance.post(
          `/api/payment/confirm/${paymentIntent.id}`,
        );

        if (response.data?.success) {
          setIsSuccess(true);
        } else {
          setPayError(
            response.data?.message || "Payment verification failed on server.",
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setPayError(
          err?.response?.data?.message || "Server confirmation error.",
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <CheckCircle2
          size={60}
          className="mx-auto text-emerald-400 animate-bounce"
        />
        <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
        <p className="text-stone-400 text-xs">
          Your payment has been verified and your order is confirmed.
        </p>
        <button
          onClick={() => router.push("/watches")}
          className="mt-4 px-6 py-3 rounded-xl bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {payError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {payError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 rounded-xl bg-white text-stone-950 font-bold text-sm hover:bg-stone-200 transition shadow-lg flex justify-center items-center gap-2 active:scale-98 disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <Lock size={16} /> Pay & Confirm
          </>
        )}
      </button>
    </form>
  );
}
