import { Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: "Mohamed Thabet",
    title: "Founder & Lead Engineer",
    imageUrl: "/images/team/mohamed_thabet.jpg",
    xLink: "https://x.com/SirThabet",
    xHandle: "@SirThabet",
  },
  {
    name: "Claude",
    title: "AI Co-Founder & Assistant",
    imageUrl: "/images/team/claude.png",
  },
];

const Team = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="mx-auto max-w-xl text-center">
        <b className="text-center font-bold tracking-widest text-primary text-xs uppercase">
          The Minds Behind It
        </b>
        <h2 className="mt-3 font-extrabold text-3xl tracking-tight sm:text-4xl text-foreground">
          Meet Our Team
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          We are dedicated to building smart tools that empower developers and aggregate the best tech jobs.
        </p>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-2xl grid-cols-1 gap-12 sm:grid-cols-2 text-center">
        {teamMembers.map((member) => (
          <div className="flex flex-col items-center text-center group" key={member.name}>
            <div className="relative overflow-hidden rounded-full h-32 w-32 border-4 border-muted shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md">
                <img
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 bg-muted"
                    src={member.imageUrl}
                />
            </div>
            <h3 className="mt-6 font-bold text-xl text-foreground">{member.name}</h3>
            <p className="text-muted-foreground mt-1.5 font-medium text-sm">{member.title}</p>
            {member.xLink && (
              <a
                href={member.xLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border"
              >
                <Twitter className="h-3.5 w-3.5" />
                {member.xHandle}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
