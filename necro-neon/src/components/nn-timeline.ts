// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-timeline component
// ================================================================

import type { TimelineEvent, NNColor } from '../types/index.js';
import { escapeHtml } from '../security/index.js';

const COLOR_CLASS: Record<NNColor, string> = {
  primary: 'timeline-dot--primary',
  accent:  'timeline-dot--accent',
  danger:  'timeline-dot--danger',
  warn:    'timeline-dot--warn',
  safe:    'timeline-dot--safe',
  purple:  'timeline-dot--purple',
  ghost:   'timeline-dot--ghost',
};

/**
 * NNTimeline — builds a vertical event timeline.
 *
 * @example
 * new NNTimeline(container, [
 *   { date: '2077.01.01', title: 'System boot',       color: 'safe' },
 *   { date: '2077.03.15', title: 'Infestation begins', color: 'danger',
 *     body: 'Sector 7 quarantined. Citizens advised to evacuate.' },
 * ]);
 */
export class NNTimeline {
  constructor(root: HTMLElement, events: TimelineEvent[]) {
    root.className = 'nn-timeline';

    events.forEach((ev) => {
      const item = document.createElement('div');
      item.className = 'nn-timeline-item';

      // Dot
      const dot = document.createElement('div');
      dot.className = `nn-timeline-dot ${COLOR_CLASS[ev.color ?? 'primary']}`;
      dot.setAttribute('aria-hidden', 'true');

      // Content
      const content = document.createElement('div');
      content.className = 'nn-timeline-content';

      const dateEl = document.createElement('div');
      dateEl.className   = 'nn-timeline-date nn-mono nn-micro';
      dateEl.textContent = escapeHtml(ev.date);

      const titleEl = document.createElement('div');
      titleEl.className   = 'nn-timeline-title nn-h4 neon-glow';
      titleEl.textContent = escapeHtml(ev.title);

      content.appendChild(dateEl);
      content.appendChild(titleEl);

      if (ev.body) {
        const bodyEl = document.createElement('p');
        bodyEl.className   = 'nn-body mt-1';
        bodyEl.textContent = escapeHtml(ev.body);
        content.appendChild(bodyEl);
      }

      item.appendChild(dot);
      item.appendChild(content);
      root.appendChild(item);
    });
  }
}
