import { MutableRefObject, useState, useEffect, useRef } from "react";
import { RecoilState, useRecoilValue } from "recoil";

export default function useInfiniteScroll<TListItem>(
  observerTarget: MutableRefObject<HTMLDivElement>,
  detailAtom: RecoilState<any>,
  fetchImplementation: (page: number, detail: any) => Promise<TListItem[]>
) {
  const detailState = useRecoilValue(detailAtom);
  const initialPageLoaded = useRef(false);
  const [items, setItems] = useState<TListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const detailStateRef = useRef(detailState);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);

  const loadNext = async (detail: any = undefined) => {
    if (!hasMoreRef.current || loadingRef.current) return;

    setLoading(true);

    const newItems = await fetchImplementation(pageRef.current, detail || detailStateRef.current);

    setLoading(false);

    const isEmptyResult = !newItems?.length;
    const isOddLength = isEmptyResult || items.length > 0 && (items.length % newItems.length) !== 0; 

    if (isOddLength) {
      setHasMore(false);
      return;
    }

    setPage(currentPage => currentPage + 1);
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const mutate = (detail: any = undefined) => {
    setItems([]);
    setHasMore(true);
    setLoading(false);
    setPage(1);

    return setTimeout(() => loadNext(detail));
  };

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, hasMore, page]);

  useEffect(() => {
    detailStateRef.current = detailState;
  }, [detailState]);

  useEffect(() => {
    if (initialPageLoaded.current) return;

    initialPageLoaded.current = true;

    const { current } = observerTarget;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pageRef.current !== 1) {
        loadNext();
      }
    });

    loadNext().then(() => observer.observe(current));

    return () => observer.unobserve(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loadNext,
    mutate,
    items,
    loading,
    empty: !items.length,
  };
}
