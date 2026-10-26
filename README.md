# A Little Birthday Universe

A scrapbook-style birthday site: selfie welcome, floating balloons, photo wall, catch-the-moments game, a letter, and a candle-blowing finale that makes a shareable card.

1. **Install:** `npm install`
2. **Run locally:** `npm run dev` (open the printed URL; use `localhost` or https so the camera and mic work)
3. **Photos:** put files in `public/images/memories/`. Everything listed in `memories.js` shows up on the photo wall, the pin board and in the photo book automatically.
4. **Photo + sentence:** each entry in `src/data/memories.js` has `image`, `alt`, `caption`, `message`, `date`, `rotation`, `size`, `shape`, `photobomb`. Add, remove, or reorder entries freely.
5. **Names, letter, wish, closing line:** `src/data/birthday.js`. New options there: `age` (turning-N sticker), `candles` (1-12), `marquee` (scrolling ribbon words), `ps` (P.S. under the letter).
6. **Game text:** `src/data/gameMessages.js` holds the score messages, the unlockable **rewards** (coupons), and the **achievements** (badges). Edit the rewards into promises you will happily keep!
7. **Test the game:** press LET'S PLAY (25 s, +3 s per hourglass). Change `DUR` in `BirthdayGame.jsx` for a shorter test.
8. **Capy the capybara:** everything Capy says lives in `src/data/capybara.js` (`{name}` becomes the birthday person's name). Capy waddles in after the welcome screen and wishes happy birthday, comments on each chapter, can be petted (every 5th pet is a surprise party), sings along with the birthday tune, and cheers when the candles go out. "hear it" reads a line aloud with the browser's built-in voice; "hush" silences the chatter (petting still works). Capy steps aside while the game is running.
9. **Production build:** `npm run build` (output in `dist/`, `npm run preview` to check)

## What's inside
- **Welcome:** selfie "develops" like a polaroid, then reappears as a mini print in the hero and as a stamp on the letter and card. Nothing is uploaded anywhere.
- **Hero:** dropping letters, pop-able balloons, wiggling gift, optional age sticker, scrolling ribbon.
- **Photo wall:** no-overlap scrapbook layout, lightbox with arrow keys + swipe, hearts (saved on the device), slideshow.
- **Pin board:** the same photos as grid-paper polaroids with red heart stickers, handwritten captions plus an emoji, and fluttering butterflies. On a computer you can drag prints around (they stay on the board); tap a print to open it, tap its heart to love it, SHUFFLE re-scatters them. Set `emoji` on a memory to change its emoji (`emoji:''` for none).
- **Photo book:** a page-turning book with a cover, a "belongs to" page (with the welcome selfie), a contents page, then two pages per memory (photo, then caption + message), and a back cover. Click the pages, use Prev/Next, arrow keys or swipe. Phones show one page at a time. Title text: `bookKicker` and `bookTitle` in `src/data/birthday.js`.
- **Game:** combo, bonus stars, time-bonus hourglasses, personal best, badges, coupons.
- **Letter:** wax-sealed envelope, lines write themselves in, no length limit.
- **Finale:** sing-along with lyrics (music-box tune made in the browser), blow the candles by tapping, the button, or **blowing into the mic**, then save or share a PNG wish card.
- **Capy:** a hand-drawn capybara with a party hat and an orange on its back, who says happy birthday in person.
- **Navigation:** floating dock with a reading-progress bar and a birthday-tune button.
"# Please-don-t-use-this" 
