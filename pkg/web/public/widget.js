(function () {
  let widgetConfig = {
    endpoints: {
      platforms: null,
    },
    onSelect: function () {},
    onError: function () {},
  };

  function normalizePlatform(raw) {
    if (typeof raw === "string") {
      const key = raw.toLowerCase();
      return {
        name: key,
        display_name: key.charAt(0).toUpperCase() + key.slice(1),
        icon_url: "",
      };
    }

    if (raw && typeof raw === "object") {
      const key = String(raw.name || "").toLowerCase();
      if (!key) return null;
      return {
        name: key,
        display_name:
          String(raw.display_name || "").trim() ||
          key.charAt(0).toUpperCase() + key.slice(1),
        icon_url: String(raw.icon_url || "").trim(),
      };
    }

    return null;
  }

  function pickFirstColor(candidates) {
    for (const candidate of candidates) {
      const color = String(candidate || "").trim();
      if (!color) continue;
      if (window.CSS && typeof window.CSS.supports === "function") {
        if (window.CSS.supports("color", color)) return color;
      } else {
        return color;
      }
    }
    return "";
  }

  function resolvePrimaryColor(config) {
    const fromConfig = pickFirstColor([
      config?.primaryColor,
      config?.theme?.primaryColor,
      config?.theme?.primary,
    ]);
    if (fromConfig) return fromConfig;

    const rootStyles = window.getComputedStyle(document.documentElement);
    const fromVars = pickFirstColor([
      rootStyles.getPropertyValue("--primary-color"),
      rootStyles.getPropertyValue("--color-primary"),
      rootStyles.getPropertyValue("--brand-primary"),
      rootStyles.getPropertyValue("--mui-palette-primary-main"),
      rootStyles.getPropertyValue("--bs-primary"),
    ]);
    if (fromVars) return fromVars;

    return "#4b5bdc";
  }

  function parseCssColorToRgb(color) {
    const probe = document.createElement("span");
    probe.style.color = "";
    probe.style.color = color;
    if (!probe.style.color) return null;

    document.body.appendChild(probe);
    const computed = window.getComputedStyle(probe).color;
    probe.remove();

    const match = computed.match(
      /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i,
    );
    if (!match) return null;

    return {
      r: Math.max(0, Math.min(255, Number(match[1]))),
      g: Math.max(0, Math.min(255, Number(match[2]))),
      b: Math.max(0, Math.min(255, Number(match[3]))),
    };
  }

  function getAccessibleTextColor(backgroundColor) {
    const rgb = parseCssColorToRgb(backgroundColor);
    if (!rgb) return "#ffffff";

    const toLinear = (channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const luminance =
      0.2126 * toLinear(rgb.r) +
      0.7152 * toLinear(rgb.g) +
      0.0722 * toLinear(rgb.b);

    const contrastWithWhite = 1.05 / (luminance + 0.05);
    const contrastWithBlack = (luminance + 0.05) / 0.05;
    return contrastWithBlack >= contrastWithWhite ? "#111111" : "#ffffff";
  }

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

    const primaryColor = resolvePrimaryColor(config);
    const primaryTextColor = getAccessibleTextColor(primaryColor);
    injectStyles(shadowRoot, primaryColor, primaryTextColor);

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

      const supportedPlatformsArray = Array.isArray(platformsFromAPI)
        ? platformsFromAPI.map(normalizePlatform).filter(Boolean)
        : [];

      if (supportedPlatformsArray.length === 0) {
        const apiIds = Array.isArray(platformsFromAPI)
          ? platformsFromAPI.map((p) => JSON.stringify(p)).join(", ")
          : String(platformsFromAPI);
        console.error("ShortMesh: No platforms found. API returned:", apiIds);
        content.innerHTML = `
    <h2>Verify your account</h2>
    <p>No available verification methods. Contact support for assistance.</p>
    <div class="shortmesh-footer">Powered by Shortmesh</div>
  `;
        return;
      }

      const supportedPlatforms = supportedPlatformsArray
        .map((platform) => {
          const safeName = String(platform.name || "");
          const safeDisplayName = String(platform.display_name || safeName);
          const icon = String(platform.icon_url || "");
          const encodedPlatform = encodeURIComponent(
            JSON.stringify({
              name: safeName,
              display_name: safeDisplayName,
              icon_url: icon,
            }),
          );

          return `
      <div class="shortmesh-platform" data-platform="${encodedPlatform}">
        <span class="icon">
          <img style="width: 26px; height: 26px; margin: auto;" 
               src="${icon}" 
               alt="${safeDisplayName}" />
        </span>
        ${safeDisplayName}
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
          selected = JSON.parse(decodeURIComponent(el.dataset.platform || "{}"));
          continueBtn.disabled = false;
        };
      });

      content.querySelector(".secondary").onclick = () => shadowHost.remove();

      continueBtn.onclick = () => {
        if (!selected || !selected.name) return;
        widgetConfig.onSelect(selected);
        shadowHost.remove();
      };
    }

    renderSelect();
  }

  function injectStyles(root, primaryColor, primaryTextColor) {
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
        border: 2px solid ${primaryColor};
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
        background: ${primaryColor};
        color: ${primaryTextColor};
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
