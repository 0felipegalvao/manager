'use client';

import { useState, useEffect } from 'react';

interface SidebarState {
  isCollapsed: boolean;
  openMenus: string[];
}

const STORAGE_KEY = 'sidebar-state';

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>({
    isCollapsed: false,
    openMenus: [],
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setState(parsedState);
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }, [state]);

  const toggleCollapse = () => {
    setState(prev => ({
      ...prev,
      isCollapsed: !prev.isCollapsed,
    }));
  };

  const toggleMenu = (menuTitle: string) => {
    setState(prev => ({
      ...prev,
      openMenus: prev.openMenus.includes(menuTitle)
        ? prev.openMenus.filter(title => title !== menuTitle)
        : [...prev.openMenus, menuTitle],
    }));
  };

  const isMenuOpen = (menuTitle: string) => {
    return state.openMenus.includes(menuTitle);
  };

  return {
    isCollapsed: state.isCollapsed,
    openMenus: state.openMenus,
    toggleCollapse,
    toggleMenu,
    isMenuOpen,
  };
}
