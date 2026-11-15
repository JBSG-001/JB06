'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const TelemetryTracker: React.FC = () => {
  const pathname = usePathname();
  const sessionRef = useRef<string>('');

  useEffect(() => {
    // Generate or retrieve persistent anonymous visitor ID
    let sid = sessionStorage.getItem('jb06_visitor_id');
    if (!sid) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      sid = `Visitor #${randNum}`;
      sessionStorage.setItem('jb06_visitor_id', sid);
    }
    sessionRef.current = sid;

    // Emit page_view event anonymously
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sid,
        eventType: 'page_view',
        path: pathname,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Fire-and-forget, ignore errors
    });
  }, [pathname]);

  return null;
};
