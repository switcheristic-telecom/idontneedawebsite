import { showAboutWindow } from '../../data/store';
import { AboutPane } from './AboutPane';
import { IconMail } from '../VistaIcons';

export function AboutWindow() {
  if (!showAboutWindow.value) return null;

  return (
    <div class='aw-overlay' onClick={() => (showAboutWindow.value = false)}>
      <div class='aw-dialog' onClick={(e) => e.stopPropagation()}>
        {/* Title bar */}
        <div class='ab-titlebar'>
          <span class='ab-titlebar-icon'><IconMail /></span>
          <span class='ab-titlebar-text'>Read Me First - idontneedawebsite Mail</span>
          <div class='window-controls'>
            <button class='wc-btn wc-minimize' title='Minimize' aria-label='Minimize'>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <line x1="1" y1="7" x2="9" y2="7" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                <line x1="1" y1="7" x2="9" y2="7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <button class='wc-btn wc-maximize' title='Maximize' aria-label='Maximize'>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#333333" stroke-width="2.5" />
                <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#fff" stroke-width="1.5" />
              </svg>
            </button>
            <button
              class='wc-btn wc-close'
              title='Close'
              aria-label='Close'
              onClick={() => (showAboutWindow.value = false)}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div class='aw-content'>
          <AboutPane />
        </div>
      </div>
    </div>
  );
}
