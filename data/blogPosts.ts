// data/blogPosts.ts
// ─────────────────────────────────────────────────────────────────────────────
// Static blog post data. To migrate to a CMS:
//   1. Replace this file's export with a fetch() to your CMS API
//   2. Keep the BlogPost interface identical — no component changes needed
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogSection {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug:        string;
  title:       string;
  subtitle:    string;
  category:    string;
  readTime:    string;
  date:        string;
  intro:       string;
  sections:    BlogSection[];
  cta?: {
    label: string;
    href:  string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug:     'deuce-modes-explained',
    title:    'Long Deuce, Silver Point, Golden Point — and the new Star Point',
    subtitle: 'Every deuce variation explained, with advice on which to play and when.',
    category: 'Rules',
    readTime: '5 min read',
    date:     '11 Apr 2026',
    intro:
      'When a padel game reaches 40-40, the fun begins. How you resolve that tie defines the rhythm, tension, and fairness of the match. There are now four recognised deuce formats in competitive and social play — here\'s what each one means and how to choose.',

    sections: [
      {
        heading: 'Long Deuce — the classic',
        body: 'Long Deuce is the original padel format and the one used on the World Padel Tour. At 40-40, play continues with advantage. The serving team wins a point and holds advantage; if they win the next point, the game is theirs. If the receiving team wins the advantage point, scores return to deuce and the cycle repeats.\n\nThere is no cap — a long deuce game can theoretically go on forever. In practice this creates some of the most memorable moments in padel: long rallies under pressure, momentum swings, mental resilience. If you\'re playing a serious match or a league fixture, Long Deuce is almost always the right call. It rewards consistent play and punishes nerves.',
      },
      {
        heading: 'Silver Point — the smart middle ground',
        body: 'Silver Point was introduced to speed up matches without abandoning the advantage concept entirely. At 40-40, advantage is played exactly once. If the team with advantage wins the next point, the game is theirs — identical to Long Deuce so far. But if the team without advantage wins that point, returning to 40-40, the next single point immediately decides the game. No second deuce.\n\nThis creates an interesting tactical layer. The team that first wins the advantage has everything to play for on the very next point. The team that claws back from 40-ADV knows one more point ends it. Silver Point is excellent for club play and timed matches — it prevents marathon games while keeping the advantage mechanic intact.\n\nPadelScorePro shows "Silver Point" on screen the moment the decisive final point is reached, so both teams always know exactly what\'s at stake.',
      },
      {
        heading: 'Golden Point — sudden death',
        body: 'Golden Point is the fastest and most dramatic format. At 40-40, the very next point ends the game. No advantage, no silver round — one point, done. The receiving team typically gets to choose which player receives, adding a small strategic element.\n\nGolden Point is used in some WPT events and is increasingly popular in social padel where time is limited. It places enormous pressure on a single rally and can feel slightly unfair if the balance of the game has been one-sided — but it is undeniably exciting. Use it for fast-format tournaments, time-limited social sessions, or when you just want to keep things moving.',
      },
      {
        heading: 'Star Point — the newest addition',
        body: 'Star Point is the newest deuce format, introduced to add an extra strategic dimension. At 40-40, the server announces "Star Point" and nominates which of the four players will receive. This targeted selection means the serving team can go after the weaker receiver, and the receiving team can anticipate and adjust their formation accordingly.\n\nThe game is then decided on a single point — like Golden Point — but the nomination element adds a pre-point mind game that more closely mirrors the tactics of professional play. Star Point is gaining traction in organised amateur competitions and is a genuinely fun format for experienced club players who want something beyond straight Golden Point.',
      },
      {
        heading: 'Which format should you play?',
        body: 'For league and competitive matches: Long Deuce. It is the fairest format and the one most players expect.\n\nFor club sessions and friendly matches: Silver Point. It keeps games moving, feels fair, and adds a genuine moment of drama.\n\nFor time-limited formats or tournaments with many rounds: Golden Point or Star Point. Fast, decisive, and spectator-friendly.\n\nPadelScorePro supports all four modes. Set your preferred deuce format before each match and the app handles everything — advantage, silver-point triggers, and golden-point decisions — automatically.',
      },
    ],
    cta: { label: 'Try the scorer', href: '/score' },
  },

  {
    slug:     '5-padel-tactics',
    title:    '5 padel tactics that will immediately improve your game',
    subtitle: 'Practical, court-tested advice for club players who want to win more points.',
    category: 'Tactics',
    readTime: '6 min read',
    date:     '11 Apr 2026',
    intro:
      'Padel rewards intelligence over raw power. The best club players do not hit harder — they think faster. These five tactics are practical, immediately applicable, and will make a visible difference from your very next match.',

    sections: [
      {
        heading: '1. Win the net, win the match',
        body: 'The team that controls the net wins the vast majority of padel points. The net position allows volleys, smashes, and angled winners that the back-court team simply cannot replicate. Your primary tactical objective on every point should be to advance to the net and hold it.\n\nAfter your serve lands, move forward. After a solid return, look for the first opportunity to attack the midcourt and push to the net. Retreat to the baseline only when forced — and then, only to reset, not to camp. Players who habitually stay back give opponents free time and angles they should never have.\n\nPractice the "serve and follow" pattern: serve, take a step forward, and be ready to volley the return. It feels uncomfortable at first. Within a few sessions it becomes instinct.',
      },
      {
        heading: '2. Target the feet, not the body',
        body: 'When you have the net and your opponents are at the back, the instinct is to smash at their bodies or go for outright winners. Resist this. The most effective volley in padel is aimed directly at the feet of the player who is about to receive.\n\nA ball dropping sharply at shoe level forces a rushed, low-quality return every time. It is far harder to defend than a powerful ball at chest height, which can be blocked back with relatively little technique. Low-and-at-the-feet consistently produces short balls, nets, and mishits — all of which become easy put-aways for your next shot.\n\nThis applies to both volleys and groundstrokes. When in doubt, keep it low.',
      },
      {
        heading: '3. Use the back wall — do not fear it',
        body: 'New and intermediate players treat the back wall as a hazard. Good players treat it as a weapon. A ball that bounces off the back wall gives you extra time, a wider range of shot options, and the ability to play from a more balanced position than rushing a ball near the baseline.\n\nPractise letting the ball come off the back wall and hitting from there. The optimal contact point is about 1-2 metres in front of the wall, giving you room to swing and direction to your shot. Aim cross-court — it is the highest-percentage shot from the back.\n\nThe "bandeja" and "vibora" — the padel-specific overhead shots played after a wall rebound — are the most effective weapons in the back court. Learning to play these confidently transforms your defensive position into a genuine scoring threat.',
      },
      {
        heading: '4. Communicate constantly with your partner',
        body: 'Padel is a doubles game and most points are lost to miscommunication before they are lost to bad shots. Balls down the middle — the most common attacking ball — fall between partners who each assume the other is taking it. They go to the wrong player, hit too late, or both arrive at once.\n\nEstablish a simple rule before you play: the player on the forehand side takes the middle ball. Alternatively, the faster or more dominant player calls it. Whatever you decide, decide before the match starts.\n\nCall "mine", "yours", or the player\'s name loudly and early. Celebrate good shots. Encourage after errors. A pair that communicates well will consistently beat a more technically gifted pair who play as individuals.',
      },
      {
        heading: '5. Reset with a lob — the most underused shot in club padel',
        body: 'When you are pinned at the back, under pressure, your opponents at the net — most players try to blast a winner and gift the point away. The correct shot in almost every defensive situation is a deep, high lob to the back corner.\n\nA good lob does three things simultaneously: it buys time, forces your opponents off the net, and changes the momentum of the rally. A lob to the back corner that lands within half a metre of the glass is very difficult to smash offensively. Your opponents must retreat, and suddenly you have time to recover your position and even advance to the net yourself.\n\nThe lob is not a passive shot — it is a reset button. Hitting it well is a skill. Knowing when to hit it is wisdom. Start using it every time you feel under pressure and watch how often it swings the point back in your direction.',
      },
      {
        heading: 'Track your improvement',
        body: 'These tactics only improve your game if you apply them consistently across multiple matches. Use PadelScorePro to track your matches, review results over time, and identify patterns — whether that\'s losing the third set, struggling on one surface, or dropping points in long-deuce games. Data makes you a better player.',
      },
    ],
    cta: { label: 'Track your matches', href: '/score' },
  },

  {
    slug:     'how-to-pick-padel-equipment',
    title:    'How to pick the right padel equipment',
    subtitle: 'Racket shape, core, weight, string — what actually matters and what is marketing.',
    category: 'Gear',
    readTime: '7 min read',
    date:     '11 Apr 2026',
    intro:
      'Walk into any padel shop and you will be confronted with hundreds of rackets at prices from £30 to £350, each promising power, control, or both. Most of it is marketing. Here is what actually affects how a racket plays — and how to match it to your game.',

    sections: [
      {
        heading: 'Shape: the single biggest decision',
        body: 'Padel rackets come in three core shapes and this is the most important variable in how a racket feels and performs.\n\nRound rackets have the largest sweet spot and the most forgiving hitting area. The sweet spot sits in the centre of the head, which is exactly where beginners and intermediates make contact most often. Round rackets prioritise control, consistency, and comfort. If you are new to padel or returning after a break, start here.\n\nDiamond rackets concentrate weight in the top of the head, generating maximum power. The sweet spot is smaller and sits high on the racket face — which means mishits are punished more. Diamond rackets are for confident, consistent ball-strikers who want to generate pace from the back of the court. The Bullpadel Hack series and Head Graphene diamonds are classic examples.\n\nTear-drop rackets sit between the two: more power than round, more control than diamond. The sweet spot is larger than a diamond and positioned centrally. Most club players at intermediate level find tear-drop rackets the ideal balance. If you are unsure, start with a tear-drop.',
      },
      {
        heading: 'Core: foam versus EVA',
        body: 'The inside of every padel racket is either foam or EVA rubber — and this matters almost as much as shape.\n\nFoam cores (also called rubber foam) are softer, more comfortable, and more forgiving. They absorb vibration well, which is easier on the arm and particularly important for players who suffer from elbow issues. Foam-core rackets typically give more control — the ball stays on the strings slightly longer, which helps with placement.\n\nEVA cores are denser and harder. They generate more power, give crisper feedback, and maintain their performance more consistently at high ball speeds. Professional players overwhelmingly use EVA. The trade-off is that harder EVA can transmit more vibration to the arm — players with shoulder or elbow sensitivity sometimes find foam more comfortable.\n\nFor beginners: foam or soft EVA. For competitive club players who are injury-free: hard EVA. Many mid-range rackets use a hybrid — EVA in the core with softer outer layers.',
      },
      {
        heading: 'Weight: lighter is not always better',
        body: 'Most padel rackets weigh between 340g and 385g. Manufacturers often suggest lighter rackets are easier to play — this is partially true but incomplete.\n\nLighter rackets are easier to swing quickly, which helps with reaction volleys at the net and reduces fatigue over a long session. If you play several times a week or are recovering from a wrist or shoulder issue, a lighter racket makes sense.\n\nHeavier rackets generate more natural power — the momentum of a heavier head transfers more energy to the ball. They also tend to be more stable on off-centre hits. Players who struggle to generate pace with technique often find that slightly more weight helps.\n\nThe sweet spot for most club players is 360–375g. Try before you buy if possible — hitting even ten balls with a racket tells you more than any specification sheet.',
      },
      {
        heading: 'Surface: rough versus smooth',
        body: 'The outer surface of a padel racket affects spin generation. Rough or textured surfaces grab the ball slightly more and allow greater topspin and slice. Smooth surfaces offer a more consistent, clean response but less spin potential.\n\nFor most players, surface texture is a secondary consideration — far less important than shape and core. Professional players obsess over it because at their level the difference matters. At club level, focus on getting shape and core right first.',
      },
      {
        heading: 'Shoes and balls — the two most overlooked decisions',
        body: 'Most players spend £200 on a racket and wear trainers from another sport. This is the wrong priority. Padel-specific shoes are designed for the lateral movement patterns of the game — quick side steps, sudden stops, and pivots that running or gym shoes cannot support safely. Ankle injuries from inadequate footwear are the most common padel injury. Good padel shoes do not need to be expensive — budget around £60–80 and prioritise grip and lateral support over branding.\n\nBalls matter more than most players realise. A brand-new set of padel balls plays completely differently from a tin that has been opened for three sessions. Pressurised balls lose feel and bounce noticeably after two to three hours of play. If your rallies feel flat and the ball is not responding, try a fresh tin before blaming your technique.',
      },
      {
        heading: 'Our equipment recommendations',
        body: 'For beginners — round profile, foam or soft EVA core, 355–365g. Adidas Metalbone or Head Delta variants in this range are reliable starting points.\n\nFor intermediate club players — tear-drop profile, medium EVA core, 365–375g. This is the largest category and where most of the best value sits. Head Graphene Delta Pro, Babolat Technical Viper, and the Wilson Bela ranges all perform well.\n\nFor advanced players — diamond or tear-drop, hard EVA core, 370–380g. The Bullpadel Hack series, NOX AT10, and Adidas Adipower Pro are consistently rated highly by experienced competitive players.\n\nWhatever you choose, remember that the racket does not make the player. Match data, tracked over time, will tell you more about where to improve than any equipment upgrade.',
      },
    ],
    cta: { label: 'View our gear guide', href: '/#gear' },
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
