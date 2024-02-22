function subscribe(eventName: string, listener) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
