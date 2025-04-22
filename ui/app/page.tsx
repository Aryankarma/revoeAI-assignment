"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Table,
  RefreshCw,
  Clock,
  Columns,
  Link2,
  Search,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { redirect } from "next/dist/server/api-utils";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const theme = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-12 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SheetSync</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <button
              className="text-sm font-medium hover:text-primary"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Features
            </button>
            <button
              onClick={() => {
                const howItWorksSection =
                  document.getElementById("how-it-works");
                if (howItWorksSection) {
                  howItWorksSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const pricing = document.getElementById("pricing");
                if (pricing) {
                  pricing.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                const faq = document.getElementById("faq");
                if (faq) {
                  faq.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-sm font-medium hover:text-primary"
            >
              FAQ
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href={{
                pathname: "/app/auth",
                query: { q: "login" },
              }}
              className="text-sm font-medium hover:text-primary"
            >
              Log in
            </Link>
            <Link
              href={{
                pathname: "/app/auth",
                query: { q: "register" },
              }}
            >
              <Button className="group">
                Get Started
                <ArrowRight className="ml-0 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="px-12 ">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-[900] tracking-tight sm:text-5xl xl:text-6xl/none">
                    Manage Google Sheets{" "}
                    <span className="text-primary">Effortlessly</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect, visualize, and manage your Google Sheets in
                    real-time with a powerful, intuitive interface.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href={{
                      pathname: "/app/auth",
                      query: { q: "login" },
                    }}
                  >
                    <Button className="group" size="lg">
                      Start for Free
                      <ArrowRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    See Demo
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[700px] overflow-hidden rounded-lg">
                  <Image
                    src={
                      theme.theme === "dark"
                        ? "/landing/sheetsyncdark.png"
                        : "/landing/sheetsync.png"
                    }
                    alt="SheetSync Dashboard"
                    width={650}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full hover:bg-primary/5 transition-all  bg-primary/10 px-3 py-1 my-3 text-xs text-primary">
                  Features
                </div>
                <h2 className="text-3xl font-[900] tracking-tight sm:text-4xl md:text-5xl">
                  Everything you need to manage your sheets
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SheetSync transforms how you work with Google Sheets, making
                  data management simpler and more powerful.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {[
                {
                  icon: (
                    <Link2 className="h-6 w-6 text-primary group-hover:rotate-6 transition-transform duration-300" />
                  ),
                  title: "Easy Connection",
                  desc: "Connect to any public Google Sheet with just a URL and start managing your data instantly.",
                },
                {
                  icon: (
                    <Columns className="h-6 w-6 text-primary group-hover:rotate-6 transition-transform duration-300" />
                  ),
                  title: "Dynamic Columns",
                  desc: "Add and customize columns on the fly to organize your data exactly how you need it.",
                },
                {
                  icon: (
                    <RefreshCw className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  ),
                  title: "Real-time Updates",
                  desc: "See changes instantly with real-time synchronization between SheetSync and your Google Sheets.",
                },
                {
                  icon: (
                    <Search className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  ),
                  title: "Powerful Search",
                  desc: "Find exactly what you're looking for with our advanced search functionality.",
                },
                {
                  icon: (
                    <Table className="h-6 w-6 text-primary group-hover:-rotate-6 transition-transform duration-300" />
                  ),
                  title: "Multiple Tables",
                  desc: "Manage multiple sheets from a single dashboard with organized, clean interfaces.",
                },
                {
                  icon: (
                    <Clock className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  ),
                  title: "Version History",
                  desc: "Track changes with timestamps and see when your data was last updated.",
                },
              ].map(({ icon, title, desc }, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center space-y-3 rounded-2xl border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md hover:shadow-primary/20"
                >
                  <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold text-center">{title}</h3>
                  <p className="text-center text-muted-foreground text-sm">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full hover:bg-primary/5 transition-all  bg-primary/10 px-3 py-1 my-3 text-xs text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-[900] tracking-tight sm:text-4xl md:text-5xl">
                  Simple, powerful, and intuitive
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started in minutes and transform how you work with Google
                  Sheets.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Connect Your Sheet</h3>
                <p className="text-center text-muted-foreground">
                  Paste your public Google Sheet URL and give your table a name.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Customize Your View</h3>
                <p className="text-center text-muted-foreground">
                  Add columns, set up filters, and organize your data exactly
                  how you want it.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Manage with Ease</h3>
                <p className="text-center text-muted-foreground">
                  View, search, and manage your data with real-time updates and
                  powerful tools.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border shadow-lg">
              <Image
                src={
                  theme.theme === "dark"
                    ? "/landing/sheetsync-table-view-dark.png"
                    : "/landing/sheetsync-table-view.png"
                }
                alt="SheetSync Table View"
                width={800}
                height={500}
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-muted py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full hover:bg-primary/5 transition-all  bg-primary/10 px-3 py-1 my-3 text-xs text-primary">
                  Pricing
                </div>
                <h2 className="text-3xl font-[900] tracking-tight sm:text-4xl md:text-5xl">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for you and start managing your
                  Google Sheets like a pro.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Free</h3>
                  <p className="text-muted-foreground">For personal use</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="mb-6 mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Up to 3 tables</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Basic search functionality</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Manual refresh</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-auto">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm relative scale-110">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Popular
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">For professionals</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$12</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="mb-6 mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Up to 20 tables</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Advanced search</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Auto-refresh (every 5 min)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom column types</span>
                  </li>
                </ul>
                <Button className="mt-auto">Get Started</Button>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Enterprise</h3>
                  <p className="text-muted-foreground">
                    For teams & businesses
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="mb-6 mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Unlimited tables</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Real-time updates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-auto">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full hover:bg-primary/5 transition-all  bg-primary/10 px-3 py-1 my-3 text-xs text-primary">
                  Testimonials
                </div>
                <h2 className="text-3xl font-[900] tracking-tight sm:text-4xl md:text-5xl">
                  Loved by teams everywhere
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users have to say about SheetSync.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <p className="mb-4 italic text-muted-foreground">
                  "SheetSync has completely transformed how our team manages
                  data. What used to take hours now takes minutes."
                </p>
                <div className="mt-auto flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">
                      Marketing Director, TechCorp
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <p className="mb-4 italic text-muted-foreground">
                  "The real-time updates and easy connection to our Google
                  Sheets has made our workflow so much more efficient."
                </p>
                <div className="mt-auto flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Project Manager, Innovate Inc
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}

        <section id="faq" className="bg-muted py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full hover:bg-primary/5 transition-all  bg-primary/10 px-3 py-1 my-3 text-xs text-primary">
                  FAQ
                </div>
                <h2 className="text-3xl font-[900] tracking-tight sm:text-4xl md:text-5xl">
                  Frequently asked questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about SheetSync.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-4 py-12">
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Do I need to give SheetSync access to my Google account?
                  </AccordionTrigger>
                  <AccordionContent>
                    No, SheetSync only requires the public URL of your Google
                    Sheet. You don't need to provide any Google account
                    credentials.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How often does SheetSync update the data?
                  </AccordionTrigger>
                  <AccordionContent>
                    It depends on your plan. Free users can manually refresh,
                    Pro users get updates every 5 minutes, and Enterprise users
                    get real-time updates.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Can I edit my Google Sheet through SheetSync?
                  </AccordionTrigger>
                  <AccordionContent>
                    Currently, SheetSync is focused on providing a powerful
                    viewing and management experience. Editing functionality is
                    on our roadmap.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    SheetSync only accesses the data you explicitly connect
                    through public Google Sheet URLs. We never store your actual
                    sheet data on our servers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="px-12 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[740px]">
                <h2 className="text-3xl font-[900] trnpacking-tight sm:text-4xl md:text-5xl">
                  Ready to transform how you work with Google Sheets?
                </h2>
                <p className=" mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already managing their data
                  more efficiently with SheetSync.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="px-12 flex flex-col gap-4 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="flex items-start flex-col gap-2">
                {/* <Table className="h-6 w-6 text-primary" /> */}
                <span className="text-xl font-bold">SheetSync</span>
              </div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                SheetSync helps you connect, visualize, and manage your Google
                Sheets in real-time with a powerful, intuitive interface.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SheetSync. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
