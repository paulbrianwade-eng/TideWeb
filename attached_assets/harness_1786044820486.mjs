import { JSDOM } from 'jsdom';
import fs from 'node:fs';

export const boot = async (htmlPath) => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://tide.local/',
  });
  const { window } = dom;
  window.scrollTo = () => {};
  window.print = () => {};
  window.addEventListener('error', (e) => errors.push(`window.error: ${e.message}`));
  const origError = window.console.error;
  window.console.error = (...args) => {
    const msg = args.map(String).join(' ');
    if (!msg.includes('not implemented')) errors.push(`console.error: ${msg.slice(0, 240)}`);
    origError.apply(window.console, args);
  };
  await tick(window, 300);
  return { window, doc: window.document, errors };
};

export const tick = (window, ms = 60) =>
  new Promise((r) => window.setTimeout(r, ms));

const visibleText = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();

export const buttons = (doc) => [...doc.querySelectorAll('button')];

export const findButton = (doc, text, { exact = false } = {}) =>
  buttons(doc).find((b) => {
    const t = visibleText(b);
    return exact ? t === text : t.toLowerCase().includes(text.toLowerCase());
  });

export const click = async (window, el, label = '') => {
  if (!el) throw new Error(`No se encontró el elemento para clickear: ${label}`);
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  await tick(window);
};

export const setInput = async (window, input, value) => {
  const proto = input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await tick(window);
};

export const bodyText = (doc) => visibleText(doc.getElementById('root'));

export const has = (doc, text) => bodyText(doc).toLowerCase().includes(text.toLowerCase());
