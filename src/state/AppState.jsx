import { createContext, useContext, useMemo, useReducer, useEffect, useState } from "react";
import { CARDS } from "../data.js";

const initialState = {
  page: "home",
  pendingHash: null,
  themes: [],
  seek: "",
  sent: false,
  calm: false,
  pattern: "coherent",
  breathOn: false,
  tone: false,
  bilatOn: true,
  tap: false,
  card: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "goto":
      return { ...state, page: action.page };
    case "gotoHome":
      return { ...state, page: "home", pendingHash: action.hash ?? null };
    case "clearPendingHash":
      return { ...state, pendingHash: null };
    case "toggleTheme": {
      const has = state.themes.includes(action.label);
      return { ...state, themes: has ? state.themes.filter((t) => t !== action.label) : state.themes.concat(action.label) };
    }
    case "setSeek":
      return { ...state, seek: state.seek === action.label ? "" : action.label };
    case "submit":
      return { ...state, sent: true };
    case "toggleCalm":
      return { ...state, calm: !state.calm };
    case "setPattern":
      return { ...state, pattern: action.key };
    case "toggleBreath":
      return { ...state, breathOn: !state.breathOn };
    case "toggleTone":
      return { ...state, tone: !state.tone };
    case "toggleBilat":
      return { ...state, bilatOn: !state.bilatOn };
    case "toggleTap":
      return { ...state, tap: !state.tap };
    case "prevCard":
      return { ...state, card: Math.max(0, state.card - 1) };
    case "nextCard":
      return { ...state, card: Math.min(CARDS.length - 1, state.card + 1) };
    default:
      return state;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [reduced, setReduced] = useState(false);
  const [fine, setFine] = useState(true);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");
    setReduced(mqReduced.matches);
    setFine(mqFine.matches);
    const onReduced = (e) => setReduced(e.matches);
    const onFine = (e) => setFine(e.matches);
    mqReduced.addEventListener("change", onReduced);
    mqFine.addEventListener("change", onFine);
    return () => {
      mqReduced.removeEventListener("change", onReduced);
      mqFine.removeEventListener("change", onFine);
    };
  }, []);

  const quiet = reduced || state.calm;

  const value = useMemo(() => ({ state, dispatch, reduced, fine, quiet }), [state, reduced, fine, quiet]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
