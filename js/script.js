/**
 * ROBOFORGE — Premium Robotics & Industrial Automation
 * Reference Design Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Navigation Scroll State
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('mainNavbar');
  const navCollapse = document.getElementById('navbarCollapse');
  const navLinks = document.querySelectorAll('.rf-nav-link-ref');

  const handleNavScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Auto-collapse mobile nav on item click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 2. Active Navigation Spy
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // ------------------------------------------------------------------------
  // 3. Interactive "You design it. We craft it." Thumbnail Switcher
  // ------------------------------------------------------------------------
  const imageMap = {
    'plate': 'assets/images/mounting-plate.jpg',
    'gripper': 'assets/images/robotic-gripper.jpg',
    'arm': 'assets/images/modular-robot-arm.jpg',
    'cnc': 'assets/images/cnc-components.jpg'
  };

  window.switchCraftProduct = (type) => {
    const mainImg = document.getElementById('craftMainImage');
    const thumbBtns = document.querySelectorAll('.craft-thumb-btn');

    if (mainImg && imageMap[type]) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = imageMap[type];
        mainImg.style.opacity = '1';
      }, 150);
    }

    thumbBtns.forEach(btn => {
      btn.classList.remove('active');
      const clickAttr = btn.getAttribute('onclick') || '';
      if (clickAttr.includes(type)) {
        btn.classList.add('active');
      }
    });
  };

  // ------------------------------------------------------------------------
  // 4. Product Technical Specifications Data & Modal
  // ------------------------------------------------------------------------
  const productSpecsData = {
    'rf-gripper': {
      title: '01 — Custom Grippers & Robotic Jaws',
      category: 'GRIPPERS',
      description: 'Custom jaws and fingers precisely tailored to your end-effector design, payload requirements, and delicate handling tolerances.',
      specs: [
        { label: 'Kinematic Configuration', value: 'Dual-jaw parallel servo / pneumatic actuation' },
        { label: 'Stroke Range', value: 'Customizable up to 120 mm' },
        { label: 'Grip Force', value: '10 N to 350 N continuous feedback' },
        { label: 'Repeatability', value: '±0.005 mm (5 microns)' },
        { label: 'Materials Available', value: '7075-T6 Hard Anodized Aluminum, Titanium Ti-6Al-4V, Delrin' },
        { label: 'Surface Treatment', value: 'Hardcoat Type III, DLC Wear Layer, Micro-bead blast' },
        { label: 'Lead Time', value: 'Express 48h prototype dispatch' }
      ]
    },
    'rf-plate': {
      title: '02 — Precision Kinematic Mounting Plates',
      category: 'PLATES',
      description: 'The backbone of your robotic system. Ultra-flat kinematic interface plates with vernier alignment marks and pneumatic feedthroughs.',
      specs: [
        { label: 'Mounting Compatibility', value: 'ISO 9409-1 standard bolt circles (40, 50, 80 mm)' },
        { label: 'Kinematic Repeatability', value: '±0.002 mm (2 microns)' },
        { label: 'Flatness Tolerance', value: 'Sub-micron ground surface (< 0.003 mm)' },
        { label: 'Integrated Ports', value: 'Up to 6x M5 pneumatic & 16-pin gold signal contacts' },
        { label: 'Material', value: 'Aerospace 7075-T6 with laser-etched coordinate scales' },
        { label: 'Production Batch', value: 'From single-piece prototypes to production volumes' },
        { label: 'Quality Verification', value: '100% CMM Coordinate Measuring metrology reports' }
      ]
    }
  };

  const specModalElement = document.getElementById('specModal');
  const specModalTitle = document.getElementById('specModalTitle');
  const specModalCategory = document.getElementById('specModalCategory');
  const specModalDesc = document.getElementById('specModalDesc');
  const specModalTable = document.getElementById('specModalTable');
  const specModalEnquireBtn = document.getElementById('specModalEnquireBtn');

  window.openProductSpecs = (productId) => {
    const data = productSpecsData[productId];
    if (!data || !specModalElement) return;

    if (specModalTitle) specModalTitle.textContent = data.title;
    if (specModalCategory) specModalCategory.textContent = data.category;
    if (specModalDesc) specModalDesc.textContent = data.description;

    if (specModalTable) {
      let rows = '';
      data.specs.forEach(item => {
        rows += `
          <tr>
            <th scope="row">${item.label}</th>
            <td>${item.value}</td>
          </tr>
        `;
      });
      specModalTable.innerHTML = rows;
    }

    if (specModalEnquireBtn) {
      specModalEnquireBtn.onclick = () => {
        const modalInstance = bootstrap.Modal.getInstance(specModalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        prefillContactForm(data.category, `RFQ inquiry for ${data.title}: Please provide rapid pricing, DFM feedback, and lead-time estimation.`);
      };
    }

    const modal = new bootstrap.Modal(specModalElement);
    modal.show();
  };

  // ------------------------------------------------------------------------
  // 5. Product Enquire Link Helper
  // ------------------------------------------------------------------------
  window.enquireProduct = (categoryName, productTitle) => {
    prefillContactForm(categoryName, `RFQ regarding ${productTitle}: Please provide manufacturing options and quotation.`);
  };

  function prefillContactForm(category, messageText) {
    const categorySelect = document.getElementById('projectCategory');
    const requirementsTextarea = document.getElementById('projectRequirements');
    const contactSection = document.getElementById('contact');

    if (categorySelect && category) {
      for (let i = 0; i < categorySelect.options.length; i++) {
        if (categorySelect.options[i].text.toLowerCase().includes(category.toLowerCase())) {
          categorySelect.selectedIndex = i;
          break;
        }
      }
    }

    if (requirementsTextarea && messageText) {
      requirementsTextarea.value = messageText;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const nameField = document.getElementById('fullName');
        if (nameField) nameField.focus();
      }, 550);
    }
  }

  // ------------------------------------------------------------------------
  // 6. RFQ / Contact Form Validation & Feedback
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('projectContactForm');
  const submitBtn = document.getElementById('submitEnquiryBtn');
  const statusCard = document.getElementById('submissionStatusCard');
  const statusDetail = document.getElementById('submissionStatusDetail');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const fullName = document.getElementById('fullName');
      const companyName = document.getElementById('companyName');
      const emailAddress = document.getElementById('emailAddress');
      const projectCategory = document.getElementById('projectCategory');
      const projectRequirements = document.getElementById('projectRequirements');

      let isValid = true;

      // Full Name
      if (!fullName.value.trim()) {
        fullName.classList.add('is-invalid');
        isValid = false;
      } else {
        fullName.classList.remove('is-invalid');
        fullName.classList.add('is-valid');
      }

      // Company
      if (!companyName.value.trim()) {
        companyName.classList.add('is-invalid');
        isValid = false;
      } else {
        companyName.classList.remove('is-invalid');
        companyName.classList.add('is-valid');
      }

      // Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailAddress.value.trim() || !emailPattern.test(emailAddress.value.trim())) {
        emailAddress.classList.add('is-invalid');
        isValid = false;
      } else {
        emailAddress.classList.remove('is-invalid');
        emailAddress.classList.add('is-valid');
      }

      // Requirements
      if (!projectRequirements.value.trim()) {
        projectRequirements.classList.add('is-invalid');
        isValid = false;
      } else {
        projectRequirements.classList.remove('is-invalid');
        projectRequirements.classList.add('is-valid');
      }

      if (!isValid) {
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Validating RFQ...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        const submittedCategory = projectCategory.options[projectCategory.selectedIndex].text;
        const submittedName = fullName.value.trim();
        const submittedCompany = companyName.value.trim();
        const submittedEmail = emailAddress.value.trim();

        if (statusDetail) {
          statusDetail.innerHTML = `
            Thank you, <strong>${submittedName}</strong> from <strong>${submittedCompany}</strong>!<br>
            Your RFQ for <strong>${submittedCategory}</strong> has been received in demonstration mode. In production, this would be routed directly to the RoboForge engineering team with confirmation sent to <span class="text-cyan">${submittedEmail}</span>.
          `;
        }

        if (statusCard) {
          statusCard.classList.remove('d-none');
          statusCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();
        const validInputs = contactForm.querySelectorAll('.is-valid');
        validInputs.forEach(input => input.classList.remove('is-valid'));
      }, 500);
    });

    const inputs = contactForm.querySelectorAll('.rf-form-control-ref');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 7. Smooth Scroll for Anchor Links
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (navHeight + 10);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
