import { useCallback, useMemo, useState } from "react";

export function useList<TItem>(initialList: TItem[]) {
  const [list, setList] = useState(initialList);

  const set = useCallback((newList: TItem[]) => {
    setList(newList);
  }, []);

  const push = useCallback((item: TItem) => {
    setList((cur) => [...cur, item]);
  }, []);

  const removeAt = useCallback((index: number) => {
    let removedItem: TItem | undefined;

    setList((cur) => {
      const newList = cur.slice();
      const removedItems = newList.splice(index);
      removedItem = removedItems[0];
      return newList;
    });

    return removedItem;
  }, []);

  const insertAt = useCallback((index: number, item: TItem) => {
    setList((cur) => cur.slice().splice(index, 0, item));
  }, []);

  const replaceAt = useCallback((index: number, item: TItem) => {
    setList((cur) => cur.slice().splice(index, 1, item));
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  const handlers = useMemo(
    () => ({ set, push, removeAt, insertAt, replaceAt, clear }),
    [set, push, removeAt, insertAt, replaceAt, clear],
  );

  return [list, handlers];
}
