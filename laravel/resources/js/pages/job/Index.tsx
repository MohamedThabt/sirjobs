import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import {
    MapPin, Briefcase, Clock, Building2,
    AlertCircle, Loader2, ArrowRight,
    SlidersHorizontal, X, Globe, LayoutGrid, List,
    ChevronDown, Tag, Database
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
    location: string | null;
    source: string[];
    time: string | null;
    role: string | null;
    tags: string[];
    remote: boolean;
}

interface FilterOptions {
    locations: string[];
    sources: string[];
    tags: string[];
}

interface Props {
    jobs: Job[];
    filters: Filters;
    filterOptions: FilterOptions;
}

const SOURCE_META: Record<string, { label: string; dot: string; bg: string }> = {
    adzuna:             { label: 'Adzuna',          dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
    remotive:           { label: 'Remotive',        dot: 'bg-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20' },
    reed_api:           { label: 'Reed API',        dot: 'bg-blue-500',    bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
    the_muse:           { label: 'The Muse',        dot: 'bg-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
    arbeitnow:          { label: 'Arbeitnow',       dot: 'bg-rose-500',    bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
    reed_rss:           { label: 'Reed RSS',        dot: 'bg-sky-500',     bg: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/20' },
    remoteok_rss:       { label: 'RemoteOK',        dot: 'bg-teal-500',    bg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' },
    working_nomads_rss: { label: 'Working Nomads',  dot: 'bg-orange-500',  bg: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
    serpapi_google_jobs: { label: 'Google Jobs',    dot: 'bg-red-500',     bg: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' },
    jobicy:             { label: 'Jobicy',          dot: 'bg-cyan-500',    bg: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20' },
    hacker_news:        { label: 'Hacker News',     dot: 'bg-orange-600',  bg: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
    linkedin:           { label: 'LinkedIn',        dot: 'bg-blue-600',    bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
    indeed:             { label: 'Indeed',           dot: 'bg-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
    glassdoor:          { label: 'Glassdoor',        dot: 'bg-green-500',   bg: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' },
    google:             { label: 'Google Jobs',      dot: 'bg-red-500',     bg: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' },
    zip_recruiter:      { label: 'ZipRecruiter',     dot: 'bg-lime-500',    bg: 'bg-lime-50 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-500/20' },
    bayt:               { label: 'Bayt',             dot: 'bg-purple-500',  bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
    wuzzuf:             { label: 'Wuzzuf',           dot: 'bg-pink-500',    bg: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/20' },
    akhtaboot:          { label: 'Akhtaboot',        dot: 'bg-yellow-500',  bg: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' },
    tanqeeb:            { label: 'Tanqeeb',          dot: 'bg-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20' },
    gulftalent:         { label: 'GulfTalent',       dot: 'bg-stone-500',   bg: 'bg-stone-50 dark:bg-stone-500/10 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-500/20' },
};

function getSourceLabel(key: string) {
    return SOURCE_META[key]?.label ?? key.replace(/_/g, ' ');
}
function getSourceDot(key: string) {
    return SOURCE_META[key]?.dot ?? 'bg-neutral-400';
}
function getSourceBg(key: string) {
    return SOURCE_META[key]?.bg ?? 'bg-muted text-muted-foreground border-border';
}

const TAG_COLORS = [
    'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/20',
    'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
    'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20',
    'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20',
];

const ROLE_OPTIONS = [
    'Backend',
    'Frontend',
    'Full Stack',
    'DevOps',
    'Data Science',
    'AI / Machine Learning',
    'Mobile',
    'Cloud',
    'Security',
    'QA / Testing',
    'Web Developer',
    'Software Engineer',
];

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

export default function JobIndex({ jobs, filters, filterOptions }: Props) {
    const [location,        setLocation]        = useState(filters.location ?? '');
    const [selectedSources, setSelectedSources] = useState<string[]>(filters.source ?? []);
    const [time,            setTime]            = useState(filters.time ?? '');
    const [role,            setRole]            = useState(filters.role ?? '');
    const [selectedTags,    setSelectedTags]    = useState<string[]>(filters.tags ?? []);
    const [isRemote,        setIsRemote]        = useState(filters.remote ?? false);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isLoading,         setIsLoading]         = useState(false);
    const [viewMode,          setViewMode]          = useState<'cards' | 'table'>('table');

    const toggleSource = (src: string) => {
        setSelectedSources(prev =>
            prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
        );
    };

    const addTag = (tag: string) => {
        if (!tag || selectedTags.includes(tag)) return;
        setSelectedTags(prev => [...prev, tag]);
    };

    const removeTag = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    const hasActiveFilters = !!location || selectedSources.length > 0 || !!time || !!role || selectedTags.length > 0 || isRemote;

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setShowMobileFilters(false);

        router.get('/jobs', {
            location:  location || undefined,
            source:    selectedSources.length > 0 ? selectedSources : undefined,
            time:      time || undefined,
            role:      role || undefined,
            tags:      selectedTags.length > 0 ? selectedTags : undefined,
            remote:    isRemote || undefined,
        } as any, {
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const clearFilters = () => {
        setLocation('');
        setSelectedSources([]);
        setTime('');
        setRole('');
        setSelectedTags([]);
        setIsRemote(false);
        router.get('/jobs', {}, { preserveState: false });
    };

    const FilterPanel = () => (
        <form onSubmit={applyFilters} className="flex flex-col gap-4">
            {/* Location */}
            <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
                    Location
                </label>
                <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                    <input
                        type="text"
                        list="location-options"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Type or select location..."
                        className="w-full h-9 pl-8 pr-3 text-[13px] rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
                    />
                    <datalist id="location-options">
                        {filterOptions.locations.slice(0, 100).map(loc => (
                            <option key={loc} value={loc} />
                        ))}
                    </datalist>
                </div>
            </div>

            {/* Source */}
            <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
                    Source
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-lg border border-border bg-background">
                    {filterOptions.sources.map(src => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => toggleSource(src)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                                selectedSources.includes(src)
                                    ? getSourceBg(src) + ' ring-1 ring-primary/30'
                                    : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/60'
                            }`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${getSourceDot(src)}`} />
                            {getSourceLabel(src)}
                        </button>
                    ))}
                    {filterOptions.sources.length === 0 && (
                        <span className="text-[11px] text-muted-foreground/40 p-1">No sources available</span>
                    )}
                </div>
            </div>

            {/* Time */}
            <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
                    Time
                </label>
                <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                    <select
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full h-9 pl-8 pr-7 text-[13px] rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Any time</option>
                        <option value="6h">Last 6 hours</option>
                        <option value="12h">Last 12 hours</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="2d">Last 2 days</option>
                        <option value="3d">Last 3 days</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                </div>
            </div>

            {/* Role */}
            <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
                    Role
                </label>
                <div className="relative">
                    <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full h-9 pl-8 pr-7 text-[13px] rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">All roles</option>
                        {ROLE_OPTIONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
                    Tags
                </label>
                <div className="flex flex-wrap items-center gap-1 p-1.5 min-h-[2.25rem] rounded-lg border border-border bg-background">
                    {selectedTags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive p-0.5 rounded">
                                <X className="h-2.5 w-2.5" />
                            </button>
                        </span>
                    ))}
                    <div className="relative flex-1 min-w-[120px]">
                        <select
                            value=""
                            onChange={e => addTag(e.target.value)}
                            className="w-full h-7 text-[12px] bg-transparent text-foreground focus:outline-none appearance-none cursor-pointer px-1"
                        >
                            <option value="">Add tag...</option>
                            {filterOptions.tags
                                .filter(t => !selectedTags.includes(t))
                                .slice(0, 50)
                                .map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Remote */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-2 text-[13px] font-medium text-foreground/80">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground/60" />
                    Remote only
                </div>
                <Switch
                    id="remote-mode"
                    checked={isRemote}
                    onCheckedChange={(v: boolean) => setIsRemote(v)}
                />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <Button type="submit" disabled={isLoading} className="w-full h-9 text-[13px] font-semibold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Filters'}
                </Button>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors text-center py-1"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-x-hidden">
            <Head title="Jobs — Sirthabet Talent Radar" />
            <Navbar />

            {/* Top bar */}
            <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-16 z-40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <h1 className="text-sm font-bold truncate tracking-tight">Job Board</h1>
                        {jobs.length > 0 && (
                            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground">
                                {jobs.length.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-muted/50 p-0.5 rounded-md hidden sm:flex items-center border border-border">
                            <button
                                type="button"
                                onClick={() => setViewMode('cards')}
                                className={`p-1.5 rounded transition-all ${viewMode === 'cards' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Card View"
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded transition-all ${viewMode === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Table View"
                            >
                                <List className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="md:hidden flex items-center gap-1.5 text-[13px] font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {showMobileFilters && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                    <div className="relative ml-auto w-80 max-w-full h-full bg-background border-l border-border shadow-2xl overflow-y-auto p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">Filters</span>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}

            {/* Body */}
            <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6 items-start">
                    {/* Feed */}
                    <div className="flex-1 min-w-0 order-1">

                        {/* Active filter chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {location && (
                                    <Chip label={location} dot="bg-blue-500" onRemove={() => setLocation('')} />
                                )}
                                {selectedSources.map(src => (
                                    <Chip
                                        key={src}
                                        label={getSourceLabel(src)}
                                        dot={getSourceDot(src)}
                                        onRemove={() => toggleSource(src)}
                                    />
                                ))}
                                {time && (
                                    <Chip label={`Last ${time}`} dot="bg-orange-500" onRemove={() => setTime('')} />
                                )}
                                {role && (
                                    <Chip label={role} dot="bg-indigo-500" onRemove={() => setRole('')} />
                                )}
                                {selectedTags.map(tag => (
                                    <Chip key={tag} label={tag} dot="bg-violet-500" onRemove={() => removeTag(tag)} />
                                ))}
                                {isRemote && (
                                    <Chip label="Remote only" dot="bg-teal-500" onRemove={() => setIsRemote(false)} />
                                )}
                            </div>
                        )}

                        {/* Empty state */}
                        {jobs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-border rounded-xl bg-card text-center px-6">
                                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                                    <Database className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h2 className="text-lg font-bold mb-2">No jobs found</h2>
                                <p className="text-muted-foreground text-[13px] max-w-xs">
                                    Try adjusting your filters or check back soon -- jobs are collected automatically every few hours.
                                </p>
                            </div>
                        ) : viewMode === 'cards' ? (
                            <div className="flex flex-col gap-2.5">
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <NotionTable jobs={jobs} />
                        )}
                    </div>

                    {/* Desktop Right Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0 sticky top-[7rem] self-start order-2">
                        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[13px] font-bold flex items-center gap-1.5">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Filters
                                </span>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <FilterPanel />
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Chip({ label, dot, onRemove }: { label: string; dot?: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 border border-border text-foreground/80">
            {dot && <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dot}`} />}
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="ml-0.5 hover:text-destructive transition-colors p-0.5 rounded hover:bg-destructive/10"
            >
                <X className="h-2.5 w-2.5" />
            </button>
        </span>
    );
}

function JobCard({ job }: { job: Job }) {
    const remote = isRemoteJob(job);

    return (
        <Link
            href={`/jobs/${job.id}`}
            className="group flex items-start gap-4 bg-card rounded-xl border border-border px-5 py-4 hover:border-foreground/15 hover:shadow-sm transition-all duration-150"
        >
            <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${getSourceDot(job.source)}`} />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                            {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[13px] text-muted-foreground">
                            {job.company && (
                                <span className="flex items-center gap-1 font-medium text-foreground/70">
                                    <Building2 className="h-3 w-3" />
                                    {job.company}
                                </span>
                            )}
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                </span>
                            )}
                            {remote && (
                                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                                    <Globe className="h-3 w-3" />
                                    Remote
                                </span>
                            )}
                            {job.posted_at && (
                                <span className="flex items-center gap-1 opacity-50">
                                    <Clock className="h-3 w-3" />
                                    {timeAgo(job.posted_at)}
                                </span>
                            )}
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all flex-shrink-0 mt-1" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-px rounded text-[10px] font-semibold border ${getSourceBg(job.source)}`}>
                        {getSourceLabel(job.source)}
                    </span>
                    {job.salary && (
                        <span className="inline-flex items-center px-1.5 py-px rounded text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                            {job.salary}
                        </span>
                    )}
                    {job.tags?.slice(0, 3).map((tag, i) => (
                        typeof tag === 'string' ? (
                            <span
                                key={i}
                                className={`inline-flex items-center px-1.5 py-px rounded text-[10px] font-medium border ${TAG_COLORS[i % TAG_COLORS.length]}`}
                            >
                                {tag}
                            </span>
                        ) : null
                    ))}
                </div>
            </div>
        </Link>
    );
}

function NotionTable({ jobs }: { jobs: Job[] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/15">
                <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
                    <List className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{jobs.length}</span>
                    <span>records</span>
                </div>
                <span className="text-[11px] text-muted-foreground/40 hidden sm:inline">
                    {Object.keys(SOURCE_META).length} sources connected
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse table-fixed">
                    <colgroup>
                        <col className="w-[40%]" />
                        <col className="w-[18%]" />
                        <col className="w-[14%]" />
                        <col className="w-[14%]" />
                        <col className="w-[9%]" />
                        <col className="w-[5%]" />
                    </colgroup>
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-4 py-2">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    Name
                                </span>
                            </th>
                            <th className="text-left px-3 py-2 hidden sm:table-cell">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    Company
                                </span>
                            </th>
                            <th className="text-left px-3 py-2 hidden md:table-cell">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    Location
                                </span>
                            </th>
                            <th className="text-left px-3 py-2 hidden lg:table-cell">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    Tags
                                </span>
                            </th>
                            <th className="text-left px-3 py-2">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    Source
                                </span>
                            </th>
                            <th className="text-right px-3 py-2 hidden xl:table-cell">
                                <span className="flex items-center justify-end gap-1.5 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    <Clock className="h-3 w-3" />
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => {
                            const remote = isRemoteJob(job);
                            return (
                                <tr
                                    key={job.id}
                                    onClick={() => router.visit(`/jobs/${job.id}`)}
                                    className="group cursor-pointer border-b border-border/40 hover:bg-primary/[0.03] transition-colors duration-75"
                                >
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${getSourceDot(job.source)} ring-2 ring-background`} />
                                            <div className="min-w-0 flex-1">
                                                <span className="font-medium text-foreground group-hover:text-primary transition-colors block truncate leading-tight">
                                                    {job.title}
                                                </span>
                                                {job.company && (
                                                    <span className="sm:hidden text-[11px] text-muted-foreground truncate block mt-0.5">
                                                        {job.company}
                                                    </span>
                                                )}
                                            </div>
                                            {job.salary && (
                                                <span className="hidden md:inline-flex flex-shrink-0 items-center px-1.5 py-px rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap">
                                                    {job.salary}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 hidden sm:table-cell">
                                        {job.company ? (
                                            <span className="text-muted-foreground truncate block">{job.company}</span>
                                        ) : (
                                            <span className="text-muted-foreground/20">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 hidden md:table-cell">
                                        {remote ? (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
                                                <Globe className="h-2.5 w-2.5" />
                                                Remote
                                            </span>
                                        ) : job.location ? (
                                            <span className="text-muted-foreground truncate block">{job.location}</span>
                                        ) : (
                                            <span className="text-muted-foreground/20">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 hidden lg:table-cell">
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {Array.isArray(job.tags) && job.tags.length > 0 ? (
                                                <>
                                                    {job.tags.slice(0, 2).map((tag, i) => (
                                                        typeof tag === 'string' ? (
                                                            <span key={i} className={`inline-flex px-1.5 py-px rounded text-[10px] font-semibold border whitespace-nowrap ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                                                                {tag}
                                                            </span>
                                                        ) : null
                                                    ))}
                                                    {job.tags.length > 2 && (
                                                        <span className="text-[10px] text-muted-foreground/40">+{job.tags.length - 2}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground/20">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap ${getSourceBg(job.source)}`}>
                                            {getSourceLabel(job.source)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right hidden xl:table-cell">
                                        <span className="text-[11px] text-muted-foreground/50 whitespace-nowrap">
                                            {job.posted_at ? timeAgo(job.posted_at) : '—'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center px-4 py-2 border-t border-border/50 bg-muted/10">
                <span className="text-[11px] text-muted-foreground/30">
                    {jobs.length} of {jobs.length} shown
                </span>
            </div>
        </div>
    );
}
