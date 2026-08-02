import { useAppState } from "../../state/AppState.jsx";
import { THEMES, SEEK } from "../../data.js";

export default function Enquiry() {
  const { state, dispatch } = useAppState();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "submit" });
  };

  return (
    <section id="enquiry" className="section enquiry-section">
      <div className="container enquiry-grid">
        <div>
          <h2 className="h2" style={{ marginBottom: 14 }}>Get in touch</h2>
          <p className="enquiry-intro">This is the start of a conversation, not a form to get right. Answer only what you'd like to.</p>

          <form className="enquiry-form" onSubmit={onSubmit}>
            <fieldset>
              <legend>What brings you here today?</legend>
              <div className="chip-row">
                {THEMES.map((label) => {
                  const on = state.themes.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={"chip" + (on ? " is-on" : "")}
                      aria-pressed={on}
                      onClick={() => dispatch({ type: "toggleTheme", label })}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend>What are you looking for?</legend>
              <div className="chip-row">
                {SEEK.map((label) => {
                  const on = state.seek === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={"chip" + (on ? " is-on" : "")}
                      aria-pressed={on}
                      onClick={() => dispatch({ type: "setSeek", label })}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="contact-grid">
              <legend>How can I reach you?</legend>
              <label className="field-label">
                Name
                <input type="text" name="name" autoComplete="name" />
              </label>
              <label className="field-label">
                Email
                <input type="email" name="email" autoComplete="email" />
              </label>
              <label className="field-label">
                Phone / WhatsApp
                <input type="tel" name="phone" autoComplete="tel" />
              </label>
              <label className="field-label">
                Rough availability
                <input type="text" name="availability" placeholder="e.g. weekday evenings" />
              </label>
              <label className="field-label field-full">
                Anything you'd like me to know (optional)
                <textarea name="note" rows={4} />
              </label>
            </fieldset>

            <label className="consent-row">
              <input type="checkbox" name="consent" required />
              <span>
                I consent to MindScape &amp; Co. contacting me about my enquiry. My details will be kept confidential and used only for this purpose.{" "}
                <a href="#privacy">Privacy policy</a> (placeholder).
              </span>
            </label>

            <div className="submit-row">
              <button
                type="submit"
                data-magnet="1"
                className="btn-peach btn-peach--md"
                style={{ "--hover-shadow": "0 10px 26px rgba(30,43,69,.18)" }}
              >
                Send enquiry
              </button>
              <p role="status" className={"sent-msg" + (state.sent ? " is-visible" : "")}>
                Thank you — this is a placeholder form; connect a submission endpoint to receive enquiries.
              </p>
            </div>
            <p className="form-footnote">Form endpoint: placeholder — wire to email or a form service before launch.</p>
          </form>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="contact-card">
            <h3>Or reach me directly</h3>
            <p><a href="mailto:sanskruti.jkp@gmail.com">sanskruti.jkp@gmail.com</a></p>
            <p style={{ marginBottom: 18 }}><a href="tel:+918780978260">+91 87809 78260</a> · call or WhatsApp</p>
            <div className="qr-row">
              <div role="img" aria-label="Placeholder for the scan-to-connect QR code" className="qr-placeholder" />
              <span className="mono-badge" style={{ background: "none", padding: 0 }}>QR placeholder<br />scan to connect</span>
            </div>
          </div>
          <div className="scheduler-placeholder">
            <p>optional scheduler embed<br />(Calendly / Cal.com) — slot reserved</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
