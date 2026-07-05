export type BlogSectionBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] };

export type BlogSection = {
  heading?: string;
  /** Simple paragraph-only sections */
  paragraphs?: string[];
  /** Mixed paragraphs and bullet lists */
  blocks?: BlogSectionBlock[];
};

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  excerpt: string;
  heroImage?: {
    src: string;
    alt: string;
    /** Portrait images float beside text; landscape images display full width above. */
    orientation?: "portrait" | "landscape";
  };
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-often-should-a-house-be-professionally-cleaned",
    title: "How Often Should a House Be Professionally Cleaned?",
    author: "Jasmin Heart",
    authorRole: "Co-Founder of Golden Hour Cleaning Co.",
    publishedAt: "2026-07-05",
    excerpt:
      "Weekly, bi-weekly, monthly, or one-time? A practical guide to choosing the right professional cleaning schedule for your Portland-area home.",
    heroImage: {
      src: "/assets/cleaning-schedule.png",
      alt: "Clock and calendar on a kitchen counter in a bright, clean home",
      orientation: "landscape",
    },
    sections: [
      {
        paragraphs: [
          "One of the questions we hear most often is:",
          "\"How often should I have my home professionally cleaned?\"",
          "The answer is... it depends.",
          "Every household is different. A retired couple with no pets has very different cleaning needs than a family with three kids and two dogs.",
          "The good news is that there isn't one \"correct\" schedule. The best cleaning frequency is the one that helps your home stay comfortable without adding unnecessary stress to your life.",
          "Here are the schedules we most commonly recommend.",
        ],
      },
      {
        heading: "Weekly Cleaning",
        blocks: [
          { type: "paragraph", text: "Best for:" },
          {
            type: "bullets",
            items: [
              "Busy families",
              "Homes with children",
              "Pet owners",
              "People who work long hours",
              "Anyone who simply loves a consistently clean home",
            ],
          },
          {
            type: "paragraph",
            text: "Weekly cleaning keeps dirt, dust, pet hair, and bathroom buildup from accumulating. Instead of spending your weekends catching up on chores, you can enjoy coming home to a space that's already been taken care of.",
          },
          {
            type: "paragraph",
            text: "Many of our weekly clients tell us they no longer feel like they're constantly \"behind\" on housework.",
          },
        ],
      },
      {
        heading: "Bi-Weekly Cleaning",
        paragraphs: [
          "Our Most Popular Option",
          "For many homeowners, every two weeks is the perfect balance.",
          "It keeps kitchens and bathrooms looking great, prevents dust from building up, and significantly reduces the amount of cleaning you have to do yourself between visits.",
          "If someone asks us for a recommendation without giving much background, bi-weekly cleaning is usually where we start.",
          "It offers excellent value while keeping most homes consistently clean.",
        ],
      },
      {
        heading: "Monthly Cleaning",
        blocks: [
          { type: "paragraph", text: "Best for:" },
          {
            type: "bullets",
            items: [
              "Smaller households",
              "Individuals who enjoy light cleaning between visits",
              "People looking for a helping hand rather than full maintenance",
            ],
          },
          {
            type: "paragraph",
            text: "Monthly cleaning gives your home a regular refresh while allowing you to handle day-to-day tidying on your own.",
          },
          {
            type: "paragraph",
            text: "Many homeowners use monthly service to take care of the more time-consuming tasks that tend to get pushed aside during busy weeks.",
          },
        ],
      },
      {
        heading: "One-Time Deep Cleaning",
        paragraphs: [
          "Sometimes recurring service isn't what you need.",
          "Maybe you're preparing for guests.",
          "Maybe life has gotten busy and you'd like a fresh start.",
          "Or maybe you're thinking about beginning recurring cleaning and want to reset your home first.",
          "A professional deep cleaning tackles the areas that often get overlooked during routine cleaning and leaves your home ready for easier maintenance moving forward.",
          "Many of our recurring clients begin with a deep clean before transitioning to standard maintenance cleanings.",
        ],
      },
      {
        heading: "Move-In & Move-Out Cleaning",
        paragraphs: [
          "If you're moving, professional cleaning can take one major task off your plate.",
          "Whether you're preparing your home for its next owner or moving into a new space, a detailed move-in or move-out cleaning helps create a fresh start.",
          "Moving is stressful enough—cleaning doesn't have to be.",
        ],
      },
      {
        heading: "How to Know It's Time for Professional Cleaning",
        blocks: [
          {
            type: "paragraph",
            text: "If you've been asking yourself whether it's worth hiring a cleaning service, here are a few signs it might be time:",
          },
          {
            type: "bullets",
            items: [
              "You spend your weekends catching up on cleaning.",
              "You constantly feel like you're behind.",
              "Dust returns almost as quickly as you clean it.",
              "Bathrooms and kitchens take longer than you'd like.",
              "You'd rather spend your free time doing something else.",
              "Cleaning has become a source of stress instead of satisfaction.",
            ],
          },
          {
            type: "paragraph",
            text: "You don't have to wait until your home feels overwhelming before asking for help.",
          },
          {
            type: "paragraph",
            text: "Sometimes the biggest benefit of professional cleaning is simply getting your time back.",
          },
        ],
      },
      {
        heading: "What I've Learned Since Starting Golden Hour",
        paragraphs: [
          "Before owning a cleaning company, I assumed people hired cleaners because they didn't like cleaning.",
          "Now I know that's rarely the whole story.",
          "Most of our clients are capable of cleaning their own homes.",
          "They're just busy living their lives.",
          "They're raising families.",
          "Building careers.",
          "Taking care of aging parents.",
          "Recovering from illness.",
          "Or simply trying to protect a little more of their free time.",
          "Hiring a cleaning service isn't about avoiding responsibility.",
          "For many people, it's about making room for the things that matter most.",
        ],
      },
      {
        heading: "There's No One-Size-Fits-All Schedule",
        paragraphs: [
          "The best cleaning schedule is the one that fits your home, your lifestyle, and your priorities.",
          "Some families love the consistency of weekly service.",
          "Others find that every two weeks is perfect.",
          "Some only call us a few times each year for a deep clean.",
          "Whatever your needs, the goal is the same:",
          "To create a home that feels peaceful, welcoming, and easy to enjoy.",
        ],
      },
      {
        heading: "We'd Love to Help",
        paragraphs: [
          "If you're not sure which cleaning schedule is right for your home, we're happy to help.",
          "At Golden Hour Cleaning Co., we provide recurring cleaning, deep cleaning, move-in and move-out cleaning, and one-time services throughout the Portland metro area.",
          "You can receive an instant quote and book online in just a few minutes, or give us a call if you'd prefer to talk through your options with one of our team members.",
        ],
      },
    ],
  },
  {
    slug: "why-cheap-cleaning-quotes-often-cost-more",
    title: "Why Cheap Cleaning Quotes Often Cost More",
    author: "Jasmin Heart",
    authorRole: "Co-Founder of Golden Hour Cleaning Co.",
    publishedAt: "2026-06-18",
    excerpt:
      "The cheapest quote isn't always the best value. What to look for beyond price when choosing a professional cleaning company in Portland.",
    heroImage: {
      src: "/assets/kelsey-baseboards.png",
      alt: "Kelsey Collins carefully cleaning baseboards during a professional home cleaning",
      orientation: "portrait",
    },
    sections: [
      {
        paragraphs: [
          "When someone requests a cleaning quote, one of the first questions they naturally ask is:",
          "\"How much does it cost?\"",
          "It's an important question.",
          "Everyone has a budget, and nobody wants to overpay.",
          "But after helping hundreds of homeowners throughout the Portland area, I've learned something interesting:",
          "The cheapest quote is often the most expensive one in the long run.",
        ],
      },
      {
        heading: "It's Not Really About Price",
        paragraphs: [
          "When comparing cleaning companies, it's easy to look at two numbers.",
          "Company A charges $250.",
          "Company B charges $375.",
          "At first glance, the cheaper option seems like the obvious choice.",
          "But the real question isn't:",
          "\"Which company costs less?\"",
          "It's:",
          "\"What experience am I actually paying for?\"",
        ],
      },
      {
        heading: "Not All Cleaning Services Are Equal",
        paragraphs: [
          "Professional cleaning isn't a commodity.",
          "Every company has different standards, training, communication, products, and attention to detail.",
          "Some companies rush from house to house, trying to fit as many appointments into a day as possible.",
          "Others take the time to clean thoroughly, communicate well, and ensure clients are genuinely happy with the results.",
          "Those differences aren't always obvious from the quote alone.",
        ],
      },
      {
        heading: "The Hidden Costs of a Cheap Cleaning",
        paragraphs: [
          "A low price can sometimes come with hidden tradeoffs.",
          "For example:",
          "Corners get skipped to save time.",
          "Communication is inconsistent.",
          "Cleaners arrive late—or not at all.",
          "Different people show up every visit with little consistency.",
          "Problems are difficult to resolve.",
          "You end up hiring another company to fix what wasn't done the first time.",
          "At that point, the \"cheap\" cleaning wasn't really cheap anymore.",
        ],
      },
      {
        heading: "We've Learned This From Experience",
        paragraphs: [
          "As business owners, Kelsey and I are constantly evaluating our pricing.",
          "Could we charge less?",
          "Probably.",
          "But we'd have to give something up.",
          "We'd have to rush through homes.",
          "Spend less time communicating with clients.",
          "Invest less in hiring great people.",
          "Cut back on the systems that keep everything organized.",
          "That's simply not the kind of company we want to build.",
          "We believe our clients deserve better.",
        ],
      },
      {
        heading: "You're Not Just Paying for Someone to Clean",
        paragraphs: [
          "When you hire a professional cleaning company, you're investing in much more than sparkling countertops.",
          "You're investing in reliability.",
          "You're investing in trust.",
          "You're investing in knowing someone will show up when they say they will.",
          "You're investing in clear communication if something changes.",
          "You're investing in a company that stands behind its work.",
          "Those things may not appear on an invoice, but they make all the difference.",
        ],
      },
      {
        heading: "What We Believe at Golden Hour",
        paragraphs: [
          "One of the things I've come to appreciate most since starting Golden Hour Cleaning Co. is that people aren't just inviting us into their homes.",
          "They're placing their trust in us.",
          "That's something we never take lightly.",
          "Whether we're cleaning a family's home every other week, preparing a property for new owners, or helping someone through an overwhelming season of life, our goal is always the same:",
          "To leave the home better than we found it—and to make the experience feel easy from beginning to end.",
        ],
      },
      {
        heading: "Choosing a Cleaning Company",
        paragraphs: [
          "If you're comparing quotes, here's my advice:",
          "Don't just ask, \"Who's the cheapest?\"",
          "Ask questions like:",
          "How do they communicate with clients?",
          "Are they licensed and insured?",
          "What happens if I'm not happy with the cleaning?",
          "Do they have consistent reviews?",
          "Do they take pride in their work?",
          "Do I feel comfortable inviting them into my home?",
          "Those answers often tell you far more than the price alone.",
        ],
      },
      {
        heading: "The Value of Peace of Mind",
        paragraphs: [
          "Everyone deserves fair pricing.",
          "But in our experience, the best value isn't always the lowest number.",
          "It's working with a company you can rely on—one that respects your home, communicates well, and consistently delivers the level of service you expect.",
          "At Golden Hour Cleaning Co., that's the standard we strive for every single day.",
        ],
      },
    ],
  },
  {
    slug: "ultimate-portland-move-out-cleaning-checklist",
    title: "Ultimate Portland Move-Out Cleaning Checklist",
    author: "Jasmin Heart",
    authorRole: "Co-Founder of Golden Hour Cleaning Co.",
    publishedAt: "2026-06-11",
    excerpt:
      "A room-by-room move-out cleaning checklist for Portland renters, homeowners, and landlords — plus the details landlords notice most during final walkthroughs.",
    heroImage: {
      src: "/assets/move-out-clean.png",
      alt: "Golden Hour cleaner wiping inside an empty kitchen cabinet during a move-out cleaning",
      orientation: "landscape",
    },
    sections: [
      {
        paragraphs: [
          "Moving is stressful enough without worrying about whether your old home will pass a final inspection. Whether you're a renter hoping to get your security deposit back, a homeowner preparing to sell, or a landlord getting ready for the next tenant, a thorough move-out cleaning can make all the difference.",
          "At Golden Hour Cleaning Co., we've cleaned countless move-outs throughout the Portland metro area, and we've learned exactly what property managers, landlords, and buyers notice most. Use this comprehensive checklist to make sure nothing gets overlooked.",
        ],
      },
      {
        heading: "Why Move-Out Cleaning Matters",
        blocks: [
          {
            type: "paragraph",
            text: "A professionally cleaned home can help:",
          },
          {
            type: "bullets",
            items: [
              "Maximize your chances of receiving your full security deposit",
              "Make your home more attractive to buyers",
              "Prepare the property for professional photos",
              "Leave a positive impression for the next occupants",
              "Reduce delays during inspections",
            ],
          },
          {
            type: "paragraph",
            text: "Many landlords expect the home to be returned in the same level of cleanliness as when you moved in, aside from normal wear and tear.",
          },
        ],
      },
      {
        heading: "Before You Start",
        blocks: [
          {
            type: "paragraph",
            text: "Before you begin cleaning:",
          },
          {
            type: "bullets",
            items: [
              "Remove all personal belongings.",
              "Empty every cabinet and drawer.",
              "Disconnect appliances if necessary.",
              "Patch small nail holes (if required by your lease).",
              "Replace burnt-out light bulbs.",
              "Gather all cleaning supplies and equipment.",
            ],
          },
          {
            type: "paragraph",
            text: "Cleaning is much easier once the home is completely empty.",
          },
        ],
      },
      {
        heading: "Kitchen Checklist",
        blocks: [
          {
            type: "paragraph",
            text: "The kitchen typically requires the most attention during a move-out clean.",
          },
          { type: "paragraph", text: "Appliances" },
          {
            type: "bullets",
            items: [
              "Clean inside and outside of the oven",
              "Clean stovetop and burner grates",
              "Wipe range hood",
              "Degrease backsplash",
              "Clean microwave inside and out",
              "Clean refrigerator (inside and outside if included)",
              "Clean freezer",
              "Wipe dishwasher inside and outside",
              "Polish stainless steel surfaces",
            ],
          },
          { type: "paragraph", text: "Cabinets & Drawers" },
          {
            type: "bullets",
            items: [
              "Empty completely",
              "Vacuum crumbs",
              "Wipe shelves",
              "Clean drawer tracks",
              "Remove grease buildup from cabinet fronts",
            ],
          },
          { type: "paragraph", text: "Countertops & Sink" },
          {
            type: "bullets",
            items: [
              "Sanitize countertops",
              "Clean sink basin",
              "Polish faucet",
              "Remove hard water spots",
              "Clean garbage disposal splash guard",
              "Wipe windowsill above sink",
            ],
          },
          { type: "paragraph", text: "Floors" },
          {
            type: "bullets",
            items: [
              "Vacuum thoroughly",
              "Mop corners and edges",
              "Remove sticky residue",
              "Clean underneath movable appliances",
            ],
          },
        ],
      },
      {
        heading: "Bathrooms",
        blocks: [
          {
            type: "paragraph",
            text: "Bathrooms are another area that landlords inspect closely.",
          },
          { type: "paragraph", text: "Shower & Tub" },
          {
            type: "bullets",
            items: [
              "Remove soap scum",
              "Remove hard water buildup",
              "Clean shower doors",
              "Scrub grout",
              "Clean shower fixtures",
            ],
          },
          { type: "paragraph", text: "Toilet" },
          {
            type: "bullets",
            items: [
              "Clean inside bowl",
              "Clean under rim",
              "Wipe tank",
              "Sanitize exterior",
              "Clean around base",
            ],
          },
          { type: "paragraph", text: "Vanity" },
          {
            type: "bullets",
            items: [
              "Wipe cabinets",
              "Clean drawers",
              "Sanitize countertops",
              "Polish faucet",
              "Clean sink",
            ],
          },
          { type: "paragraph", text: "Mirrors" },
          {
            type: "bullets",
            items: [
              "Clean streak-free",
              "Remove toothpaste splatter",
            ],
          },
          { type: "paragraph", text: "Floors" },
          {
            type: "bullets",
            items: [
              "Vacuum",
              "Mop thoroughly",
              "Clean behind toilet",
            ],
          },
        ],
      },
      {
        heading: "Bedrooms",
        blocks: [
          {
            type: "bullets",
            items: [
              "Dust ceiling corners",
              "Remove cobwebs",
              "Dust baseboards",
              "Wipe doors",
              "Clean door frames",
              "Clean closet shelves",
              "Vacuum closets",
              "Clean window tracks",
              "Vacuum carpets",
              "Mop hard floors",
            ],
          },
        ],
      },
      {
        heading: "Living Areas",
        blocks: [
          {
            type: "bullets",
            items: [
              "Dust all surfaces",
              "Wipe light switches",
              "Clean outlet covers",
              "Dust blinds",
              "Wipe windowsills",
              "Vacuum vents",
              "Dust ceiling fans",
              "Remove cobwebs",
              "Clean baseboards",
              "Vacuum or mop floors",
            ],
          },
        ],
      },
      {
        heading: "Laundry Room",
        blocks: [
          {
            type: "bullets",
            items: [
              "Wipe washer exterior",
              "Wipe dryer exterior",
              "Remove lint",
              "Sweep behind appliances if accessible",
              "Mop floor",
              "Dust shelves",
            ],
          },
        ],
      },
      {
        heading: "Doors & Trim",
        blocks: [
          {
            type: "paragraph",
            text: "Throughout the home:",
          },
          {
            type: "bullets",
            items: [
              "Wipe doors",
              "Clean door frames",
              "Clean handles",
              "Dust trim",
              "Remove fingerprints",
            ],
          },
        ],
      },
      {
        heading: "Windows",
        blocks: [
          {
            type: "paragraph",
            text: "Unless specifically required by your lease:",
          },
          {
            type: "bullets",
            items: [
              "Clean interior glass",
              "Wipe window sills",
              "Vacuum window tracks",
              "Dust blinds",
            ],
          },
          {
            type: "paragraph",
            text: "Exterior window cleaning is usually a separate service.",
          },
        ],
      },
      {
        heading: "Floors",
        blocks: [
          {
            type: "paragraph",
            text: "Every floor should receive attention.",
          },
          { type: "paragraph", text: "Carpet" },
          {
            type: "bullets",
            items: [
              "Vacuum thoroughly",
              "Spot clean stains when possible",
            ],
          },
          {
            type: "paragraph",
            text: "Some landlords require professional carpet cleaning, so check your lease.",
          },
          { type: "paragraph", text: "Hard Floors" },
          {
            type: "bullets",
            items: [
              "Sweep",
              "Vacuum edges",
              "Mop",
              "Remove scuff marks",
            ],
          },
        ],
      },
      {
        heading: "Don't Forget These Often-Missed Areas",
        blocks: [
          {
            type: "paragraph",
            text: "Many people forget these during a move-out:",
          },
          {
            type: "bullets",
            items: [
              "Inside closets",
              "Pantry shelves",
              "Light fixtures",
              "Ceiling fan blades",
              "Air vents",
              "Baseboards",
              "Window tracks",
              "Door frames",
              "Light switches",
              "Outlet covers",
              "Under sinks",
              "Behind toilets",
              "Top of refrigerator",
              "Cabinet tops",
              "Garage (if applicable)",
            ],
          },
          {
            type: "paragraph",
            text: "These details can make the difference between an average clean and an exceptional one.",
          },
        ],
      },
      {
        heading: "Should You Hire a Professional?",
        paragraphs: [
          "Move-out cleaning is one of the most detailed cleaning services because the goal is to leave the home as close to move-in condition as possible.",
          "Hiring professionals can save hours of work, reduce stress during an already busy move, and help ensure the property is ready for inspection.",
        ],
      },
      {
        heading: "Serving the Portland Metro Area",
        paragraphs: [
          "Golden Hour Cleaning Co. provides detailed move-out cleaning throughout the Portland metro area, including Beaverton, Hillsboro, Tigard, Lake Oswego, West Linn, Sherwood, Tualatin, Oregon City, and surrounding communities.",
          "If you're preparing for a move, we'd love to help make the process a little easier. Our experienced team focuses on the details that matter most, so you can spend less time scrubbing and more time settling into your next home.",
        ],
      },
    ],
  },
  {
    slug: "i-never-thought-id-own-a-cleaning-company",
    title: "I Never Thought I'd Own a Cleaning Company",
    author: "Jasmin Heart",
    authorRole: "Co-Founder of Golden Hour Cleaning Co.",
    publishedAt: "2026-06-04",
    excerpt:
      "From software engineering to co-founding Golden Hour Cleaning Co.—why this unexpected chapter has become the most meaningful work of my life.",
    heroImage: {
      src: "/assets/me-blogging.png",
      alt: "Jasmin Heart writing in a journal at home with Golden Hour Cleaning Co. supplies nearby",
      orientation: "landscape",
    },
    sections: [
      {
        paragraphs: [
          "If you had told me five years ago that I'd own a cleaning company, I would have thought you were joking.",
          "I spent most of my career behind a desk.",
          "I worked in software engineering, building systems, writing code, and solving technical problems. I assumed I'd spend the rest of my working life in front of a computer.",
          "Cleaning wasn't even on my radar.",
          "Today, I spend my days talking with homeowners, helping build a business with my partner Kelsey, improving our systems behind the scenes, and oftentimes putting on gloves and cleaning homes myself.",
          "I never expected this chapter of my life.",
          "And honestly, I wouldn't trade it.",
        ],
      },
      {
        heading: "I Had No Idea How Meaningful Cleaning Could Be",
        paragraphs: [
          "Before starting Golden Hour Cleaning Co., I viewed cleaning as something people simply... did.",
          "It was another chore.",
          "Something to cross off a list.",
          "I never realized how deeply connected a person's home can be to their mental and emotional well-being.",
          "I've come to realize that when someone reaches out to us, they're rarely asking for \"just a cleaning.\"",
          "More often, they're looking for a fresh start, a little breathing room, or one less thing to worry about.",
          "They're busy.",
          "They're exhausted.",
          "They're raising families, working long hours, navigating health challenges, or simply trying to catch up after life has become overwhelming.",
          "I've learned that we're not just cleaning houses. We're helping people breathe a little easier.",
        ],
      },
      {
        heading: "The Client I'll Never Forget",
        paragraphs: [
          "There is one client I'll probably remember for the rest of my life.",
          "She had been living in a hoarding situation while struggling with her mental health. There were piles of belongings, trash throughout the home, and it had become almost impossible for her to see a path forward.",
          "When we first met her, she was in tears.",
          "Not because she was embarrassed.",
          "Because someone had finally shown up to help.",
          "Over the next several hours, we worked to clear the space, clean the home, and give her a fresh start.",
          "When we finished, she stood there looking around her home and said she felt like she could finally breathe again.",
          "I don't think I'll ever forget that moment.",
          "It completely changed the way I think about this work.",
        ],
      },
      {
        heading: "People Sometimes Look Down on Cleaning",
        paragraphs: [
          "I'll admit something.",
          "Before this business, I probably carried some of those assumptions myself.",
          "Society often treats cleaning like it's \"less than.\"",
          "Like it's work people settle for instead of aspire to.",
          "I don't see it that way anymore.",
          "Every day I get to help families come home to a clean space after a long week.",
          "I get to help someone who's moving into a new home start with a clean slate.",
          "Sometimes we help someone through one of the most stressful seasons of their life.",
          "That's meaningful work.",
          "There is real dignity in caring for other people's homes.",
        ],
      },
      {
        heading: "Every Day Is an Opportunity to Get Better",
        paragraphs: [
          "Owning a business has humbled me.",
          "I'm learning every single day.",
          "How to communicate better.",
          "How to solve problems.",
          "How to hire great people.",
          "How to create an experience that leaves clients feeling genuinely cared for.",
          "I don't believe customer service ends when the cleaning is finished.",
          "It starts the moment someone visits our website or sends us a message.",
          "Every email.",
          "Every phone call.",
          "Every quote.",
          "Every follow-up.",
          "Those moments matter just as much as sparkling countertops.",
        ],
      },
      {
        heading: "This Work Has Changed Me",
        paragraphs: [
          "I never thought I'd own a cleaning company.",
          "Now I can't imagine doing anything else.",
          "Not because I fell in love with mopping floors.",
          "Because I fell in love with helping people.",
          "Helping someone feel less overwhelmed.",
          "Helping someone reclaim their home.",
          "Helping our cleaners build meaningful work.",
          "Helping our clients create more time for the people and things they love.",
          "That's what Golden Hour has become for me.",
          "And I feel incredibly grateful that I get to build it every day.",
        ],
      },
    ],
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatBlogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
