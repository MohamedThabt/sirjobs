import { ArrowUpRight, CirclePlay, Sparkles } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";

declare const route: any;

export default function Hero() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <AnimatedGridPattern
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
        duration={3}
        maxOpacity={0.1}
        numSquares={30}
      />
      <div className="relative z-10 max-w-3xl text-center">
        <a href="#">
          <Badge
            className="rounded-full border-border py-1 px-4 cursor-pointer"
            variant="secondary"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Sirthabet Talent Radar 1.0 is live
          </Badge>
        </a>
        <h1 className="mt-8 font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl md:leading-[1.1] lg:text-7xl text-foreground text-balance">
          Stop Searching Jobs. <br/> <span className="text-primary">Start Targeting Opportunities.</span>
        </h1>
        <p className="mt-6 text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto">
          AI-powered job intelligence that finds, analyzes, and recommends the best jobs for you.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a href={typeof route !== 'undefined' ? route('register') : '/register'}>
            <Button className="rounded-full h-14 px-8 text-lg shadow-lg font-semibold" size="lg">
              Get Started <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <a href="#how-it-works">
            <Button
              className="rounded-full h-14 px-8 text-lg font-medium shadow-none bg-background hover:bg-muted"
              size="lg"
              variant="outline"
            >
              <CirclePlay className="mr-2 h-5 w-5" /> See How It Works
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
