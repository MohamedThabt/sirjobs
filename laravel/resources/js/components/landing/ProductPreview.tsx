import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export function ProductPreview() {
  return (
    <section className="py-24 bg-muted/20 border-y border-border/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">See inside the platform</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Experience the tools that give our users an unfair advantage in their job search.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <Tabs defaultValue="job-card" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-10 bg-background/50 border border-border/50 shadow-sm rounded-full p-1">
              <TabsTrigger value="job-card" className="rounded-full">Job UI</TabsTrigger>
              <TabsTrigger value="insights" className="rounded-full">AI Insights</TabsTrigger>
              <TabsTrigger value="fit-score" className="rounded-full">Fit Score</TabsTrigger>
            </TabsList>
            
            <TabsContent value="job-card" className="mt-0 outline-none">
              <Card className="overflow-hidden border-border/50 rounded-3xl shadow-2xl bg-card">
                <div className="h-12 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <div className="text-xs text-muted-foreground ml-4 font-mono">talent-radar.app/jobs/1423</div>
                </div>
                <div className="p-8 sm:p-12 aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                  <div className="text-center z-10 w-full animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-card w-full max-w-lg mx-auto shadow-xl rounded-2xl border border-border/50 p-8 text-left hover:border-primary/20 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">S</div>
                        <div className="h-7 w-28 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-xs font-semibold text-emerald-500">Strong Match</div>
                      </div>
                      <div className="h-7 w-3/4 bg-foreground/10 rounded-md mt-4 mb-3"></div>
                      <div className="h-5 w-1/2 bg-muted-foreground/20 rounded-md mb-8"></div>
                      <div className="flex gap-3 mb-8">
                         <div className="h-8 w-20 bg-secondary rounded-full"></div>
                         <div className="h-8 w-24 bg-secondary rounded-full"></div>
                         <div className="h-8 w-20 bg-secondary rounded-full"></div>
                      </div>
                      <div className="h-12 w-full bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                        <div className="h-4 w-32 bg-primary/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0 outline-none">
              <Card className="overflow-hidden border-border/50 rounded-3xl shadow-2xl bg-card">
                <div className="h-12 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <div className="text-xs text-muted-foreground ml-4 font-mono">talent-radar.app/insights</div>
                </div>
                <div className="p-8 sm:p-12 aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                  <div className="bg-card w-full max-w-lg mx-auto shadow-xl rounded-2xl border border-border/50 p-8 flex flex-col gap-5 text-left z-10 animate-in fade-in zoom-in-95 duration-500">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 rounded bg-primary/20"></div>
                        <div className="h-5 w-40 bg-foreground/10 rounded-md"></div>
                     </div>
                     <div className="p-5 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="h-4 w-full bg-foreground/10 rounded mb-3"></div>
                        <div className="h-4 w-5/6 bg-foreground/10 rounded mb-3"></div>
                        <div className="h-4 w-3/4 bg-foreground/10 rounded"></div>
                     </div>
                     <div className="p-5 bg-muted/30 border border-border/50 rounded-xl mt-2">
                        <div className="h-4 w-full bg-muted-foreground/20 rounded mb-3"></div>
                        <div className="h-4 w-4/6 bg-muted-foreground/20 rounded"></div>
                     </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="fit-score" className="mt-0 outline-none">
              <Card className="overflow-hidden border-border/50 rounded-3xl shadow-2xl bg-card">
                <div className="h-12 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <div className="text-xs text-muted-foreground ml-4 font-mono">talent-radar.app/fit-analyzer</div>
                </div>
                <div className="p-8 sm:p-12 aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
                   <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                   <div className="flex flex-col sm:flex-row items-center gap-10 bg-card shadow-xl rounded-3xl border border-border/50 p-10 z-10 animate-in fade-in zoom-in-95 duration-500">
                      <div className="relative h-40 w-40 rounded-full border-[12px] border-muted flex items-center justify-center bg-background/50 shadow-inner">
                         <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 rounded-bl-none rotate-45 opacity-90 blur-[1px]"></div>
                         <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 rounded-bl-none rotate-45"></div>
                         <div className="flex flex-col items-center">
                            <span className="text-5xl font-black text-foreground tracking-tighter">92</span>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Score</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-5 w-full sm:w-56">
                         <div>
                            <div className="flex justify-between mb-2">
                               <span className="text-xs font-semibold text-muted-foreground uppercase">Skills Match</span>
                               <span className="text-xs font-bold text-emerald-500">95%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[95%] rounded-full"></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between mb-2">
                               <span className="text-xs font-semibold text-muted-foreground uppercase">Experience</span>
                               <span className="text-xs font-bold text-emerald-500">100%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between mb-2">
                               <span className="text-xs font-semibold text-muted-foreground uppercase">Tech Stack</span>
                               <span className="text-xs font-bold text-amber-500">75%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-amber-500 w-[75%] rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
