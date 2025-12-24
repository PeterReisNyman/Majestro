import { useState, useEffect } from 'react';
import { Router, Route, Switch } from 'wouter';
import ChatPage from '@/pages/chat';
import NotFound from '@/pages/not-found';

function App() {
  // Initialize theme from system preference or localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Fall back to system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark mode
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Router>
      <Switch>
        <Route path="/">
          <ChatPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
