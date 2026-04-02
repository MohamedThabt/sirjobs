import React from 'react';

const SOURCES = [
  // Original Integrations
  { name: 'Adzuna',         logo: '/images/sources/adzuna.png',        url: 'https://www.adzuna.com' },
  { name: 'Remotive',       logo: '/images/sources/remotive.png',      url: 'https://remotive.com' },
  { name: 'Reed',           logo: '/images/sources/reed.png',          url: 'https://www.reed.co.uk' },
  { name: 'The Muse',       logo: '/images/sources/themuse.png',       url: 'https://www.themuse.com' },
  { name: 'Arbeitnow',      logo: '/images/sources/arbeitnow.png',     url: 'https://www.arbeitnow.com' },
  { name: 'RemoteOK',       logo: '/images/sources/remoteok.png',      url: 'https://remoteok.com' },
  { name: 'Working Nomads', logo: '/images/sources/workingnomads.png', url: 'https://www.workingnomads.com' },
  { name: 'Jobicy',         logo: '/images/sources/jobicy.png',        url: 'https://jobicy.com' },
  { name: 'Hacker News',    logo: '/images/sources/hacker_news.png',   url: 'https://news.ycombinator.com/jobs' },
  
  // New Native Scraper & API Integrations
  { name: 'LinkedIn',     logo: '/images/sources/linkedin.png',        url: 'https://www.linkedin.com' },
  { name: 'Indeed',       logo: '/images/sources/indeed.svg',          url: 'https://www.indeed.com' },
  { name: 'Glassdoor',    logo: '/images/sources/glassdoor.png',       url: 'https://www.glassdoor.com' },
  { name: 'Google Jobs',  logo: '/images/sources/google.png',          url: 'https://jobs.google.com' },
  { name: 'ZipRecruiter', logo: '/images/sources/ziprecruiter.png',    url: 'https://www.ziprecruiter.com' },
  { name: 'Bayt',         logo: '/images/sources/bayt.png',            url: 'https://www.bayt.com' },
  { name: 'Wuzzuf',       logo: '/images/sources/wuzzuf.png',          url: 'https://wuzzuf.net' },
  { name: 'Forasna',      logo: '/images/sources/forasna.png',         url: 'https://forasna.com' },
  { name: 'Jobzella',     logo: '/images/sources/jobzella.svg',        url: 'https://www.jobzella.com' },
  { name: 'Akhtaboot',    logo: '/images/sources/akhtaboot.png',       url: 'https://www.akhtaboot.com' },
  { name: 'Tanqeeb',      logo: '/images/sources/tanqeeb.svg',         url: 'https://www.tanqeeb.com' },
  { name: 'GulfTalent',   logo: '/images/sources/gulftalent.png',      url: 'https://www.gulftalent.com' },
];

export function JobSourcesCloud() {
  return (
    <section className="py-16 border-b border-border/40">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-10">
          Trusted sources we aggregate from
        </p>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6 items-center justify-items-center">
          {SOURCES.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm border border-border/60 group-hover:shadow-md group-hover:border-border transition-all duration-300">
                <img 
                  src={source.logo} 
                  alt={`${source.name} logo`} 
                  className="w-7 h-7 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {source.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
