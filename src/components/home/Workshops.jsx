import { useAppState } from "../../state/AppState.jsx";
import { scrollToHash } from "../../hooks/useScrollNav.js";

export default function Workshops() {
  const { dispatch } = useAppState();

  const enquireWorkshop = () => {
    dispatch({ type: "setSeek", label: "Workshop or training" });
    scrollToHash("#enquiry");
  };

  return (
    <section id="workshops" className="section workshops-section">
      <div className="container workshops-grid">
        <div data-reveal="1">
          <h2 className="h2" style={{ marginBottom: 18 }}>Workshops &amp; trainings</h2>
          <p className="workshops-copy">Psychoeducational trainings and reflective workshops for groups, teams and communities — spaces for self-understanding, meaningful dialogue, and collective learning.</p>
          <button type="button" data-magnet="1" className="btn-soft" onClick={enquireWorkshop}>Enquire about a workshop</button>
        </div>
        <div data-reveal="1" className="workshops-list">
          <div>Reflective spaces for teams and student groups</div>
          <div>Psychoeducation on burnout, boundaries and rest</div>
          <div>Trauma-informed and queer-affirmative practice sessions</div>
        </div>
      </div>
    </section>
  );
}
