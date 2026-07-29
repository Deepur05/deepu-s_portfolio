/* ==========================================================================
   DEEPU R - PORTFOLIO INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. TYPING TEXT ANIMATION
  const typingElement = document.getElementById('typing-element');
  const roles = [
    "an AI Engineer",
    "an Embedded Systems Enthusiast",
    "a Robotics Enthusiast",
    "a Problem Solver"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingDelay = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 500; // Pause before typing next
    }

    setTimeout(typeRole, typingDelay);
  }

  if (typingElement) {
    setTimeout(typeRole, 500);
  }

  // 2. CANVAS NEURAL NETWORK / CIRCUIT ANIMATION
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const particles = [];
    const numParticles = Math.min(Math.floor(width * 0.05), 85);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(127, 0, 255, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            let opacity = (1 - dist / 120) * 0.25;
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  // 3. NAVBAR SCROLL & MOBILE MENU TOGGLE
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active link update
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // 4. PROJECT FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 5. PROJECT DETAILS MODAL
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  const projectDetails = {
    soccer: {
      title: "Autonomous Soccer Robot",
      subtitle: "Personal Project | C++ & Robotics Automation",
      img: "assets/soccer_robot.png",
      tags: ["C++", "Omni-Wheels", "Real-Time Automation", "Sensors"],
      desc: "Designed and implemented movement control and automation logic for an autonomous soccer robot capable of high-speed field navigation and tactical play.",
      features: [
        "Architected custom movement control algorithms in C++ for omni-directional motion planning.",
        "Engineered real-time coordination between mechanical actuation motors and low-level firmware.",
        "Integrated proximity and direction sensors to enable dynamic ball tracking and field position calculation.",
        "Tested & optimized decision-making loops for low-latency obstacle avoidance and ball driving."
      ]
    },
    drawing: {
      title: "Automatic Drawing Machine",
      subtitle: "Personal Project (In Progress) | Motion Planning & Geometry",
      img: "assets/drawing_machine.png",
      tags: ["Coordinate Geometry", "Motion Planning", "C++", "Python", "Hardware Integration"],
      desc: "Designing a precision CNC-style drawing machine that parses digital vector input and translates it into physical plots using stepper motor control.",
      features: [
        "Developing coordinate geometry transformation algorithms to convert 2D digital image coordinates into precise motor steps.",
        "Building custom stepper motor trajectory control logic with smooth acceleration/deceleration curves.",
        "Interfacing micro-controller hardware with custom Python/C++ software driver stack.",
        "Implementing physical pen-lift mechanisms and canvas calibration routines."
      ]
    },
    car: {
      title: "Wireless Obstacle Robotic Car",
      subtitle: "Embedded Systems Internship | TechMaghi, Kochi",
      img: "assets/robotic_car.png",
      tags: ["Arduino", "Embedded C/C++", "Ultrasonic Sensors", "Motor Drivers", "Wireless Navigation"],
      desc: "Developed during internship at TechMaghi, Kochi. An Arduino-powered smart vehicle featuring wireless remote control and automatic obstacle avoidance.",
      features: [
        "Built a multi-sensor array using ultrasonic proximity sensors for 360-degree real-time obstacle detection.",
        "Programmed motor driver H-bridge logic in C/C++ enabling proportional speed adjustment and emergency stopping.",
        "Refined wireless command transmission protocols to ensure reliable navigation commands with minimal latency.",
        "Collaborated with cross-functional technical teams to conduct rigorous hardware debugging and field testing."
      ]
    }
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const details = projectDetails[projKey];

      if (details && projectModal && modalBody) {
        modalBody.innerHTML = `
          <div class="modal-header">
            <h2 class="project-title" style="color: var(--primary-cyan); font-family: var(--font-heading); font-size: 1.8rem;">${details.title}</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">${details.subtitle}</p>
          </div>
          <img src="${details.img}" alt="${details.title}" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 1.2rem; border: 1px solid var(--border-color);" />
          <p style="color: var(--text-main); font-size: 1rem; margin-bottom: 1.2rem;">${details.desc}</p>
          <h4 style="color: var(--primary-cyan); font-family: var(--font-heading); margin-bottom: 0.6rem;">Key Technical Features & Achievements:</h4>
          <ul style="color: var(--text-muted); font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            ${details.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${details.tags.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
        `;
        projectModal.classList.add('active');
      }
    });
  });

  if (modalClose && projectModal) {
    modalClose.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  // Close modal when clicking outside box
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove('active');
    }
  });

  // 6. RESUME MODAL
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeModalClose = document.getElementById('resume-modal-close');

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  if (resumeModalClose && resumeModal) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
    }
  });

  // 7. CONTACT FORM SUBMISSION (Google Forms)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const hiddenIframe = document.getElementById('hidden_iframe');
  const confirmModal = document.getElementById('confirm-modal');
  const confirmClose = document.getElementById('confirm-modal-close');
  const confirmOk = document.getElementById('confirm-ok-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      message.value = `[${subject.value}]\n\n${message.value}`;
      subject.removeAttribute('name');

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Request...';
      submitBtn.disabled = true;

      formStatus.className = 'form-status';
      formStatus.textContent = '';
      formStatus.style.display = 'none';

      if (hiddenIframe) {
        hiddenIframe.onload = () => {
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message / Hire Request';
          submitBtn.disabled = false;
          contactForm.reset();
          if (confirmModal) confirmModal.classList.add('active');
        };
      }
    });
  }

  if (confirmClose && confirmModal) {
    confirmClose.addEventListener('click', () => confirmModal.classList.remove('active'));
  }
  if (confirmOk && confirmModal) {
    confirmOk.addEventListener('click', () => confirmModal.classList.remove('active'));
  }
  window.addEventListener('click', (e) => {
    if (e.target === confirmModal) confirmModal.classList.remove('active');
  });
});
