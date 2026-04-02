import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for casual job seekers exploring the market.',
    price: '$0',
    duration: '/month',
    features: [
      'Basic AI Job Matching',
      'Up to 10 Fit Scores daily',
      'Standard Opportunity Radar',
      'Community Support'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Pro',
    description: 'The unfair advantage for serious tech professionals.',
    price: '$20',
    duration: '/month',
    features: [
      'Advanced AI Job Intelligence',
      'Unlimited Fit Scores',
      'Real-Time Job Alerts',
      'Auto Apply Assistant',
      'Salary & Competition Insights',
      'Priority Support'
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as const,
    highlight: true,
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Invest in your career. Skip the noise and land the job you deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col rounded-3xl ${
                plan.highlight 
                  ? 'border-primary/50 shadow-2xl shadow-primary/10 bg-card scale-100 md:scale-105 z-10' 
                  : 'border-border/50 shadow-md bg-background'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="p-8 text-center pb-4">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base h-10">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-base font-medium text-muted-foreground">{plan.duration}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 pt-6 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="p-8 pt-0">
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full h-12 text-base font-semibold rounded-xl ${plan.highlight ? 'shadow-lg' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
