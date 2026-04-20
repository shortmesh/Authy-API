(function () {
  // Resolve the base URL from the script tag itself so that icon paths always
  // point back to the host, even when the widget is embedded on an
  // external domain. Falls back to the page origin if currentScript is unavailable.
  const _scriptSrc =
    (document.currentScript && document.currentScript.src) || "";
  const BASE_URL = _scriptSrc
    ? _scriptSrc.substring(0, _scriptSrc.lastIndexOf("/") + 1)
    : "/";

  const PLATFORM_REGISTRY = {
    wa: {
      label: "WhatsApp",
      icon: BASE_URL + "Whatsapp.svg",
    },
    telegram: {
      label: "Telegram",
      icon: BASE_URL + "Telegram.svg",
    },
    signal: {
      label: "Signal",
      icon: BASE_URL + "Signal.svg",
    },
  };
  let widgetConfig = {
    endpoints: {
      platforms: null,
    },
    onSelect: function () {},
    onError: function () {},
  };

  function createWidget(config = {}) {
    widgetConfig.endpoints = config.endpoints || {};
    widgetConfig.onSelect = config.onSelect || function () {};
    widgetConfig.onError = config.onError || function () {};

    if (!widgetConfig.endpoints.platforms) {
      console.error("ShortMesh: platforms endpoint is required");
      return;
    }

    const shadowHost = document.createElement("div");
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });
    document.body.appendChild(shadowHost);

    injectStyles(shadowRoot);

    const overlay = document.createElement("div");
    overlay.id = "shortmesh-overlay";

    overlay.innerHTML = `
      <div class="shortmesh-modal">
        <div class="shortmesh-close">&times;</div>
        <div id="shortmesh-content"></div>
      </div>
    `;

    shadowRoot.appendChild(overlay);

    const content = overlay.querySelector("#shortmesh-content");
    const closeBtn = overlay.querySelector(".shortmesh-close");

    closeBtn.onclick = () => shadowHost.remove();

    async function fetchPlatforms() {
      const response = await fetch(widgetConfig.endpoints.platforms);

      if (!response.ok) {
        throw new Error("Failed to fetch platforms");
      }

      return response.json();
    }

    /* ---------------- UI SCREENS ---------------- */

    async function renderSelect() {
      let platformsFromAPI = [];

      try {
        platformsFromAPI = await fetchPlatforms();
      } catch (err) {
        widgetConfig.onError(err);
        content.innerHTML =
          "<p>Failed to load platforms. Contact support for assistance.</p>";
        return;
      }

      const supportedPlatformsArray = platformsFromAPI.filter(
        (p) => PLATFORM_REGISTRY[p.platform],
      );

      if (supportedPlatformsArray.length === 0) {
        const apiIds = platformsFromAPI.map((p) => p.platform).join(", ");
        console.error("ShortMesh: No platforms found. API returned:", apiIds);
        content.innerHTML = `
    <h2>Verify your account</h2>
    <p>No available verification methods. Contact support for assistance.</p>
    <div class="shortmesh-footer">Powered by Shortmesh</div>
  `;
        return;
      }

      const supportedPlatforms = supportedPlatformsArray
        .map((p) => {
          const registry = PLATFORM_REGISTRY[p.platform];

          return `
      <div class="shortmesh-platform" data-platform="${p.platform}">
        <span class="icon">
          <img style="width: 26px; height: 26px; margin: auto;" 
               src="${registry.icon}" 
               alt="${registry.label}" />
        </span>
        ${registry.label}
      </div>
    `;
        })
        .join("");
      content.innerHTML = `
  <h2>Verify your account</h2>
  <p>Select where you'd like to receive your code.</p>

  <div class="shortmesh-platform-list">
    ${supportedPlatforms}
  </div>

  <div class="shortmesh-buttons">
    <button class="btn secondary">Cancel</button>
    <button class="btn primary" disabled>Continue</button>
  </div>

  <div class="shortmesh-footer">Powered by Shortmesh</div>
`;

      let selected = null;
      const platforms = content.querySelectorAll(".shortmesh-platform");
      const continueBtn = content.querySelector(".primary");

      platforms.forEach((el) => {
        el.onclick = () => {
          platforms.forEach((p) => p.classList.remove("active"));
          el.classList.add("active");
          selected = el.dataset.platform;
          continueBtn.disabled = false;
        };
      });

      content.querySelector(".secondary").onclick = () => shadowHost.remove();

      continueBtn.onclick = () => {
        if (!selected) return;
        widgetConfig.onSelect(selected);
        shadowHost.remove();
      };
    }

    renderSelect();
  }

  function injectStyles(root) {
    const style = document.createElement("style");
    style.innerHTML = `
      #shortmesh-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Inter, sans-serif;
        padding: 16px;
      }

      .shortmesh-modal {
        background: #f3f3f3;
        width: 100%;
        max-width: 360px;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        text-align: center;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }

      @media (max-width: 480px) {
        .shortmesh-modal {
          padding: 20px;
          border-radius: 12px;
        }
      }

      .shortmesh-close {
        position: absolute;
        right: 18px;
        top: 14px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        color: #101010;
      }

      h2 {
        margin-bottom: 8px;
        font-size: 24px;
        color: #101010;
      }

      @media (max-width: 480px) {
        h2 {
          font-size: 20px;
        }
      }

      p {
        font-size: 14px;
        color: #555;
        margin-bottom: 20px;
      }

      @media (max-width: 480px) {
        p {
          font-size: 13px;
        }
      }

      .shortmesh-platform-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .shortmesh-platform {
        padding: 14px;
        border-radius: 10px;
        background: #fff;
        color: #333;
        font-size: 16px;
        border: 1px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .shortmesh-platform.active {
        border: 2px solid #4b5bdc;
      }

      .icon {
        font-size: 20px;
      }

      .shortmesh-buttons {
        display: flex;
        gap: 12px;
      }

      .btn {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }

      .btn.primary {
        background: #4b5bdc;
        color: white;
      }

      .btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn.secondary {
        background: #e6e6e6;
        color: #333;
      }

      .shortmesh-footer {
        font-size: 12px;
        color: #777;
        margin-top: 16px;
      }
    `;
    root.appendChild(style);
  }

  window.ShortMeshWidget = {
    open: createWidget,
  };
})();
