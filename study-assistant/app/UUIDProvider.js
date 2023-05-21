import React, { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import UUIDContext from './UUIDContext';

const UUIDProvider = ({ children }) => {
  const [uuid, setUUID] = useState('');

  useEffect(() => {
    const storedUUID = cookie.get('uuid');

    if (!storedUUID) {
      const newUUID = uuidv4();
      cookie.set('uuid', newUUID);
      setUUID(newUUID);
    } else {
      setUUID(storedUUID);
    }
  }, []);

  return (
    <UUIDContext.Provider value={uuid}>
      {children}
    </UUIDContext.Provider>
  );
};

export default UUIDProvider;
