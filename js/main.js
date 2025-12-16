// 2.1. Маніпуляція елементами зміна фону всіх карток і додавання <p> у кінець main
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.style.backgroundColor = "#f6f4f2";
});

const main = document.querySelector("main");

if (main) {
  const info = document.createElement("p");
  info.textContent = "To report an issue or bug, email sachek.vladyslava@lll.kpi.ua.";
  info.style.fontSize = "0.85rem";
  info.style.opacity = "0.7";

  main.append(info);
}

// 2.2. Динамічна зміна контенту
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accordion").forEach(acc => {
    const btn = acc.querySelector(".accordion-toggle");

    btn.addEventListener("click", () => {
      const isOpen = acc.classList.toggle("is-open");
      btn.textContent = isOpen ? "Show less" : "Show more";
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
});

const yearSpan = document.getElementById("current-year");

if (yearSpan) {
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
}

//3.1. Робота з кліками Перемикання теми зі збереженням в localstorage

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "bmm-theme";
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function setButtonState(isDark) {
    btn.setAttribute("aria-pressed", String(isDark));
    btn.textContent = isDark ? "☼" : "☽";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    setButtonState(isDark);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  btn.addEventListener("click", () => {
    const isDarkNow = document.body.classList.contains("dark-theme");
    const next = isDarkNow ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
});

//3.2. Події миші та клавіатури
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => link.classList.add("is-hovered"));
    link.addEventListener("mouseleave", () => link.classList.remove("is-hovered"));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "fontSizePx";
  const MIN = 14;
  const MAX = 20;
  const STEP = 1;

  function applyFontSize(px) {
    const clamped = Math.max(MIN, Math.min(MAX, px));
    document.documentElement.style.fontSize = `${clamped}px`;
    localStorage.setItem(STORAGE_KEY, String(clamped));
    return clamped;
  }

  const saved = Number(localStorage.getItem(STORAGE_KEY));
  let current = Number.isFinite(saved) && saved > 0
    ? applyFontSize(saved)
    : parseFloat(getComputedStyle(document.documentElement).fontSize);

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      current = applyFontSize(current + STEP);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      current = applyFontSize(current - STEP);
    }
  });
});

//4 Робота з формами та валідацією
document.addEventListener("DOMContentLoaded", () => {
  const isValidEmail = (value) => {
    const v = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  };

  const setError = (field, message) => {
    field.classList.add("is-invalid");
    const group = field.closest(".form-group");
    const errorEl = group ? group.querySelector(".field-error") : null;
    if (errorEl) errorEl.textContent = message;
  };

  const clearError = (field) => {
    field.classList.remove("is-invalid");
    const group = field.closest(".form-group");
    const errorEl = group ? group.querySelector(".field-error") : null;
    if (errorEl) errorEl.textContent = "";
  };

  const setFormMessage = (form, message, type) => {
    const box = form.querySelector(".form-message");
    if (!box) return;
    box.textContent = message;
    box.classList.remove("is-success", "is-error");
    if (type) box.classList.add(type);
  };

  const readFormData = (form) => {
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = String(value).trim();
    });
    return data;
  };

  //contacts val
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormMessage(contactForm, "", null);

      const name = contactForm.querySelector('input[name="name"]');
      const email = contactForm.querySelector('input[name="email"]');
      const message = contactForm.querySelector('textarea[name="message"]');

      [name, email, message].forEach(clearError);

      let ok = true;

      if (name.value.trim().length < 3) {
        ok = false;
        setError(name, "Name must be at least 3 characters.");
      }

      if (!isValidEmail(email.value)) {
        ok = false;
        setError(email, "Enter a valid email (example@domain.com).");
      }

      if (message.value.trim().length < 10) {
        ok = false;
        setError(message, "Message must be at least 10 characters.");
      }

      if (!ok) {
        setFormMessage(contactForm, "Please fix the errors above.", "is-error");
        return;
      }

      const data = readFormData(contactForm);
      console.log("CONTACT FORM DATA:", data);

      contactForm.reset();
      setFormMessage(contactForm, "Form is successfully sent!", "is-success");
    });
  }

  //login val
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormMessage(loginForm, "", null);

      const email = loginForm.querySelector('input[name="email"]');
      const password = loginForm.querySelector('input[name="password"]');

      [email, password].forEach(clearError);

      let ok = true;

      if (!isValidEmail(email.value)) {
        ok = false;
        setError(email, "Enter a valid email.");
      }

      if (password.value.trim().length < 8) {
        ok = false;
        setError(password, "Password must be at least 8 characters.");
      }

      if (!ok) {
        setFormMessage(loginForm, "Please fix the errors above.", "is-error");
        return;
      }

      const data = readFormData(loginForm);
      console.log("LOGIN FORM DATA:", data);

      loginForm.reset();
      setFormMessage(loginForm, "Form is successfully sent!", "is-success");
    });
  }

  //register val
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormMessage(registerForm, "", null);

      const email = registerForm.querySelector('input[name="email"]');
      const password = registerForm.querySelector('input[name="password"]');
      const repeat = registerForm.querySelector('input[name="repeat_password"]');

      [email, password, repeat].forEach(clearError);

      let ok = true;

      if (!isValidEmail(email.value)) {
        ok = false;
        setError(email, "Enter a valid email.");
      }

      if (password.value.trim().length < 8) {
        ok = false;
        setError(password, "Password must be at least 8 characters.");
      }

      if (repeat.value.trim() !== password.value.trim()) {
        ok = false;
        setError(repeat, "Passwords do not match.");
      }

      if (!ok) {
        setFormMessage(registerForm, "Please fix the errors above.", "is-error");
        return;
      }

      const data = readFormData(registerForm);
      console.log("REGISTER FORM DATA:", data);

      registerForm.reset();
      setFormMessage(registerForm, "Form is successfully sent!", "is-success");
    });
  }
});

//додатково
document.addEventListener("DOMContentLoaded", () => {
  const searchForms = document.querySelectorAll("form.search, header form");

  searchForms.forEach((form) => {
    const input = form.querySelector('input[type="search"]');
    if (!input) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      const cards = document.querySelectorAll(".card.card--media");
      if (cards.length) {
        cards.forEach((card) => {
          const titleEl = card.querySelector(".card-title");
          const title = titleEl ? titleEl.textContent.trim().toLowerCase() : "";
          card.style.display = title.includes(q) ? "" : "none";
        });
        return;
      }

      const isPages = location.pathname.includes("/pages/");
      const catalogUrl = isPages ? `catalog.html?q=${encodeURIComponent(q)}`
                                : `pages/catalog.html?q=${encodeURIComponent(q)}`;
      location.href = catalogUrl;
    });
  });

  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || "").trim().toLowerCase();
  if (q) {
    const cards = document.querySelectorAll(".card.card--media");
    cards.forEach((card) => {
      const titleEl = card.querySelector(".card-title");
      const title = titleEl ? titleEl.textContent.trim().toLowerCase() : "";
      card.style.display = title.includes(q) ? "" : "none";
    });

    const anySearch = document.querySelector('input[type="search"]');
    if (anySearch) anySearch.value = params.get("q");
  }
});



