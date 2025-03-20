// payment/page.js
"use client";

import { Suspense } from "react";
import PaymentPageContent from "./paymentpagecontent";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
