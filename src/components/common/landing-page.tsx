import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import LoginButton from '@/components/common/login-button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col max-w-screen-xl mx-auto">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-5 w-5" />
            <span>everyCents</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Take control of your finances
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Simpler, Smarter, and more Intuitive—helping you save more and
                  spend wisely.
                </p>
              </div>
              <div className="space-x-4">
                <LoginButton size="lg" />
                <Button variant="outline" size="lg">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Your search for the perfect budget tracker ends here.
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to track,
                  analyze, and optimize your spending.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Expense Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Easily log and categorize your expenses to see where your
                  money is going.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Budget Planning</h3>
                <p className="text-center text-muted-foreground">
                  Get personalized monthly budget statements to plan smarter and
                  stay on top of your finances.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Financial Insights</h3>
                <p className="text-center text-muted-foreground">
                  Powered by AI, get personalized insights and smart
                  recommendations to improve your financial health.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to take control?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who have transformed their financial
                  habits with everyCents.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <LoginButton className="w-full" size="lg" />
                <p className="text-xs text-muted-foreground">
                  No credit card required. Start tracking for free.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} everyCents. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
