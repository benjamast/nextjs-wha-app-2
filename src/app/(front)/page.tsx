import Image from "next/image";
import { WelcomeBanner } from "./components/welcome-banner";
import { ArrowUpRight, ShoppingBag, Star, Truck, Shield, RefreshCw, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Casual Wear", image: "/file.svg", count: "124 items" },
  { name: "Activewear", image: "/globe.svg", count: "89 items" },
  { name: "Accessories", image: "/next.svg", count: "56 items" },
  { name: "Footwear", image: "/window.svg", count: "72 items" },
];

const products = [
  { name: "Urban Canvas Jacket", price: 2890, original: 3590, rating: 4.8, reviews: 124, badge: "Sale" },
  { name: "Silk Blend Midi Dress", price: 3450, rating: 4.9, reviews: 89, badge: "New" },
  { name: "Wool Knit Overshirt", price: 2190, original: 2790, rating: 4.7, reviews: 56, badge: "Sale" },
  { name: "Leather Crossbody Bag", price: 1890, rating: 4.6, reviews: 203, badge: "Bestseller" },
  { name: "Retro Sneakers", price: 2590, rating: 4.5, reviews: 167, badge: "New" },
  { name: "Linen Wide-Leg Pants", price: 1990, rating: 4.8, reviews: 92, badge: "New" },
  { name: "Cashmere Beanie", price: 890, original: 1290, rating: 4.4, reviews: 78, badge: "Sale" },
  { name: "Denim Trucker Jacket", price: 2990, rating: 4.7, reviews: 145, badge: "Bestseller" },
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ฿1,500" },
  { icon: Shield, title: "Secure Checkout", desc: "SSL encrypted payment" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Sparkles, title: "VIP Rewards", desc: "Earn points on every purchase" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${i < Math.floor(rating) ? "fill-tertiary text-tertiary" : "fill-none text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background">
      <WelcomeBanner />
      {/* === HERO === */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <Badge className="w-fit rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-primary text-sm">
                <Sparkles className="mr-1 size-4" />
                New Summer Collection
              </Badge>
              <h1 className="font-heading text-[2.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-7xl">
                Style That
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Speaks</span>
                <br />
                Volumes
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                Discover curated fashion pieces that define your vibe. From streetwear chic to elevated essentials — your next look starts here.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold shadow-medium hover:shadow-large">
                  <ShoppingBag className="mr-2 size-5" />
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-primary/30 px-8 py-6 text-base text-primary hover:bg-accent">
                  Explore Collection <ArrowUpRight className="ml-2 size-5" />
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-tertiary text-tertiary" />
                  <span>4.9/5 from 12k+ reviews</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span>Free shipping over ฿1,500</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/10 p-1 shadow-large">
                <div className="flex h-full w-full items-center justify-center rounded-[calc(0.75rem-4px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                  <div className="space-y-4 text-center">
                    <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="size-10 text-primary" />
                    </div>
                    <p className="font-heading text-2xl font-bold">Summer Sale</p>
                    <p className="text-muted-foreground">Up to 40% off selected styles</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-medium">
                <div className="flex items-center gap-3">
                  <Heart className="size-5 fill-destructive text-destructive" />
                  <div>
                    <p className="text-sm font-semibold">Trending Now</p>
                    <p className="text-xs text-muted-foreground">2.4k saved this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Badge className="mb-3 rounded-full bg-secondary/10 px-3 py-1 text-secondary text-xs">Categories</Badge>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">Shop by Category</h2>
            </div>
            <Link href="#" className="hidden items-center gap-1 text-sm font-semibold text-primary md:flex hover:underline">
              View All <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href="#" className="group">
                <div className="relative overflow-hidden rounded-xl bg-card p-1 shadow-subtle ring-1 ring-border transition-all duration-200 hover:shadow-product-hover hover:-translate-y-1">
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[calc(0.75rem-4px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                    <Image src={cat.image} alt={cat.name} width={64} height={64} className="size-16 opacity-60 transition-all group-hover:scale-110 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-base font-semibold">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === TRENDING PRODUCTS === */}
      <section className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">Trending Now</Badge>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">New Arrivals</h2>
            <p className="mt-3 text-muted-foreground">The latest drops you won&apos;t want to miss</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <div key={product.name} className="group relative">
                <div className="relative mb-3 overflow-hidden rounded-xl bg-card shadow-subtle ring-1 ring-border transition-all duration-200 hover:shadow-product-hover hover:-translate-y-1">
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-primary/[0.03] via-background to-secondary/[0.03]">
                    <ShoppingBag className="size-12 text-muted-foreground/30 transition-all group-hover:scale-110" />
                  </div>
                  <div className="absolute right-2 top-2 flex flex-col gap-1.5">
                    <button className="flex size-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-subtle backdrop-blur-sm transition-all hover:bg-primary hover:text-white">
                      <Heart className="size-4" />
                    </button>
                  </div>
                  <div className="absolute left-3 top-3">
                    <Badge className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      product.badge === "Sale" ? "bg-destructive text-white" :
                      product.badge === "New" ? "bg-secondary text-foreground" :
                      "bg-tertiary text-foreground"
                    }`}>
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-200 group-hover:translate-y-0">
                    <Button className="w-full rounded-full text-xs font-bold shadow-medium" size="sm">
                      Quick Add
                    </Button>
                  </div>
                </div>
                <Link href="#">
                  <h3 className="truncate font-heading text-sm font-semibold md:text-base">{product.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-bold text-primary">฿{product.price.toLocaleString()}</span>
                    {product.original && (
                      <span className="text-sm text-muted-foreground line-through">฿{product.original.toLocaleString()}</span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-full border-primary/30 px-8 text-primary hover:bg-accent">
              View All Products <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* === SALE BANNER === */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/40 to-tertiary/20" />
        <div className="relative mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-card/90 p-8 shadow-overlay backdrop-blur-sm md:p-16">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <Badge className="w-fit rounded-full bg-secondary/20 px-4 py-1.5 text-secondary text-sm">
                  Limited Time Offer
                </Badge>
                <h2 className="font-heading text-3xl font-extrabold md:text-5xl">
                  Summer Sale
                  <br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Up to 40% Off</span>
                </h2>
                <p className="max-w-md text-muted-foreground">
                  Flash sale on select styles. Use code <code className="rounded-md bg-muted px-2 py-0.5 font-mono text-sm font-bold text-primary">VIBE40</code> at checkout. Hurry, while stocks last.
                </p>
                <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold shadow-medium">
                  Shop the Sale
                </Button>
              </div>
              <div className="hidden justify-center md:flex">
                <div className="flex size-48 items-center justify-center rounded-full bg-gradient-to-br from-tertiary/20 via-background to-primary/10">
                  <div className="text-center">
                    <p className="font-heading text-5xl font-extrabold text-primary">40%</p>
                    <p className="text-sm font-semibold text-muted-foreground">OFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Why Shop With Us</h2>
            <p className="mt-3 text-muted-foreground">We make sure you love every part of the experience</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-xl bg-background p-6 text-center shadow-subtle ring-1 ring-border transition-all duration-200 hover:shadow-medium hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-base font-bold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === NEWSLETTER === */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-background to-primary/5" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 rounded-full bg-tertiary/20 px-3 py-1 text-tertiary text-xs">Stay in the Loop</Badge>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Join the Vibe</h2>
          <p className="mt-3 text-muted-foreground">
            Subscribe to get exclusive access to new drops, sales, and style inspiration. No spam, just the good stuff.
          </p>
          <div className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-input bg-card px-6 font-sans text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/15 focus:outline-none"
            />
            <Button className="h-12 rounded-full px-8 font-bold shadow-medium">
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="font-heading text-lg font-bold text-primary">ShopVibe</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Curated fashion &amp; lifestyle essentials. Elevate your everyday.
              </p>
              <div className="mt-4 flex gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white">
                  <span className="text-xs font-bold">IG</span>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white">
                  <span className="text-xs font-bold">FB</span>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white">
                  <span className="text-xs font-bold">TT</span>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Sale</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">Help</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Shipping &amp; Delivery</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Returns &amp; Exchanges</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 ShopVibe. All rights reserved. Made with ❤️ for fashion lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
