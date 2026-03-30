import { showWelcomePopup } from '../../data/store';
import { IconMail, IconClose } from '../VistaIcons';

export function WelcomePopup() {
  if (!showWelcomePopup.value) return null;

  const dismiss = () => {
    showWelcomePopup.value = false;
  };

  return (
    <div class='wp-overlay'>
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
              <IconClose />
            </button>
          </div>
        </div>
        <div class='wp-body'>
          <p>
            <b>idontneedawebsite.us</b> is an archive of spam received after
            registering a .US domain, which publicly exposes every registrant's
            contact information by law.
          </p>
          <p style={{ marginTop: '4px' }}>
            This inbox covers Jan 2024 – {__LATEST_EMAIL_DATE__} (updating).
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
