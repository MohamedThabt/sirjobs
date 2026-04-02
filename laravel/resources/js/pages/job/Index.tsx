import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import {
    Search, MapPin, Briefcase, Clock, Building2, Tag,
    AlertCircle, Loader2, RefreshCw, Wifi, ArrowRight,
    SlidersHorizontal, X, Globe, LayoutGrid, List
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
}

interface Filters {
    job: string | null;
    location: string | null;
    sources: string[];
    remote: boolean;
}

interface Stats {
    total_collected: number;
    sources: Record<string, number>;
    errors: { source: string; error: string }[];
}

interface Props {
    jobs: Job[];
    filters: Filters;
    availableSources: string[];
    stats: Stats | null;
}

/* ─── Source badge colours ─────────────────────────────────────────────── */
const SOURCE_META: Record<string, { label: string; dot: string }> = {
    adzuna:             { label: 'Adzuna',          dot: 'bg-emerald-500' },
    remotive:           { label: 'Remotive',         dot: 'bg-violet-500' },
    reed_api:           { label: 'Reed API',         dot: 'bg-blue-500' },
    the_muse:           { label: 'The Muse',         dot: 'bg-amber-500' },
    arbeitnow:          { label: 'Arbeitnow',        dot: 'bg-rose-500' },
    reed_rss:           { label: 'Reed RSS',         dot: 'bg-sky-500' },
    remoteok_rss:       { label: 'RemoteOK',         dot: 'bg-teal-500' },
    working_nomads_rss: { label: 'Working Nomads',   dot: 'bg-orange-500' },
    serpapi_google_jobs:{ label: 'Google Jobs',      dot: 'bg-red-500' },
    jobicy:             { label: 'Jobicy',            dot: 'bg-cyan-500' },
    hacker_news:        { label: 'Hacker News',      dot: 'bg-orange-600' },
};

function getSourceLabel(key: string) {
    return SOURCE_META[key]?.label ?? key.replace(/_/g, ' ');
}
function getSourceDot(key: string) {
    return SOURCE_META[key]?.dot ?? 'bg-neutral-400';
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function timeAgo(dateStr: string | null): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 1)  return 'Just now';
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d}d ago`;
    return `${Math.floor(d / 7)}w ago`;
}

const isRemoteJob = (job: Job) =>
    ['remote', 'worldwide', 'anywhere'].some(w =>
        job.location?.toLowerCase().includes(w) ||
        job.title?.toLowerCase().includes(w)
    );

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function JobIndex({ jobs, filters, availableSources, stats }: Props) {
    const [jobQuery,        setJobQuery]        = useState(filters.job      || '');
    const [locationQuery,   setLocationQuery]   = useState(filters.location || '');
    const [selectedSources, setSelectedSources] = useState<string[]>(filters.sources || []);
    const [isRemote,        setIsRemote]        = useState(filters.remote   || false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [isLoading,    setIsLoading]    = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewMode,     setViewMode]     = useState<'list' | 'database'>('list');

    /* ── actions ── */
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setShowMobileFilters(false);
        router.get('/jobs', {
            job:      jobQuery       || undefined,
            location: locationQuery  || undefined,
            sources:  selectedSources.length > 0 ? selectedSources.join(',') : undefined,
            remote:   isRemote       || undefined,
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.post('/jobs/refresh', {}, {
            onFinish: () => { setIsRefreshing(false); handleSearch(); }
        });
    };

    const toggleSource = (s: string) =>
        setSelectedSources(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );

    const clearFilters = () => {
        setJobQuery('');
        setLocationQuery('');
        setSelectedSources([]);
        setIsRemote(false);
        router.get('/jobs', {}, { preserveState: false });
    };

    const hasActiveFilters = jobQuery || locationQuery || selectedSources.length > 0 || isRemote;

    /* ─── Filter Panel (shared between desktop sidebar & mobile drawer) ─── */
    const FilterPanel = () => (
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {/* Keyword */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Keyword
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        id="search-job"
                        type="text"
                        placeholder="Title, role, skill…"
                        value={jobQuery}
                        onChange={e => setJobQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Location
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        id="search-location"
                        type="text"
                        placeholder="City or country…"
                        value={locationQuery}
                        onChange={e => setLocationQuery(e.target.value)}
                        disabled={isRemote}
                        className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Remote toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Remote only
                </div>
                <Switch
                    id="remote-mode"
                    checked={isRemote}
                    onCheckedChange={(v: boolean) => setIsRemote(v)}
                />
            </div>

            {/* Sources */}
            {availableSources.length > 0 && (
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Sources
                    </label>
                    <div className="flex flex-col gap-1.5">
                        {availableSources.map(src => (
                            <button
                                key={src}
                                type="button"
                                onClick={() => toggleSource(src)}
                                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                                    selectedSources.includes(src)
                                        ? 'border-foreground/20 bg-foreground text-background font-semibold'
                                        : 'border-transparent hover:border-border hover:bg-muted text-foreground'
                                }`}
                            >
                                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${getSourceDot(src)}`} />
                                {getSourceLabel(src)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Filters'}
                </Button>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        </form>
    );

    /* ─── Render ─────────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-x-hidden">
            <Head title="Jobs — Sirthabet Talent Radar" />
            <Navbar />

            {/* ── Page top bar ─────────────────────────────────────── */}
            <div className="border-b border-border bg-background sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Left: title + count */}
                    <div className="flex items-center gap-3 min-w-0">
                        <h1 className="text-base font-bold truncate">Job Board</h1>
                        {jobs.length > 0 && (
                            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                                {jobs.length.toLocaleString()} results
                            </span>
                        )}
                    </div>

                    {/* Centre: quick search pill (desktop) */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-lg items-center gap-2 bg-muted rounded-full px-4 py-2 border border-border"
                    >
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search jobs…"
                            value={jobQuery}
                            onChange={e => setJobQuery(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {jobQuery && (
                            <button type="button" onClick={() => setJobQuery('')}>
                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </form>

                    {/* Right: view toggle + sync + mobile filter toggle */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* View Mode Toggle (Desktop only) */}
                        <div className="bg-muted p-1 rounded-lg hidden sm:flex items-center gap-1 border border-border">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="List View"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('database')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'database' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Database View"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                        >
                            {isRefreshing
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <RefreshCw className="h-4 w-4" />
                            }
                            <span className="hidden sm:inline">Sync</span>
                        </button>

                        {/* Mobile filter toggle */}
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="md:hidden flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 h-2 w-2 rounded-full bg-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile filter drawer ──────────────────────────────── */}
            {showMobileFilters && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
                    <div className="relative ml-auto w-80 max-w-full h-full bg-background border-l border-border shadow-2xl overflow-y-auto p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-base">Filters</span>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}

            {/* ── Body ─────────────────────────────────────────────── */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8 items-start">

                    {/* ── Desktop Sidebar ────────────────────────────── */}
                    <aside className="hidden md:block w-64 flex-shrink-0 sticky top-[7.5rem] self-start">
                        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-sm font-bold flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters
                                </span>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* ── Feed ───────────────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Sync errors */}
                        {stats && stats.errors.length > 0 && (
                            <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-destructive mb-1">
                                        {stats.errors.length} source{stats.errors.length > 1 ? 's' : ''} failed during sync
                                    </p>
                                    {stats.errors.map((e, i) => (
                                        <p key={i} className="text-xs text-muted-foreground">
                                            <span className="font-medium capitalize">{e.source.replace(/_/g, ' ')}</span>: {e.error}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active filter chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {jobQuery && (
                                    <Chip label={`"${jobQuery}"`} onRemove={() => { setJobQuery(''); handleSearch(); }} />
                                )}
                                {locationQuery && !isRemote && (
                                    <Chip label={locationQuery} onRemove={() => { setLocationQuery(''); handleSearch(); }} />
                                )}
                                {isRemote && (
                                    <Chip label="Remote only" dot="bg-teal-500" onRemove={() => { setIsRemote(false); handleSearch(); }} />
                                )}
                                {selectedSources.map(s => (
                                    <Chip
                                        key={s}
                                        label={getSourceLabel(s)}
                                        dot={getSourceDot(s)}
                                        onRemove={() => { toggleSource(s); handleSearch(); }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {jobs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 border border-border rounded-2xl bg-card text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
                                    <Briefcase className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">No jobs found</h2>
                                <p className="text-muted-foreground text-sm max-w-xs mb-6">
                                    Try a different keyword, location, or run a fresh sync to pull in the latest listings.
                                </p>
                                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="rounded-full gap-2">
                                    {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    Sync latest jobs
                                </Button>
                            </div>
                        ) : viewMode === 'list' ? (
                            <div className="flex flex-col gap-3">
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <JobTable jobs={jobs} />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function Chip({ label, dot, onRemove }: { label: string; dot?: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full text-xs font-medium bg-foreground/5 border border-border text-foreground">
            {dot && <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dot}`} />}
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="ml-0.5 hover:text-destructive transition-colors"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

function JobCard({ job }: { job: { id: number; source: string; title: string; company: string | null; location: string | null; salary: string | null; tags: string[] | null; posted_at: string | null; } }) {
    const remote = ['remote', 'worldwide', 'anywhere'].some(w =>
        job.location?.toLowerCase().includes(w) || job.title?.toLowerCase().includes(w)
    );

    return (
        <Link
            href={`/jobs/${job.id}`}
            className="group flex items-start gap-5 bg-card rounded-2xl border border-border px-6 py-5 hover:border-foreground/20 hover:shadow-md transition-all duration-200"
        >
            {/* Source dot */}
            <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${getSourceDot(job.source)}`} />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-foreground group-hover:text-foreground/80 transition-colors leading-snug truncate">
                            {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                            {job.company && (
                                <span className="flex items-center gap-1 font-medium text-foreground/70">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {job.company}
                                </span>
                            )}
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {job.location}
                                </span>
                            )}
                            {remote && (
                                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                                    <Wifi className="h-3.5 w-3.5" />
                                    Remote
                                </span>
                            )}
                            {job.posted_at && (
                                <span className="flex items-center gap-1 opacity-60">
                                    <Clock className="h-3.5 w-3.5" />
                                    {timeAgo(job.posted_at)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Arrow on hover */}
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all flex-shrink-0 mt-0.5" />
                </div>

                {/* Bottom tags row */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Source badge */}
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                        <span className={`h-1.5 w-1.5 rounded-full ${getSourceDot(job.source)}`} />
                        {getSourceLabel(job.source)}
                    </span>

                    {/* Salary */}
                    {job.salary && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                            {job.salary}
                        </span>
                    )}

                    {/* Tags */}
                    {job.tags?.slice(0, 3).map((tag, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border"
                        >
                            <Tag className="h-2.5 w-2.5 opacity-50" />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

function JobTable({ jobs }: { jobs: Job[] }) {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-muted/40 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-5 py-3 whitespace-nowrap">Job Title</th>
                            <th className="px-5 py-3 whitespace-nowrap">Company</th>
                            <th className="px-5 py-3 whitespace-nowrap">Location</th>
                            <th className="px-5 py-3 whitespace-nowrap hidden lg:table-cell">Salary</th>
                            <th className="px-5 py-3 whitespace-nowrap text-right">Posted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {jobs.map(job => {
                            const remote = ['remote', 'worldwide', 'anywhere'].some(w =>
                                job.location?.toLowerCase().includes(w) || job.title?.toLowerCase().includes(w)
                            );
                            return (
                                <tr key={job.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-5 py-3.5 max-w-[280px]">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${getSourceDot(job.source)}`} />
                                            <Link href={`/jobs/${job.id}`} className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                                {job.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-muted-foreground max-w-[200px] truncate">
                                        {job.company ? (
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5 opacity-60" />
                                                <span className="truncate">{job.company}</span>
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-5 py-3.5 max-w-[200px] truncate">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate">{job.location || '-'}</span>
                                            {remote && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 font-bold tracking-wider uppercase flex-shrink-0">Remote</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 hidden lg:table-cell">
                                        {job.salary ? (
                                            <span className="px-2 py-0.5 rounded textxs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap">
                                                {job.salary}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground opacity-50">-</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5 text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
                                            <Clock className="h-3.5 w-3.5 hidden sm:block" />
                                            {job.posted_at ? timeAgo(job.posted_at) : '-'}
                                            <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
