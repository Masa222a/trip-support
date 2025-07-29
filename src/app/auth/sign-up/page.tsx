import Header from "@/app/components/layouts/header/header";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div>
      <Header />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
