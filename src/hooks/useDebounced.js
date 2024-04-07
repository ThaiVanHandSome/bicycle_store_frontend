const { useState, useEffect } = require("react");

const useDebounced = (currState, delay) => {
  const [state, setState] = useState(currState);
  useEffect(() => {
    const idTimeout = setTimeout(() => {
      setState(currState);
    }, delay);
    return () => {
      clearTimeout(idTimeout);
    };
  }, [state]);
};

export { useDebounced };
