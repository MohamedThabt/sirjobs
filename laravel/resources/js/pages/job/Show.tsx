import { Head, Link } from '@inertiajs/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ArrowLeft, MapPin, Building2, Clock, Tag, ExternalLink, CalendarDays, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Job {
    id: number;
    external_id: string;
    source: string;
    title: string;
    company: string | null;
    location: string | null;
    url: string;
    description: string | null;
    salary: string | null;
    tags: string[] | null;
    posted_at: string | null;
    created_at: string;
}

interface Props {
    job: Job;
}

const SOURCE_COLORS: Record<string, string> = {
    adzuna: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    remotive: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    reed_api: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    the_muse: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    arbeitnow: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    reed_rss: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    remoteok_rss: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    working_nomads_rss: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    serpapi_google_jobs: 'bg-red-500/15 text-red-400 border-red-500/30',
    jobicy: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

export default function JobShow({ job }: Props) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground font-sans selection:bg-primary/20">
            <Head title={`${job.title} - Sirthabet Talent Radar`} />

            <Navbar />

            {/* Back Navigation */}
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <Link 
                    href="/jobs" 
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to jobs
                </Link>
            </div>

            {/* Job Header */}
            <header className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md p-8 md:p-12 relative overflow-hidden">
                    {/* Subtle internal gradient */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-bl-full blur-3xl -z-10" />
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                        <div className="flex-1">
                            {/* Source Badge */}
                            <span
                                className={`inline-flex items-center px-3 py-1 mb-6 rounded-md text-sm font-bold border shadow-sm tracking-wide ${SOURCE_COLORS[job.source] || 'bg-muted text-muted-foreground border-border'}`}
                            >
                                {job.source.replace(/_/g, ' ').toUpperCase()}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground font-medium">
                                {job.company && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-lg text-foreground/90">{job.company}</span>
                                    </div>
                                )}
                                {job.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 opacity-70" />
                                        {job.location}
                                    </span>
                                )}
                                {job.posted_at && (
                                    <span className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 opacity-70" />
                                        Posted {timeAgo(job.posted_at)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA Region */}
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                                <Button size="lg" className="w-full md:w-auto h-14 px-8 rounded-xl shadow-xl shadow-primary/20 text-lg font-bold">
                                    Apply Externally
                                    <ExternalLink className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col lg:flex-row gap-12">
                
                {/* Left Column: Description */}
                <article className="lg:w-2/3">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                        About the Role
                    </h2>
                    
                    {job.description ? (
                        <div 
                            className="prose prose-invert prose-p:leading-relaxed prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-a:text-primary hover:prose-a:text-primary/80 prose-li:marker:text-primary max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: job.description }} 
                        />
                    ) : (
                        <p className="text-muted-foreground italic bg-muted/20 p-6 rounded-xl border border-border/50">
                            No detailed description provided by the source. Please check the external link for full details.
                        </p>
                    )}
                </article>

                {/* Right Column: Meta Sidebar */}
                <aside className="lg:w-1/3 space-y-8">
                    {/* Key Details Card */}
                    <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            Snapshot
                        </h3>
                        
                        <dl className="space-y-6">
                            {job.salary && (
                                <div>
                                    <dt className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                        <Banknote className="h-4 w-4" /> Expected Salary
                                    </dt>
                                    <dd className="font-semibold text-emerald-400">{job.salary}</dd>
                                </div>
                            )}

                            <div>
                                <dt className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <CalendarDays className="h-4 w-4" /> Published Date
                                </dt>
                                <dd className="font-medium text-foreground">
                                    {formatDate(job.posted_at)}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4" /> Imported Date
                                </dt>
                                <dd className="font-medium text-foreground/80">
                                    {formatDate(job.created_at)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Tags Card */}
                    {job.tags && job.tags.length > 0 && (
                        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tag className="h-5 w-5" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags.map((tag, i) => (
                                    <span 
                                        key={i} 
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Bottom Apply CTA */}
                    <div className="pt-6 border-t border-border/30">
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <Button variant="outline" className="w-full h-12 border-primary/50 hover:bg-primary/10 text-primary group">
                                Open Original Posting
                                <ExternalLink className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </a>
                    </div>
                </aside>
            </main>

            <Footer />
        </div>
    );
}
