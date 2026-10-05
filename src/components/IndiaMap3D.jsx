import { motion, useMotionValue, useTransform } from 'framer-motion';

// Accurate India Map Path
const INDIA_PATH = "M 209,45 L 213,45 L 216,48 L 225,45 L 227,50 L 235,60 L 247,65 L 252,71 L 256,72 L 256,78 L 260,82 L 272,85 L 272,91 L 280,91 L 284,87 L 287,87 L 295,81 L 299,79 L 308,79 L 314,74 L 325,80 L 331,79 L 338,87 L 332,111 L 326,115 L 326,118 L 322,119 L 322,124 L 318,131 L 312,131 L 308,133 L 312,142 L 308,145 L 308,148 L 312,151 L 320,151 L 319,159 L 324,168 L 319,173 L 317,172 L 312,178 L 308,178 L 305,176 L 304,170 L 296,172 L 295,174 L 304,188 L 303,195 L 306,198 L 304,202 L 305,206 L 307,208 L 312,202 L 319,213 L 324,217 L 332,217 L 336,221 L 338,221 L 339,226 L 341,228 L 352,231 L 357,238 L 343,251 L 344,255 L 341,259 L 341,266 L 336,273 L 336,277 L 344,281 L 346,281 L 347,279 L 350,280 L 356,285 L 364,288 L 368,294 L 370,294 L 372,297 L 379,301 L 386,300 L 394,306 L 401,305 L 403,311 L 413,312 L 416,315 L 418,314 L 418,311 L 431,313 L 436,309 L 442,314 L 449,314 L 450,322 L 464,329 L 467,329 L 474,325 L 476,327 L 477,333 L 491,332 L 497,334 L 499,337 L 502,337 L 509,332 L 510,336 L 514,338 L 518,336 L 527,335 L 531,335 L 533,337 L 535,334 L 536,326 L 535,322 L 531,318 L 531,305 L 534,300 L 535,292 L 539,292 L 544,288 L 549,289 L 552,292 L 551,307 L 554,310 L 554,312 L 551,314 L 560,323 L 569,322 L 579,325 L 584,324 L 589,319 L 592,319 L 597,322 L 619,320 L 632,315 L 630,311 L 630,303 L 627,301 L 622,302 L 618,299 L 618,294 L 620,291 L 629,292 L 632,290 L 639,290 L 643,288 L 645,285 L 644,281 L 648,277 L 655,275 L 660,265 L 671,263 L 675,259 L 680,250 L 688,244 L 691,244 L 697,248 L 703,248 L 708,250 L 713,243 L 724,237 L 729,241 L 732,241 L 731,245 L 727,249 L 728,250 L 735,247 L 738,254 L 738,257 L 732,265 L 734,266 L 738,263 L 741,263 L 744,265 L 752,265 L 755,267 L 759,267 L 758,272 L 760,276 L 759,278 L 754,280 L 749,287 L 750,291 L 756,297 L 756,300 L 752,300 L 745,294 L 734,297 L 714,316 L 708,319 L 707,323 L 709,328 L 709,336 L 706,345 L 698,354 L 698,357 L 703,361 L 701,369 L 694,381 L 692,392 L 690,395 L 683,393 L 671,394 L 673,398 L 673,419 L 667,422 L 667,431 L 670,441 L 665,448 L 659,446 L 655,450 L 653,434 L 647,423 L 646,411 L 642,404 L 636,405 L 636,410 L 633,414 L 633,422 L 630,425 L 627,425 L 625,422 L 621,422 L 622,418 L 616,409 L 616,403 L 619,394 L 626,393 L 628,389 L 633,389 L 634,385 L 637,384 L 641,378 L 640,370 L 646,370 L 643,366 L 636,364 L 613,364 L 608,366 L 596,367 L 584,365 L 579,363 L 578,345 L 575,340 L 573,341 L 573,346 L 571,347 L 562,343 L 560,336 L 557,334 L 555,335 L 558,338 L 558,340 L 555,339 L 552,342 L 548,341 L 548,338 L 550,337 L 549,335 L 544,336 L 542,341 L 538,344 L 536,351 L 538,353 L 541,353 L 547,360 L 555,360 L 555,363 L 559,366 L 559,369 L 547,369 L 545,376 L 543,378 L 540,376 L 536,384 L 539,388 L 544,391 L 554,392 L 556,402 L 551,407 L 551,410 L 557,417 L 556,421 L 561,421 L 563,423 L 560,429 L 562,431 L 561,437 L 566,448 L 566,460 L 568,466 L 557,468 L 556,463 L 553,469 L 551,469 L 550,466 L 546,468 L 540,468 L 539,464 L 537,463 L 515,474 L 511,478 L 513,491 L 515,495 L 512,498 L 511,503 L 507,507 L 480,522 L 478,522 L 478,517 L 474,518 L 470,522 L 476,524 L 464,534 L 448,557 L 442,563 L 433,567 L 422,581 L 405,591 L 399,597 L 400,607 L 396,612 L 384,617 L 374,617 L 370,621 L 366,631 L 363,634 L 358,634 L 357,629 L 348,632 L 341,645 L 341,656 L 344,664 L 343,679 L 345,683 L 345,693 L 348,696 L 348,703 L 345,719 L 335,736 L 333,745 L 336,751 L 335,757 L 338,782 L 322,782 L 320,784 L 321,788 L 311,801 L 311,804 L 314,807 L 322,807 L 325,811 L 324,813 L 320,811 L 314,811 L 311,813 L 296,815 L 292,820 L 291,828 L 288,834 L 272,843 L 265,842 L 260,838 L 252,829 L 243,815 L 238,803 L 241,799 L 240,794 L 232,778 L 227,756 L 221,748 L 219,742 L 210,732 L 203,719 L 198,703 L 196,686 L 192,681 L 189,666 L 177,650 L 176,643 L 173,640 L 173,635 L 165,623 L 161,591 L 155,569 L 155,565 L 157,565 L 158,563 L 153,560 L 152,549 L 155,547 L 155,544 L 151,540 L 149,523 L 149,515 L 154,503 L 154,495 L 148,483 L 148,476 L 150,471 L 146,468 L 146,465 L 148,456 L 153,455 L 144,452 L 143,453 L 140,460 L 139,478 L 132,485 L 110,495 L 100,495 L 89,489 L 82,482 L 78,477 L 75,471 L 76,470 L 70,468 L 60,457 L 55,449 L 58,445 L 62,446 L 65,450 L 67,448 L 74,449 L 77,445 L 81,445 L 83,443 L 88,444 L 95,433 L 94,432 L 83,434 L 76,439 L 63,436 L 49,426 L 48,424 L 51,421 L 46,419 L 45,413 L 41,415 L 38,412 L 38,409 L 42,404 L 52,403 L 54,401 L 56,394 L 59,397 L 76,396 L 83,400 L 96,393 L 100,394 L 102,399 L 106,399 L 111,394 L 112,383 L 107,372 L 103,367 L 103,360 L 94,359 L 89,351 L 89,347 L 92,343 L 92,336 L 90,334 L 83,334 L 75,328 L 78,316 L 90,305 L 93,299 L 99,294 L 104,294 L 107,297 L 107,301 L 110,304 L 121,299 L 130,300 L 134,298 L 137,295 L 139,289 L 144,284 L 147,277 L 164,265 L 168,259 L 174,243 L 182,240 L 188,228 L 196,219 L 204,213 L 201,210 L 202,204 L 204,202 L 203,191 L 211,185 L 218,185 L 222,180 L 216,175 L 206,174 L 204,165 L 197,165 L 194,162 L 185,159 L 180,153 L 181,133 L 179,130 L 177,116 L 178,114 L 183,112 L 186,107 L 191,106 L 194,100 L 186,96 L 185,91 L 187,88 L 175,84 L 173,82 L 172,77 L 162,78 L 160,76 L 161,66 L 166,63 L 175,52 L 188,53 L 192,48 L 196,50 L 203,46 L 209,45 Z";

export default function IndiaMap3D() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on mouse position
  const rotateX = useTransform(y, [-500, 500], [15, -15]);
  const rotateY = useTransform(x, [-500, 500], [-15, 15]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1200, // 3D perspective
        zIndex: 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Container for the map */}
      <motion.div
        style={{
          width: '100%',
          maxWidth: '580px',
          height: '80vh',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 800 944"
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 30px 40px rgba(0,0,0,0.15))' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Tricolor Gradient for India Map */}
            <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF671F" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#FF671F" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#046A38" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#046A38" stopOpacity="0.9" />
            </linearGradient>
            
            {/* 3D Extrusion Glow */}
            <filter id="extrusion">
              <feDropShadow dx="3" dy="5" stdDeviation="0" floodColor="#D84315" floodOpacity="0.8" />
              <feDropShadow dx="6" dy="10" stdDeviation="0" floodColor="#1B5E20" floodOpacity="0.5" />
              <feDropShadow dx="0" dy="20" stdDeviation="15" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Extruded Map Path */}
          <path
            d={INDIA_PATH}
            fill="url(#tricolor)"
            stroke="#FFD54F"
            strokeWidth="3"
            filter="url(#extrusion)"
            style={{ transform: 'translateZ(50px)' }} // 3D pop out
          />

          {/* Bhopal Marker (3D popped) */}
          <g style={{ transform: 'translateZ(100px)' }}>
            <g transform="translate(190, 480)">
              <circle r="8" fill="#FFD54F" filter="drop-shadow(0 0 10px #FFD54F)">
                <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#BF360C" />
              <rect x="18" y="-14" width="130" height="28" rx="14" fill="#FDF9F1" stroke="#FFD54F" strokeWidth="2" filter="drop-shadow(0 5px 10px rgba(0,0,0,0.2))" />
              <text x="30" y="5" fill="#BF360C" fontSize="13" fontWeight="900" fontFamily="Yatra One, display" letterSpacing="1">MANIT BHOPAL</text>
            </g>
          </g>

          {/* Orbiting particles for more dynamic feel */}
          <g style={{ transform: 'translateZ(80px)' }}>
            <circle r="6" fill="#FF671F" filter="drop-shadow(0 0 8px #FF671F)">
              <animateMotion path={INDIA_PATH} dur="12s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#046A38" filter="drop-shadow(0 0 8px #046A38)">
              <animateMotion path={INDIA_PATH} dur="18s" begin="-5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
