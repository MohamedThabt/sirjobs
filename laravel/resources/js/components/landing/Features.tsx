import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BrainCircuit, Target, Zap, Bell, CheckCircle2, Radar } from 'lucide-react';

const features = [
  {
    title: 'AI Job Intelligence',
    description: 'Our AI reads between the lines of job descriptions to understand what companies really want.',
    icon: BrainCircuit,
  },
  {
    title: 'Smart Matching Engine',
    description: 'We match your skills, experience, and preferences against thousands of daily job postings.',
    icon: Target,
  },
  {
    title: 'Fit Score System',
    description: 'Instantly know if a job is worth applying to with our proprietary 0-100 Fit Score.',
    icon: CheckCircle2,
  },
  {
    title: 'Real-Time Alerts',
    description: 'Be the first to know when a high-fit opportunity is posted with instant notifications.',
    icon: Bell,
  },
  {
    title: 'Auto Apply Assistant',
    description: 'Generate tailored resumes and cover letters in one click using AI.',
    icon: Zap,
  },
  {
    title: 'Opportunity Radar',
    description: 'Uncover hidden tech jobs that match your exact criteria before they get saturated.',
    icon: Radar,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Features</h2>
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to land your next role</h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Sirthabet Talent Radar combines advanced AI with deep job market insights to give you an unfair advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-background/50 rounded-2xl hover:shadow-md hover:border-border transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
