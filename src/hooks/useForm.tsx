import { useState } from 'react';

export const useForm = <T extends {}>(initialState: T) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  
  return { values, handleChange};
};
