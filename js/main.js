// Основний скрипт для динамічного наповнення сторінки ДЮСШ‑21

document.addEventListener('DOMContentLoaded', () => {
  // Завантажити JSON із даними
  fetch('data/site.json')
    .then(response => response.json())
    .then(data => {
      populateHero(data);
      populateAbout(data);
      populateAdministration(data);
      populateBase(data);
      populateCoaches(data);
      populateNews(data);
      populateContacts(data);
    })
    .catch(err => {
      console.error('Помилка завантаження даних', err);
    });

  setupNavToggle();
  setupForm();
});

function populateHero(data) {
  const titleEl = document.getElementById('hero-title');
  const subEl = document.getElementById('hero-subtitle');
  if (data.hero_title) titleEl.textContent = data.hero_title;
  if (data.hero_subtitle) subEl.textContent = data.hero_subtitle;
}

function populateAbout(data) {
  const aboutEl = document.getElementById('about-text');
  if (data.about) {
    aboutEl.textContent = data.about;
  }
}

function createPersonCard(person) {
  const card = document.createElement('div');
  card.className = 'person-card';
  const img = document.createElement('img');
  img.src = person.photo || '';
  img.alt = person.name;
  const body = document.createElement('div');
  body.className = 'person-body';
  const name = document.createElement('div');
  name.className = 'person-name';
  name.textContent = person.name;
  const role = document.createElement('div');
  role.className = 'person-role';
  role.textContent = person.role + (person.department ? ` – ${person.department}` : '');
  const desc = document.createElement('div');
  desc.className = 'person-desc';
  desc.textContent = person.description || '';
  body.appendChild(name);
  body.appendChild(role);
  body.appendChild(desc);
  card.appendChild(img);
  card.appendChild(body);
  return card;
}

function populateAdministration(data) {
  const listEl = document.getElementById('administration-list');
  listEl.innerHTML = '';
  (data.administration || []).forEach(person => {
    listEl.appendChild(createPersonCard(person));
  });
}

function createBaseCard(obj) {
  const card = document.createElement('div');
  card.className = 'base-card';
  const img = document.createElement('img');
  img.src = obj.photo || '';
  img.alt = obj.name;
  const body = document.createElement('div');
  body.className = 'base-body';
  const name = document.createElement('div');
  name.className = 'base-name';
  name.textContent = obj.name;
  const desc = document.createElement('div');
  desc.className = 'base-desc';
  desc.textContent = obj.description || '';
  body.appendChild(name);
  body.appendChild(desc);
  card.appendChild(img);
  card.appendChild(body);
  return card;
}

function populateBase(data) {
  const listEl = document.getElementById('base-list');
  listEl.innerHTML = '';
  (data.base || []).forEach(item => {
    listEl.appendChild(createBaseCard(item));
  });
}

function populateCoaches(data) {
  const listEl = document.getElementById('coaches-list');
  const filtersEl = document.getElementById('coach-filters');
  listEl.innerHTML = '';
  filtersEl.innerHTML = '';
  const coaches = data.coaches || [];
  // Отримати унікальні відділи
  const departments = Array.from(new Set(coaches.map(c => c.department)));
  // Додати кнопку "Всі"
  createFilterButton('Всі', true);
  departments.forEach(dep => createFilterButton(dep, false));

  function createFilterButton(name, active) {
    const btn = document.createElement('button');
    btn.textContent = name;
    if (active) btn.classList.add('active');
    btn.addEventListener('click', () => {
      // встановити активність
      filtersEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList(name === 'Всі' ? null : name);
    });
    filtersEl.appendChild(btn);
  }

  function renderList(filterDep) {
    listEl.innerHTML = '';
    coaches
      .filter(c => !filterDep || c.department === filterDep)
      .forEach(c => {
        listEl.appendChild(createPersonCard(c));
      });
  }
  // Первинний рендер усіх тренерів
  renderList(null);
}

function createNewsCard(post) {
  const card = document.createElement('div');
  card.className = 'news-card';
  const img = document.createElement('img');
  img.src = post.photo || '';
  img.alt = post.title;
  const body = document.createElement('div');
  body.className = 'news-body';
  const date = document.createElement('div');
  date.className = 'news-date';
  // Форматуємо дату у формат DD.MM.YYYY
  const d = new Date(post.date);
  if (!isNaN(d)) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth()+1).padStart(2, '0');
    const yyyy = d.getFullYear();
    date.textContent = `${dd}.${mm}.${yyyy}`;
  } else {
    date.textContent = post.date;
  }
  const title = document.createElement('div');
  title.className = 'news-title';
  title.textContent = post.title;
  const excerpt = document.createElement('div');
  excerpt.className = 'news-excerpt';
  excerpt.textContent = post.excerpt;
  const link = document.createElement('a');
  link.className = 'news-link';
  link.textContent = 'Читати далі';
  link.href = post.link || '#';
  link.target = '_blank';
  body.appendChild(date);
  body.appendChild(title);
  body.appendChild(excerpt);
  body.appendChild(link);
  card.appendChild(img);
  card.appendChild(body);
  return card;
}

function populateNews(data) {
  const listEl = document.getElementById('news-list');
  listEl.innerHTML = '';
  (data.news || []).forEach(post => {
    listEl.appendChild(createNewsCard(post));
  });
}

function populateContacts(data) {
  const addrEl = document.getElementById('contact-address');
  const phoneEl = document.getElementById('contact-phone');
  const emailEl = document.getElementById('contact-email');
  if (data.contacts) {
    addrEl.textContent = data.contacts.address || '';
    if (data.contacts.phone) {
      phoneEl.textContent = data.contacts.phone;
      phoneEl.href = `tel:${data.contacts.phone.replace(/\s+/g, '')}`;
    }
    if (data.contacts.email) {
      emailEl.textContent = data.contacts.email;
      emailEl.href = `mailto:${data.contacts.email}`;
    }
  }
  // Рік у футері
  document.getElementById('year').textContent = new Date().getFullYear();
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#nav ul');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
  }
  // Закриття меню при кліку на пункт
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
    });
  });
}

function setupForm() {
  const form = document.getElementById('signup-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', () => {
      // Просте повідомлення, без відправки
      status.textContent = 'Дякуємо! Ваша заявка надіслана.';
      status.style.color = 'var(--color-primary)';
      // Скинути форму
      form.reset();
    });
  }
}