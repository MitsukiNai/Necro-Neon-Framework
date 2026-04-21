import type { TimelineEvent } from '../types/index.js';
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
export declare class NNTimeline {
    constructor(root: HTMLElement, events: TimelineEvent[]);
}
//# sourceMappingURL=nn-timeline.d.ts.map