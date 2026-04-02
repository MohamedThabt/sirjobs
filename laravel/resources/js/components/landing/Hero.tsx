import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

declare const route: any;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 lg:pt-40 lg:pb-40">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl text-left z-10">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>Sirthabet Talent Radar 1.0 is live</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl text-balance">
              Stop Searching Jobs. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Start Targeting Opportunities.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground mr-8 text-balance">
              AI-powered job intelligence that finds, analyzes, and recommends the best jobs for you based on your unique profile and skills.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={typeof route !== 'undefined' ? route('register') : '/register'}>
                <Button size="lg" className="rounded-full shadow-lg h-12 px-8 font-semibold">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="rounded-full h-12 px-8 bg-background">
                  <Play className="mr-2 h-4 w-4" /> See How It Works
                </Button>
              </a>
            </div>
          </div>
          
          <div className="relative mx-auto w-full max-w-lg z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            <Card className="relative border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl">
              <CardContent className="p-7">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Senior Frontend Engineer</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Stripe • Remote • $160k - $210k</p>
                  </div>
                  <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 text-sm font-semibold whitespace-nowrap">
                    98% Fit Score
                  </Badge>
                </div>
                
                <div className="mt-6 bg-muted/40 rounded-xl p-5 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">AI Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Perfect match for your React and Tailwind CSS experience. This role focuses on building complex SaaS UI interfaces. Your 4+ years of TypeScript experience meets their core requirement.
                  </p>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary">React</Badge>
                  <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary">TypeScript</Badge>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Strong Match</Badge>
                </div>
                
                <Button className="w-full mt-8 h-12 font-semibold text-md" variant="default">Auto-Apply with AI</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
