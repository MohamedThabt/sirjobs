import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, TrendingUp, Users, MapPin, DollarSign } from 'lucide-react';

const radarJobs = [
  {
    role: 'Frontend Architect',
    company: 'Vercel Ecosystem',
    salary: '$180k - $240k',
    location: 'Remote (US)',
    fitScore: 98,
    metric: 'Low Competition',
    metricIcon: Users,
    tags: ['Next.js', 'React', 'Turbopack']
  },
  {
    role: 'Staff UI Engineer',
    company: 'Linear Hub',
    salary: '$170k - $220k',
    location: 'Remote (Global)',
    fitScore: 95,
    metric: 'High Salary Match',
    metricIcon: DollarSign,
    tags: ['TypeScript', 'Design Systems']
  },
  {
    role: 'Senior React Developer',
    company: 'OpenAI Partners',
    salary: '$150k - $200k',
    location: 'San Francisco, CA',
    fitScore: 91,
    metric: 'Trending Role',
    metricIcon: TrendingUp,
    tags: ['React', 'AI Integration']
  },
];

export function OpportunityRadar() {
  return (
    <section className="py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Your Daily <span className="text-primary">Job Intelligence</span> Brief
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Every morning, our AI curates a personalized brief of high-fit roles, highlighting opportunities with low competition and salaries that match your expectations.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Beat the Competition</h4>
                  <p className="text-muted-foreground">Find fresh roles before they hit major job boards and get saturated with applicants.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Salary Intelligence</h4>
                  <p className="text-muted-foreground">We decode compensation packages and only show you roles that meet your financial goals.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 w-8"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-10 h-8"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-8 top-auto bottom-0"></div>
            
            <div className="flex flex-col gap-4 relative z-0">
              {radarJobs.map((job, idx) => (
                <Card key={idx} className={`border-border/50 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all ${idx === 1 ? 'ml-0 md:ml-8 translate-x-0' : ''} ${idx === 2 ? 'opacity-80' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
                      </div>
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-2.5 py-0.5 border-none shadow-none">
                        {job.fitScore}% Fit
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50">
                      <div className="flex gap-2">
                        {job.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-secondary/50 font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <job.metricIcon className="h-3.5 w-3.5" />
                        {job.metric}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
