import { useAppState } from "../../state/AppState.jsx";

export default function GroundingTeaser() {
  const { dispatch } = useAppState();
  const goGrounding = () => dispatch({ type: "goto", page: "hub" });

  return (
    <section data-reveal="1" style={{ padding: "0 22px 96px" }}>
      <div className="ground-teaser-card">
        <div>
          <p className="ground-teaser-kicker">Grounding Sanctuary</p>
          <h2 className="ground-teaser-title serif">Before you read on — take a moment to breathe with me.</h2>
          <p className="ground-teaser-copy">A quiet room of grounding exercises you can use any time. A small taste of how I work — no sign-up, nothing to say out loud.</p>
          <button type="button" data-magnet="1" className="btn-outline-fill" onClick={goGrounding}>Step inside</button>
        </div>
        <div className="ground-teaser-orb" />
      </div>
    </section>
  );
}
