import { MutableRefObject, useState, useEffect, useRef } from "react";

export default function useInfiniteScroll<TListItem>(
  observerTarget: MutableRefObject<HTMLDivElement>,
  fetchImplementation: (page: number) => Promise<TListItem[]>
) {
  const initialPageLoaded = useRef(false);
  const [items, setItems] = useState<TListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);

  const loadNext = async () => {
    if (!hasMoreRef.current || loadingRef.current) return;

    setLoading(true);

    const newItems = await fetchImplementation(pageRef.current);

    setLoading(false);

    if (!newItems?.length) {
      setHasMore(false);
      return;
    }

    setPage(currentPage => currentPage + 1);
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const mutate = () => {
    setItems([]);
    setHasMore(true);
    setLoading(false);
    setPage(1);

    return setTimeout(loadNext);
  };

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (initialPageLoaded.current) return;

    initialPageLoaded.current = true;

    const { current } = observerTarget;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadNext();
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
