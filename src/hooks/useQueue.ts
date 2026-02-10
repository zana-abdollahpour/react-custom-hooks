import { useCallback, useState } from "react";

export function useQueue<TItem>(initialQueue: TItem[]) {
  const [queue, setQueue] = useState(initialQueue);

  const add = useCallback((item: TItem) => {
    setQueue((q) => [...q, item]);
  }, []);

  const remove = useCallback(() => {
    let removedItem: TItem | undefined;

    setQueue((q) => {
      if (q.length === 0) return q;
      const [first, ...rest] = q;
      removedItem = first;
      return rest;
    });

    return removedItem;
  }, []);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    add,
    clear,
    queue,
    remove,
    first: queue[0],
    size: queue.length,
    last: queue[queue.length - 1],
  };
}
