import { showAboutWindow } from '../../data/store';
import { AboutPane } from './AboutPane';
import { IconMail, IconMinimize, IconMaximize, IconClose } from '../VistaIcons';

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
              <IconMinimize />
            </button>
            <button class='wc-btn wc-maximize' title='Maximize' aria-label='Maximize'>
              <IconMaximize />
            </button>
            <button
              class='wc-btn wc-close'
              title='Close'
              aria-label='Close'
              onClick={() => (showAboutWindow.value = false)}
            >
              <IconClose />
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
