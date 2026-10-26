// EDIT ME: reward text by score (highest matching min wins). Always kind.
export const gameMessages = [
  {min:0,title:'Every little thing counts!',text:"You caught a handful of what I adore about you. There are so many more where those came from."},
  {min:15,title:'Your heart is filling up!',text:'Look at all those little things. And I could keep this list going for a very long time.'},
  {min:30,title:'Overflowing with everything I adore!',text:'Quick hands! Your year is already spilling over with good things, and so is my heart.'}
];

// EDIT ME: little coupons unlocked by score. Everyone unlocks the first one; the rest are earned.
// Change the text to real promises you will happily keep.
export const rewards = [
  {min:0,emoji:'\u{1F917}',title:'One very long hug',text:'Redeemable any time, no expiry date.'},
  {min:12,emoji:'\u2615',title:'A treat on me',text:'Coffee, boba or dessert: your pick, and I bring the company.'},
  {min:24,emoji:'\u{1F3AC}',title:'A date, your choice',text:'Movie, a walk, or something silly: you decide, I show up.'},
  {min:35,emoji:'\u{1F337}',title:'Lily of the valley',text:'A bouquet of your favourite flowers, hand-delivered.'}
];

// EDIT ME: badges earned during a round. stat = score | maxCombo | bonus | clocks | caught
export const achievements = [
  {emoji:'\u{1F525}',title:'Heart racing',desc:'Hit a x5 combo',stat:'maxCombo',min:5},
  {emoji:'\u{1F339}',title:'Rose collector',desc:'Caught 3 bonus roses',stat:'bonus',min:3},
  {emoji:'\u23F3',title:'Time stopper',desc:'Caught 2 hourglasses',stat:'clocks',min:2},
  {emoji:'\u{1F3C6}',title:'Heart full',desc:'Scored 35 or more',stat:'score',min:35}
];

// Little words that float up when a moment is caught.
export const momentWords = ['your laugh','your smile','a sweet hello','your kindness','a quiet moment','your eyes','a warm hug'];
