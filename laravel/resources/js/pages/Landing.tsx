import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/landing/Navbar';
import Hero from '@/components/hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { OpportunityRadar } from '@/components/landing/OpportunityRadar';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

import { JobSourcesCloud } from '@/components/landing/JobSourcesCloud';

import Team from '@/components/team';

declare const route: any;

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
      <Head title="Sirthabet Talent Radar - AI Job Intelligence" />
      
      <Navbar />
      
      <main>
        <Hero />
        <JobSourcesCloud />
        <Features />
        <HowItWorks />
        <ProductPreview />
        <OpportunityRadar />
        <Pricing />
        
        <Team />
        
        {/* Final CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Let AI Find Your Next Job
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of tech professionals who have stopped searching and started targeting their perfect opportunities.
            </p>
            <a href={typeof route !== 'undefined' ? route('register') : '/register'}>
              <Button size="lg" className="rounded-full shadow-xl h-14 px-10 text-lg font-semibold">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
