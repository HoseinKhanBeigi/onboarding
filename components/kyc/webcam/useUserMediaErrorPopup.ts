import { useRef, useState } from 'react';

const defaultId = 0;

const useUserMediaErrorPopup = () => {
  const [userMediaError, setUserMediaError] = useState(false);
  const prevID = useRef<number>(defaultId);
  const [id, setId] = useState(defaultId);

  const generateNewId = () => {
    let currentId = prevID.current;
    while (prevID.current === currentId) {
      currentId = Math.floor(Math.random() * 100) + (defaultId + 1);
    }
    setId(currentId);
    prevID.current = currentId;
  };

  const closeUserMediaErrorPopup = () => {
    setUserMediaError(false);
    generateNewId();
  };

  const onUserMediaError = () => {
    setUserMediaError(true);
  };
  return {
    userMediaError,
    closeUserMediaErrorPopup,
    onUserMediaError,
    id,
  };
};
export default useUserMediaErrorPopup;
