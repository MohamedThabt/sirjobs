import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ExternalLink, Database, Globe, Network, Rss } from 'lucide-react';

const SOURCES = [
  { 
    name: 'Adzuna',         
    logo: '/images/sources/adzuna.png',        
    url: 'https://www.adzuna.com',
    type: 'API Integration',
    icon: Database,
    description: 'A global search engine for job listings, pulling in millions of roles from across the world into one powerful feed.'
  },
  { 
    name: 'Remotive',       
    logo: '/images/sources/remotive.png',      
    url: 'https://remotive.com',
    type: 'API Integration',
    icon: Globe,
    description: 'A hand-curated community-driven board specializing strictly in the best remote tech and startup opportunities.'
  },
  { 
    name: 'Reed',           
    logo: '/images/sources/reed.png',          
    url: 'https://www.reed.co.uk',
    type: 'API/RSS Engine',
    icon: Network,
    description: 'The UK\'s premier destination for tech, finance, and engineering positions with highly detailed meta tagging.'
  },
  { 
    name: 'The Muse',       
    logo: '/images/sources/themuse.png',       
    url: 'https://www.themuse.com',
    type: 'API Integration',
    icon: Database,
    description: 'Focuses heavily on company culture, providing roles from top-tier modern companies and fast-growing startups.'
  },
  { 
    name: 'Arbeitnow',      
    logo: '/images/sources/arbeitnow.png',     
    url: 'https://www.arbeitnow.com',
    type: 'API Integration',
    icon: Globe,
    description: 'Dedicated to remote-first European and global positions with a focus on work-life balance transparency.'
  },
  { 
    name: 'RemoteOK',       
    logo: '/images/sources/remoteok.png',      
    url: 'https://remoteok.com',
    type: 'RSS Integration',
    icon: Rss,
    description: 'One of the most popular indie boards for digital nomads and globally distributed tech workers.'
  },
  { 
    name: 'Working Nomads', 
    logo: '/images/sources/workingnomads.png', 
    url: 'https://www.workingnomads.com',
    type: 'RSS Integration',
    icon: Rss,
    description: 'Curated lists of the most reliable remote roles across development, design, and management disciplines.'
  },
  { 
    name: 'Google Jobs',    
    logo: '/images/sources/google.png',        
    url: 'https://jobs.google.com',
    type: 'Scraper Endpoint',
    icon: Globe,
    description: 'Using specialized scraping logic to extract highly localized, hard-to-find corporate listings direct from Google.'
  },
  { 
    name: 'Jobicy',         
    logo: '/images/sources/jobicy.png',        
    url: 'https://jobicy.com',
    type: 'API Integration',
    icon: Database,
    description: 'A modern job board indexing verified remote teams primarily residing in North America and Europe.'
  },
  { 
    name: 'Hacker News',         
    logo: '/images/sources/hacker_news.png',        
    url: 'https://news.ycombinator.com/jobs',
    type: 'API Integration',
    icon: Database,
    description: 'Official Y Combinator job postings and highly technical roles straight from the Hacker News API.'
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      <Head title="Our Job Sources — Sirthabet Talent Radar" />
      
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide uppercase mb-6 border border-primary/20">
              <Network className="h-3.5 w-3.5" /> Data Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Our <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">Integrated Sources</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We securely pull live job data from the internet's most reputable platforms and niche remote communities so you only ever need to search one place.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOURCES.map((source, idx) => {
               const Icon = source.icon;
               return (
                 <a 
                   key={idx}
                   href={source.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group relative flex flex-col bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
                 >
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm border border-border/60">
                       <img 
                         src={source.logo} 
                         alt={`${source.name} logo`} 
                         className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-110"
                         loading="lazy"
                       />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h2 className="text-lg font-bold truncate text-foreground group-hover:text-primary transition-colors">
                         {source.name}
                       </h2>
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mt-0.5">
                         <Icon className="h-3 w-3" />
                         {source.type}
                       </div>
                     </div>
                   </div>
                   
                   <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                     {source.description}
                   </p>
                   
                   <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                     <span className="text-xs font-medium text-primary tracking-wide">
                       Visit Original Source
                     </span>
                     <ExternalLink className="h-4 w-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </div>
                 </a>
               );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
