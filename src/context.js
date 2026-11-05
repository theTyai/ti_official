// src/context.js – app-wide routing helpers and intro state.
import { createContext, useContext } from 'react';

export const AppContext = createContext({
  route: { page: 'home', id: null, section: null },
  navigate: () => {},
  openDetail: () => {},
  closeDetail: () => {},
  introDone: true,
});

export const useApp = () => useContext(AppContext);
