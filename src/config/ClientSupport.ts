const getUserAgentData = (): { mobile?: boolean } | undefined => {
  return (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
};

const isForcedDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const queryForce = params.get('forceDesktop');
  if (queryForce === '1') {
    sessionStorage.setItem('forceDesktop', '1');
    return true;
  }
  return sessionStorage.getItem('forceDesktop') === '1';
};

export const isDesktopSupported = (): boolean => {
  if (isForcedDesktop()) return true;

  const ua = navigator.userAgent || navigator.vendor || '';
  const uaDataMobile = getUserAgentData()?.mobile ?? false;
  const touchPoints = navigator.maxTouchPoints ?? 0;
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const macTouch = /macintosh/i.test(ua) && touchPoints > 1; // iPad on iOS 13+ often reports Macintosh

  // If the browser itself says it's mobile, trust that.
  if (uaDataMobile) return false;

  // Obvious mobile UAs (including iPad/iPhone/Android)
  if (mobileRegex.test(ua)) return false;

  // iPad masquerading as Mac
  if (macTouch) return false;

  // Otherwise, treat as desktop (be permissive to avoid false negatives on hybrids).
  return true;
};

export const showUnsupportedOverlay = (
  overlayId = 'unsupported',
  gameContainerId = 'game-container'
): void => {
  const unsupported = document.getElementById(overlayId);
  const gameContainer = document.getElementById(gameContainerId);

  if (gameContainer) {
    gameContainer.style.display = 'none';
  }
  if (!unsupported) return;

  unsupported.classList.add('visible');
  unsupported.innerHTML = `
    <div class="unsupported-card">
      <div class="orbit">
        <div class="planet"></div>
        <div class="satellite"></div>
        <div class="satellite"></div>
      </div>
      <h1>Desktop required</h1>
      <p>3Siege is best experienced on a desktop browser. Please switch to a larger screen to storm the arena.</p>
      <p style="opacity: 0.8;">(Mobile support is planned — stay tuned!)</p>
    </div>
  `;
};

export const hideUnsupportedOverlay = (
  overlayId = 'unsupported',
  gameContainerId = 'game-container'
): void => {
  const unsupported = document.getElementById(overlayId);
  const gameContainer = document.getElementById(gameContainerId);

  if (unsupported) {
    unsupported.classList.remove('visible');
    unsupported.innerHTML = '';
  }
  if (gameContainer) {
    gameContainer.style.display = 'flex';
  }
};

