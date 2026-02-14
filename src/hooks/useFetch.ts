import { useEffect, useEffectEvent, useReducer, useRef } from "react";

type State<T> = {
  error: Error | undefined;
  data: T | undefined;
};

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

const initialState: State<undefined> = {
  error: undefined,
  data: undefined,
};

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "loading":
      return { error: undefined, data: undefined };
    case "fetched":
      return { error: undefined, data: action.payload };
    case "error":
      return { error: action.payload, data: undefined };
    default:
      return state;
  }
};

export function useFetch<T = unknown>(
  url: RequestInfo | URL,
  opts?: RequestInit,
): State<T> {
  const cacheRef = useRef<Map<RequestInfo | URL, T>>(new Map());

  const [state, dispatch] = useReducer(reducer<T>, initialState as State<T>);

  const onFetch = useEffectEvent(
    (url: RequestInfo | URL, signal: AbortSignal) =>
      fetch(url, { ...opts, signal }),
  );

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      const cachedResponse = cacheRef.current.get(url);

      if (cachedResponse) {
        dispatch({ type: "fetched", payload: cachedResponse });
        return;
      }

      dispatch({ type: "loading" });

      try {
        const res = await onFetch(url, abortController.signal);

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const json = (await res.json()) as T;
        cacheRef.current.set(url, json);

        dispatch({ type: "fetched", payload: json });
      } catch (e) {
        // Don't dispatch error if request was aborted
        if (e instanceof Error && e.name !== "AbortError") {
          dispatch({ type: "error", payload: e });
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [onFetch, url]);

  return state;
}
