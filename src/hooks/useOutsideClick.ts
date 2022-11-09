import { RefObject, useEffect } from "react";

export default function useOutsideClick(ref: RefObject<HTMLElement>, callback: () => void, except: RefObject<HTMLElement> = null) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (except !== null && except.current.contains(event.target)) {
        return;
      }
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref, except]);
}