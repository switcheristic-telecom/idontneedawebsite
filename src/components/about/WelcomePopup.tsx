import { showWelcomePopup } from '../../data/store';
import { IconMail } from '../VistaIcons';

export function WelcomePopup() {
  if (!showWelcomePopup.value) return null;

  const dismiss = () => {
    showWelcomePopup.value = false;
  };

  return (
    <div class='wp-overlay' onClick={dismiss}>
      <div class='wp-dialog' onClick={(e) => e.stopPropagation()}>
        <div class='ab-titlebar'>
          <span class='ab-titlebar-icon'><IconMail /></span>
          <span class='ab-titlebar-text'>idontneedawebsite Mail</span>
          <div class='window-controls'>
            <button
              class='wc-btn wc-close'
              title='Close'
              aria-label='Close'
              onClick={dismiss}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div class='wp-body'>
          <p>
            <b>idontneedawebsite.us</b> is an archive of spam received after
            registering a .US domain, which publicly exposes every registrant's
            contact information by law.
          </p>
          <p class='wp-attribution'>
            A{' '}
            <a href='https://swtch.tel' target='_blank'>
              Switcheristic Telecommunications
            </a>{' '}
            project, made by{' '}
            <a href='https://yufengzhao.com' target='_blank'>
              Yufeng
            </a>
          </p>
          <button class='wp-ok' onClick={dismiss}>OK</button>
        </div>
      </div>
    </div>
  );
}
