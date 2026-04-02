import { UserPlus, Sparkles, Send } from 'lucide-react';

const steps = [
  {
    title: 'Connect your profile',
    description: 'Upload your resume or link your LinkedIn. We build a comprehensive profile of your skills, experience, and career goals.',
    icon: UserPlus,
  },
  {
    title: 'AI analyzes jobs',
    description: 'Our engine scans thousands of jobs daily, analyzing requirements and matching them against your unique profile.',
    icon: Sparkles,
  },
  {
    title: 'Apply smarter',
    description: 'Focus your energy only on high-fit roles. Generate tailored applications instantly and land interviews faster.',
    icon: Send,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A frictionless workflow designed to save you time and maximize your success rate.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute top-12 left-24 right-24 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-xl mb-6">
                  <div className="absolute inset-0 bg-primary/5 rounded-full"></div>
                  <step.icon className="h-10 w-10 text-primary relative z-10" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center text-sm z-20 shadow-md border-2 border-background">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
