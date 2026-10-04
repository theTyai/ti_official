/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuButton =
  document.getElementById("mobileMenuButton");

const sidebar =
  document.getElementById("mobileSidebar");

const overlay =
  document.getElementById("mobileOverlay");

const closeSidebar =
  document.getElementById("closeSidebar");


function openSidebar() {

  sidebar.classList.add("open");
  overlay.classList.add("show");

}


function closeMobileSidebar() {

  sidebar.classList.remove("open");
  overlay.classList.remove("show");

}


menuButton.addEventListener(
  "click",
  openSidebar
);

closeSidebar.addEventListener(
  "click",
  closeMobileSidebar
);

overlay.addEventListener(
  "click",
  closeMobileSidebar
);


document
  .querySelectorAll(".mobile-sidebar a")
  .forEach(link => {

    link.addEventListener(
      "click",
      closeMobileSidebar
    );

  });


/* =========================================================
   NAVBAR ACTIVE LINK
========================================================= */

const sections =
  document.querySelectorAll("section[id]");

const navLinks =
  document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop =
      section.offsetTop - 150;

    const sectionHeight =
      section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {

      current =
        section.getAttribute("id");

    }

  });


  navLinks.forEach(link => {

    link.classList.remove("active");

    if (
      link.getAttribute("href") ===
      "#" + current
    ) {

      link.classList.add("active");

    }

  });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(element => {

  revealObserver.observe(element);

});


/* =========================================================
   EVENT SLIDER
========================================================= */

const slides =
  document.querySelectorAll(".event-slide");

const dots =
  document.querySelectorAll(
    "#sliderDots button"
  );

const previous =
  document.getElementById("prevEvent");

const next =
  document.getElementById("nextEvent");

const pause =
  document.getElementById("pauseEvent");


let currentSlide = 0;

let autoplay = true;

let sliderInterval;


function showSlide(index) {

  if (index < 0) {

    index =
      slides.length - 1;

  }

  if (index >= slides.length) {

    index = 0;

  }

  currentSlide = index;


  slides.forEach(slide => {

    slide.classList.remove("active");

  });


  dots.forEach(dot => {

    dot.classList.remove("active");

  });


  slides[currentSlide]
    .classList.add("active");


  if (dots[currentSlide]) {

    dots[currentSlide]
      .classList.add("active");

  }

}


function nextSlide() {

  showSlide(
    currentSlide + 1
  );

}


function previousSlide() {

  showSlide(
    currentSlide - 1
  );

}


function startSlider() {

  clearInterval(sliderInterval);

  sliderInterval =
    setInterval(() => {

      if (autoplay) {

        nextSlide();

      }

    }, 5000);

}


next.addEventListener(
  "click",
  () => {

    nextSlide();
    startSlider();

  }
);


previous.addEventListener(
  "click",
  () => {

    previousSlide();
    startSlider();

  }
);


dots.forEach((dot,index) => {

  dot.addEventListener(
    "click",
    () => {

      showSlide(index);
      startSlider();

    }
  );

});


pause.addEventListener(
  "click",
  () => {

    autoplay = !autoplay;


    const icon =
      pause.querySelector("i");


    if (autoplay) {

      icon.className =
        "fa-solid fa-pause";

    } else {

      icon.className =
        "fa-solid fa-play";

    }

  }
);


startSlider();


/* =========================================================
   PARTICLE CANVAS
========================================================= */

const canvas =
  document.getElementById(
    "particleCanvas"
  );

const ctx =
  canvas.getContext("2d");


let particles = [];

let mouse = {
  x: null,
  y: null,
  radius: 100
};


function resizeCanvas() {

  canvas.width =
    window.innerWidth;

  canvas.height =
    window.innerHeight;

}


resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);


window.addEventListener(
  "mousemove",
  event => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

  }
);


class Particle {

  constructor() {

    this.x =
      Math.random() *
      canvas.width;

    this.y =
      Math.random() *
      canvas.height;

    this.size =
      Math.random() * 1.8 + .4;

    this.speedX =
      (Math.random() - .5) * .35;

    this.speedY =
      (Math.random() - .5) * .35;

    this.opacity =
      Math.random() * .5 + .2;

  }


  update() {

    this.x += this.speedX;
    this.y += this.speedY;


    if (
      this.x < 0 ||
      this.x > canvas.width
    ) {

      this.speedX *= -1;

    }


    if (
      this.y < 0 ||
      this.y > canvas.height
    ) {

      this.speedY *= -1;

    }


    if (mouse.x !== null) {

      const dx =
        this.x - mouse.x;

      const dy =
        this.y - mouse.y;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (
        distance < mouse.radius
      ) {

        this.x +=
          dx / distance * 0.5;

        this.y +=
          dy / distance * 0.5;

      }

    }

  }


  draw() {

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(255,255,255,${this.opacity})`;

    ctx.fill();

  }

}


function createParticles() {

  particles = [];

  const count =
    window.innerWidth < 700
      ? 55
      : 110;


  for (
    let i = 0;
    i < count;
    i++
  ) {

    particles.push(
      new Particle()
    );

  }

}


createParticles();


window.addEventListener(
  "resize",
  createParticles
);


function connectParticles() {

  for (
    let a = 0;
    a < particles.length;
    a++
  ) {

    for (
      let b = a + 1;
      b < particles.length;
      b++
    ) {

      const dx =
        particles[a].x -
        particles[b].x;

      const dy =
        particles[a].y -
        particles[b].y;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (distance < 110) {

        const opacity =
          0.12 -
          distance / 1000;


        ctx.beginPath();

        ctx.strokeStyle =
          `rgba(255,153,51,${opacity})`;

        ctx.lineWidth = .5;

        ctx.moveTo(
          particles[a].x,
          particles[a].y
        );

        ctx.lineTo(
          particles[b].x,
          particles[b].y
        );

        ctx.stroke();

      }

    }

  }

}


function animateParticles() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  particles.forEach(
    particle => {

      particle.update();
      particle.draw();

    }
  );


  connectParticles();


  requestAnimationFrame(
    animateParticles
  );

}


animateParticles();


/* =========================================================
   CURRENT YEAR
========================================================= */

document.getElementById(
  "year"
).textContent =
  new Date().getFullYear();


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(anchor => {

    anchor.addEventListener(
      "click",
      function(event) {

        const target =
          document.querySelector(
            this.getAttribute("href")
          );


        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  });