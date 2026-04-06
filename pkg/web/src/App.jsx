import { useState, useEffect, useRef } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./App.css";

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="logo-mark">◈</span>
        <span>Authy</span>
      </div>
      <div className="nav-links">
        {/* <a
          href="https://github.com/shortmesh/Widgets"
          target="_blank"
          rel="noopener noreferrer"
        >
          Widget
        </a> */}
        <a href="#how">How it works</a>
        <a
          href="https://github.com/shortmesh/Authy-API"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">Phone Number Verification</div>
        <h1>Authy - Shortmesh</h1>
        <p className="hero-sub">
          Authy is an open-source OTP service that generates, delivers, and
          verifies one-time passwords over the messaging platforms your users
          already trust using the Shortmesh API
        </p>
        <div className="hero-actions">
          <a
            href="https://github.com/shortmesh/Authy-API"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Get the API
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-demo-panel">
          {/* <img
            src="https://raw.githubusercontent.com/shortmesh/Widgets/main/1.svg"
            alt="ShortMesh widget platform picker"
            className="hero-widget-badge"
          /> */}
          <DemoCard />
          <p className="demo-privacy">
            We do not collect or store phone numbers submitted in this demo.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── How it Works ────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Host Your Instance",
    body: "Deploy your own Authy instance. It's open-source and self-hostable — you own the infrastructure and the data.",
    lang: "shell",
    codeLabel: "Authy-API",
    code: `git clone https://github.com/shortmesh/Authy-API
make setup && make migrate-up
make run`,
  },
  {
    n: "02",
    title: "Embed the Widget",
    body: "The widget comes bundled with your Authy instance. Drop one script tag into your page referencing your own API — no build step, no dependencies.",
    lang: "html",
    code: `<script src="https://yourapi.com/widget.js"></script>`,
  },
  {
    n: "03",
    title: "User Picks a Platform",
    body: "The widget fetches available platforms from your API and shows a clean modal. The user selects their preferred messaging app to receive the code.",
    lang: "js",
    code: `onSelect: (platform) => {
  // "wa" | "telegram" | "signal"
  sendOTP(phone, platform)
}`,
  },
  {
    n: "04",
    title: "Send & Verify the OTP",
    body: "Your hosted Authy API generates and delivers the code. The user enters it and you verify phone number, job done.",
    lang: "http",
    code: `POST /api/v1/otp/generate
POST /api/v1/otp/verify`,
  },
];

// Code content is hardcoded constants — dangerouslySetInnerHTML is safe here.
function highlight(raw, lang) {
  let s = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "shell") {
    s = s
      .replace(/(https?:\/\/\S+)/g, '<span class="hl-str">$1</span>')
      .replace(/^(git|make)\b/gm, '<span class="hl-kw">$1</span>')
      .replace(
        /\b(clone|setup|migrate-up|run)\b/g,
        '<span class="hl-fn">$1</span>',
      )
      .replace(/(&amp;&amp;)/g, '<span class="hl-op">$1</span>');
  }

  if (lang === "http") {
    s = s
      .replace(
        /^(POST|GET|PUT|DELETE|PATCH)\b/gm,
        '<span class="hl-kw">$1</span>',
      )
      .replace(/(\/(api|v1)[^\s]*)/g, '<span class="hl-path">$1</span>')
      .replace(/"([^"]+)"(\s*:)/g, '<span class="hl-key">"$1"</span>$2')
      .replace(/:\s*"([^"]+)"/g, ': <span class="hl-str">"$1"</span>');
  }

  if (lang === "html") {
    s = s
      .replace(/="(https?:\/\/[^"]+)"/g, '=<span class="hl-str">"$1"</span>')
      .replace(/&lt;(\/?[a-z]+)/gi, '&lt;<span class="hl-tag">$1</span>');
  }

  if (lang === "js") {
    const saved = [];
    s = s.replace(/\/\/[^\n]*/g, (m) => {
      saved.push(m);
      return "\x01";
    });
    s = s
      .replace(/"([^"]*)"/g, '<span class="hl-str">"$1"</span>')
      .replace(/\b(\w+)(?=\s*:)/g, '<span class="hl-key">$1</span>')
      .replace(/=&gt;/g, '<span class="hl-op">=&gt;</span>')
      .replace(
        /\b(ShortMeshWidget|sendOTP)\b/g,
        '<span class="hl-fn">$1</span>',
      );
    s = s.replace(
      /\x01/g,
      () => `<span class="hl-comment">${saved.shift()}</span>`,
    );
  }

  if (lang === "kotlin") {
    const saved = [];
    s = s.replace(/\/\/[^\n]*/g, (m) => {
      saved.push(m);
      return "\x01";
    });
    s = s
      .replace(/"([^"]*)"/g, '<span class="hl-str">"$1"</span>')
      .replace(/\b(\w+)(\s+=\s)/g, '<span class="hl-attr">$1</span>$2')
      .replace(
        /\b(import|val|var|fun|object|return|this)\b/g,
        '<span class="hl-kw">$1</span>',
      )
      .replace(/-&gt;/g, '<span class="hl-op">-&gt;</span>')
      .replace(
        /\b(ShortMeshWidget|WidgetConfig|sendOTP)\b/g,
        '<span class="hl-fn">$1</span>',
      );
    s = s.replace(
      /\x01/g,
      () => `<span class="hl-comment">${saved.shift()}</span>`,
    );
  }

  return s;
}

// Setup steps shown in the two-column block
const SETUP_STEPS = [
  {
    n: "01",
    title: "Host Your Authy Instance",
    body: "Clone the open-source Authy API, run setup and migrations, then start the server.",
  },
  {
    n: "02",
    title: "Link a Messaging Account",
    body: "Register a WhatsApp, Telegram, or Signal device as the sender account. Users will receive OTPs from this number.",
  },
  {
    n: "03",
    title: "Embed the Widget",
    body: "Drop one script tag into your page pointing to your own API domain.",
  },
  {
    n: "04",
    title: "Send & Verify OTPs",
    body: "Call two endpoints — generate sends the code, verify confirms it. Phone number ownership proved, job done.",
  },
];

// Hardcoded constant — safe to use dangerouslySetInnerHTML
const SETUP_SNIPPET = `# 1. Clone & start your Authy instance
git clone https://github.com/shortmesh/Authy-API
make setup && make migrate-up
make run

# 2. Link a messaging device (e.g. WhatsApp)
POST http://localhost:8000/api/v1/devices
{ "platform": "wa", "phone_number": "+1234567890" }

# 3. Drop the widget into your page (List platforms)
# widget.js is served directly from your Authy instance
<script src="http://localhost:8000/widget.js"></script>
ShortMeshWidget.open({
  endpoints: { platforms: "http://localhost:8000/api/platforms" },
  onSelect: (platform) => sendOTP(phone, platform),
})

# 4. Generate & verify the OTP
POST http://localhost:8000/api/v1/otp/generate   { phone_number, platform, device_id }
POST http://localhost:8000/api/v1/otp/verify     { phone_number, platform, code, device_id }`;

function highlightSetup(raw) {
  let s = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Save comments — restore last so they don't get re-processed
  const comments = [];
  s = s.replace(/#[^\n]*/g, (m) => {
    comments.push(m);
    return "\x01";
  });

  // 2. Strings in quotes — MUST run before any span tags are inserted,
  //    otherwise the class="..." attribute values get matched too.
  s = s.replace(/"([^"]*)"/g, "\x02$1\x03");

  // 3. HTTP verbs
  s = s.replace(
    /\b(POST|GET|PUT|DELETE|PATCH)\b/g,
    '<span class="hl-kw">$1</span>',
  );
  // 4. API paths
  s = s.replace(/(\/api\/v1[^\s,}]*)/g, '<span class="hl-path">$1</span>');
  // 5. Shell keywords
  s = s.replace(/^(git|make)\b/gm, '<span class="hl-kw">$1</span>');
  s = s.replace(
    /\b(clone|setup|migrate-up|run)\b/g,
    '<span class="hl-fn">$1</span>',
  );
  // 6. JS identifiers
  s = s.replace(
    /\b(ShortMeshWidget|sendOTP)\b/g,
    '<span class="hl-fn">$1</span>',
  );
  // 7. Object keys
  s = s.replace(
    /\b(endpoints|platforms|onSelect|phone_number|platform|code|device_id)(?=:)/g,
    '<span class="hl-key">$1</span>',
  );
  // 8. Script tag
  s = s.replace(/&lt;(\/?script)/gi, '&lt;<span class="hl-tag">$1</span>');

  // 9. Flush string placeholders into spans (safe — no more quote-based regexes)
  s = s.replace(/\x02([^\x03]*)\x03/g, '<span class="hl-str">"$1"</span>');

  // 10. Restore comments
  s = s.replace(
    /\x01/g,
    () => `<span class="hl-comment">${comments.shift()}</span>`,
  );

  return s;
}

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="section-label">How it works</div>
      {/* ── Two-column setup block ──────────────────────────────── */}
      <div className="how-setup">
        <div className="how-setup-steps">
          <h2>From setup to verified</h2>

          {SETUP_STEPS.map((s) => (
            <div className="how-setup-step" key={s.n}>
              <div className="step-n">{s.n}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
          <a
            href="https://github.com/shortmesh/Authy-API"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Full setup guide on GitHub →
          </a>
        </div>
        <div className="how-setup-code">
          <div className="how-setup-code-header">
            <span>authy-setup</span>
          </div>
          {/* content is a hardcoded constant, not user input */}
          <pre
            className="how-setup-pre"
            dangerouslySetInnerHTML={{ __html: highlightSetup(SETUP_SNIPPET) }}
          />
        </div>
      </div>

      {/* ── Widget / flow steps grid ──────────────────────────────── */}
      {/* <div className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <div className="step-n">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.codeLabel && (
              <div className="step-code-label">{s.codeLabel}</div>
            )}
            <pre
              className="step-code"
              dangerouslySetInnerHTML={{ __html: highlight(s.code, s.lang) }}
            />
            {s.code2 && (
              <>
                <div className="step-code-label" style={{ marginTop: "12px" }}>
                  {s.code2Label}
                </div>
                <pre
                  className="step-code"
                  dangerouslySetInnerHTML={{
                    __html: highlight(s.code2, s.lang),
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div> */}
      {/* <div className="how-docs">
        <a
          href="https://beta.shortmesh.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Read the full documentation →
        </a>
      </div> */}
    </section>
  );
}

// ─── Demo ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

function useWidgetScript() {
  useEffect(() => {
    // Always remove and re-add so the latest widget version is fetched
    const existing = document.getElementById("shortmesh-widget-script");
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.id = "shortmesh-widget-script";
    // Load widget.js from the base path
    s.src = `${import.meta.env.BASE_URL}widget.js?v=${Date.now()}`;
    document.body.appendChild(s);
  }, []);
}

function OTPInputs({ value, onChange, disabled }) {
  const inputs = useRef([]);

  function handleChange(i, e) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(6, " ").split("");
    chars[i] = digit || " ";
    const next = chars.join("").trimEnd();
    onChange(next.slice(0, 6));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (value[i]) {
        const chars = value.padEnd(6, " ").split("");
        chars[i] = " ";
        onChange(chars.join("").trimEnd());
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="otp-boxes">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          className="otp-box"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] && value[i] !== " " ? value[i] : ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoComplete={i === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
}

function DemoCard() {
  useWidgetScript();

  // stages: idle | sending | verify | verifying | success
  const [stage, setStage] = useState("idle");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // cache the platforms list so onSelect can pick the right device_id
  const platformsRef = useRef([]);

  function reset() {
    setStage("idle");
    setPhone("");
    setPlatform("");
    setOtp("");
    setError("");
    setLoading(false);
  }

  async function sendOTP(chosenPlatform, deviceId) {
    setLoading(true);
    setStage("sending");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/otp/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: deviceId,
          phone_number: phone,
          platform: chosenPlatform,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw =
          data?.message ||
          data?.error ||
          data?.detail ||
          (typeof data === "string" ? data : null) ||
          `HTTP ${res.status}`;
        throw new Error(`Server response: ${raw}`);
      }
      setStage("verify");
    } catch (err) {
      setError(err.message);
      setStage("idle");
    } finally {
      setLoading(false);
    }
  }

  const platforms_url = `${API_BASE}/platforms`;

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!phone.match(/^\+\d{7,15}$/)) {
      setError("Please select a country and enter your full phone number.");
      return;
    }
    setError("");
    if (!window.ShortMeshWidget) {
      setError("Widget not loaded yet — please try again in a moment.");
      return;
    }
    // Fetch and cache the platforms list so onSelect has device_ids available
    try {
      const res = await fetch(platforms_url);
      const data = await res.json();
      platformsRef.current = Array.isArray(data) ? data : [];
    } catch {
      platformsRef.current = [];
    }
    window.ShortMeshWidget.open({
      endpoints: { platforms: platforms_url },
      onSelect: (chosenPlatform) => {
        // Pick the first device registered for the chosen platform
        const match = platformsRef.current.find(
          (p) => p.platform === chosenPlatform,
        );
        const deviceId = match?.device_id ?? "";
        setPlatform(chosenPlatform);
        sendOTP(chosenPlatform, deviceId);
      },
      onError: () => setError("Could not load platforms. Please try again."),
    });
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.replace(/\s/g, "").length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const match = platformsRef.current.find((p) => p.platform === platform);
      const deviceId = match?.device_id ?? "";
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: otp.replace(/\s/g, ""),
          device_id: deviceId,
          phone_number: phone,
          platform,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw =
          data?.message ||
          data?.error ||
          data?.detail ||
          (typeof data === "string" ? data : null) ||
          `HTTP ${res.status}`;
        throw new Error(`Server response: ${raw}`);
      }
      setStage("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const platformLabel =
    platform === "wa"
      ? "WhatsApp"
      : platform
        ? platform.charAt(0).toUpperCase() + platform.slice(1)
        : "";

  return (
    <div className="demo-wrap">
      <div className="demo-ui">
        {(stage === "idle" || stage === "sending") && (
          <div className="demo-card">
            <h3>Try Demo</h3>
            <p>
              <strong>Enter your phone number</strong>. The platform picker will
              open so you can choose how to receive your code.
            </p>
            <form onSubmit={handlePhoneSubmit}>
              <PhoneInput
                defaultCountry="cm"
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  setError("");
                }}
                disabled={loading}
                inputClassName="demo-input"
                className="phone-picker"
                inputProps={{ autoComplete: "tel" }}
              />
              {error && <p className="demo-error">{error}</p>}
              <button
                className="btn-primary wide"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending…" : "Continue →"}
              </button>
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className="demo-card">
            <h3>Enter your code</h3>
            <p>
              A 6-digit code was sent to <strong>{phone}</strong>
              {platformLabel && (
                <>
                  {" "}
                  via <strong>{platformLabel}</strong>
                </>
              )}
              .
            </p>
            <form onSubmit={handleVerify}>
              <OTPInputs value={otp} onChange={setOtp} disabled={loading} />
              {error && <p className="demo-error">{error}</p>}
              <button
                className="btn-primary wide"
                type="submit"
                disabled={loading || otp.replace(/\s/g, "").length !== 6}
              >
                {loading ? "Verifying…" : "Verify"}
              </button>
              <button type="button" className="link-btn" onClick={reset}>
                ← Start over
              </button>
            </form>
          </div>
        )}

        {stage === "success" && (
          <div className="demo-card success-card">
            <div className="success-icon">✓</div>
            <h3>Phone verified!</h3>
            <p>
              <strong>{phone}</strong> has been successfully verified via Authy.
            </p>
            <button className="btn-secondary wide" onClick={reset}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Repos ───────────────────────────────────────────────────────────────────
const REPOS = [
  {
    name: "Authy API",
    desc: "OTP generation, delivery & verification service",
    href: "https://github.com/shortmesh/Authy-API",
    lang: "Go",
  },
  {
    name: "Interface API",
    desc: "Primary interface service built on Matrix",
    href: "https://github.com/shortmesh/Interface-API",
    lang: "Go",
  },
  {
    name: "Widget",
    desc: "Drop-in platform-picker widget for web",
    href: "https://github.com/shortmesh/Widgets",
    lang: "JS",
  },
  {
    name: "Widget Android",
    desc: "Native Android SDK for platform selection",
    href: "https://github.com/shortmesh/Widget-android",
    lang: "Android",
  },
];

function Repos() {
  return (
    <section className="repos" id="repos">
      <div className="section-label">Open Source</div>
      <h2>Everything you need, in the open</h2>
      <div className="repo-grid">
        {REPOS.map((r) => (
          <a
            className="repo-card"
            key={r.name}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="repo-top">
              <span className="repo-name">{r.name}</span>
              <span className="repo-lang">{r.lang}</span>
            </div>
            <p className="repo-desc">{r.desc}</p>
            <span className="repo-link">View on GitHub →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-mark">◈</span>
          <span>
            Authy by{" "}
            <a
              href="https://github.com/shortmesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              ShortMesh
            </a>
          </span>
        </div>
        <div className="footer-links">
          {REPOS.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="app">
      <Nav />
      <Hero />
      <Repos />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default App;
