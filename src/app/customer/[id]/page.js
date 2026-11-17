
import { Suspense } from "react";
import CustomerClient from "./CustomerClient";

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#F8F5EF]">
          <p className="text-sm text-[#8B8177]">
            Loading...
          </p>
        </div>
      }
    >
      <CustomerClient />
    </Suspense>
  );
}
