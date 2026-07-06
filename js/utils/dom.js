export const $ = (selector, context = document) => context.querySelector(selector);

export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export const createElement = (tag, attrs = {}, children = []) => {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });
  return element;
};

export const show = (element) => {
  if (typeof element === 'string') element = $(element);
  element.style.display = '';
};

export const hide = (element) => {
  if (typeof element === 'string') element = $(element);
  element.style.display = 'none';
};

export const enable = (element) => {
  if (typeof element === 'string') element = $(element);
  element.disabled = false;
};

export const disable = (element) => {
  if (typeof element === 'string') element = $(element);
  element.disabled = true;
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
