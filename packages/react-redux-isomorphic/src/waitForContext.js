export function isAllComponentsLoaded(store) {
  const {
    reactReduxIsomorphic: {
      pendingComponents,
    },
  } = store.getState();

  return pendingComponents.length === 0;
}

export default function waitForContext(store) {
  if (isAllComponentsLoaded(store)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = store.subscribe(() => {
      if (isAllComponentsLoaded(store)) {
        unsubscribe();

        resolve();
      }
    });
  });
}
