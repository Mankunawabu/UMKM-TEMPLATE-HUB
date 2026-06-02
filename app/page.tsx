import { getCurrentProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing-page";

export default async function Home() {
  const profile = await getCurrentProfile();

  if (profile) {
    if (profile.role === "admin") redirect("/admin");
    if (profile.is_onboarding_completed) redirect("/dashboard");
    redirect("/onboarding");
  }

  // Not logged in → show landing page
  return <LandingPage />;
}
