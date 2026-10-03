import React from 'react';
import ReactDOM from 'react-dom/client';
import { NepalJourney } from '@/components/ui/nepal-journey';
import '@fontsource/barlow-condensed/latin-700.css';
import './styles/globals.css';
import './styles/journey.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main><NepalJourney /><a className="prem-watermark" href="#photography-credits" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('nepal:credits')); }}>make with ❤️‍🩹 by premm.</a></main>
  </React.StrictMode>,
);
