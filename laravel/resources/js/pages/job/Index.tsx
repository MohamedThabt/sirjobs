import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Search, MapPin, Briefcase, ExternalLink, Clock, Building2, Tag, AlertCircle, Loader2 } from 'lucide-react';

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
}

interface Filters {
    job: string | null;
    location: string | null;
}

interface Stats {
    total_collected: number;
    sources: Record<string, number>;
    errors: { source: string; error: string }[];
}

interface Props {
    jobs: Job[];
    filters: Filters;
    stats: Stats;
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

export default function JobIndex({ jobs, filters, stats }: Props) {
    const [jobQuery, setJobQuery] = useState(filters.job || '');
    const [locationQuery, setLocationQuery] = useState(filters.location || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(
            '/jobs',
            {
                job: jobQuery || undefined,
                location: locationQuery || undefined,
            },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Head title="Job Listings — Sirthabet Talent Radar" />

            <Navbar />

            {/* Hero Search Section */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />

                <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
                                Find Your Next Opportunity
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Aggregating jobs from {Object.keys(stats.sources).length} sources in real-time.
                            {jobs.length > 0 && (
                                <span className="text-foreground font-semibold"> {jobs.length} jobs found.</span>
                            )}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
                        <div className="relative flex-1">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                id="search-job"
                                type="text"
                                placeholder="Job title or keyword..."
                                value={jobQuery}
                                onChange={(e) => setJobQuery(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="relative flex-1">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                id="search-location"
                                type="text"
                                placeholder="Location or 'remote'..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                        <button
                            id="search-submit"
                            type="submit"
                            disabled={isLoading}
                            className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                            Search
                        </button>
                    </form>

                    {/* Source Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {Object.entries(stats.sources).map(([source, count]) => (
                            <span
                                key={source}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${SOURCE_COLORS[source] || 'bg-muted text-muted-foreground border-border'}`}
                            >
                                {source.replace(/_/g, ' ')}
                                <span className="opacity-70">({count})</span>
                            </span>
                        ))}
                    </div>

                    {/* Errors */}
                    {stats.errors.length > 0 && (
                        <div className="mt-6 max-w-2xl mx-auto">
                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                                <div className="flex items-center gap-2 text-destructive mb-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Some sources had errors</span>
                                </div>
                                {stats.errors.map((err, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        <span className="font-medium">{err.source}:</span> {err.error}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Job Listings */}
            <section className="pb-24">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {jobs.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Try adjusting your search terms or location filter to discover more opportunities.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <a
                                    key={job.id}
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h2>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-3">
                                                {job.company && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Building2 className="h-3.5 w-3.5" />
                                                        {job.company}
                                                    </span>
                                                )}
                                                {job.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {job.location}
                                                    </span>
                                                )}
                                                {job.posted_at && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {timeAgo(job.posted_at)}
                                                    </span>
                                                )}
                                                {job.salary && (
                                                    <span className="font-medium text-emerald-500">
                                                        {job.salary}
                                                    </span>
                                                )}
                                            </div>

                                            {job.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {job.description.substring(0, 200)}
                                                    {job.description.length > 200 ? '...' : ''}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SOURCE_COLORS[job.source] || 'bg-muted text-muted-foreground border-border'}`}
                                                >
                                                    {job.source.replace(/_/g, ' ')}
                                                </span>
                                                {job.tags &&
                                                    job.tags.slice(0, 3).map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                                                        >
                                                            <Tag className="h-3 w-3" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
