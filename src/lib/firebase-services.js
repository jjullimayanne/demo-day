export const getTheRoad = (state) => {
  window.history.pushState({}, '', state);
  const popstateEvent = new PopStateEvent('popstate', { state: {} });
  dispatchEvent(popstateEvent);
};
