import { useEffect, useRef, useCallback } from 'react';
import { Event } from '@/types';
import { format, parse, differenceInMinutes, isToday } from 'date-fns';

interface UseRemindersProps {
  events: Event[];
}

export function useReminders({ events }: UseRemindersProps) {
  const notifiedEvents = useRef<Set<string>>(new Set());
  const permissionGranted = useRef(false);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      permissionGranted.current = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      permissionGranted.current = permission === 'granted';
      return permission === 'granted';
    }

    return false;
  }, []);

  // Show notification
  const showNotification = useCallback((event: Event, minutesUntil: number) => {
    const title = event.reminderTitle || `⏰ ${event.title}`;
    const body = minutesUntil <= 0 
      ? `Starting now!` 
      : `Starting in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`;

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: `${body}\n${event.startTime} - ${event.endTime}`,
        icon: '/favicon.ico',
        tag: event.id,
        requireInteraction: true,
      });

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }, []);

  // Check for upcoming events
  useEffect(() => {
    requestPermission();

    const checkReminders = () => {
      const now = new Date();

      events.forEach(event => {
        // Skip if no reminder set or already notified
        if (!event.reminderMinutes || notifiedEvents.current.has(event.id)) {
          return;
        }

        // Parse event date and time
        const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
        
        // Only check today's events
        if (!isToday(eventDate)) return;

        const [hours, minutes] = event.startTime.split(':').map(Number);
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes, 0, 0);

        const minutesUntilEvent = differenceInMinutes(eventDateTime, now);

        // Check if it's time to send reminder
        if (minutesUntilEvent <= event.reminderMinutes && minutesUntilEvent >= -1) {
          showNotification(event, minutesUntilEvent);
          notifiedEvents.current.add(event.id);
        }
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [events, requestPermission, showNotification]);

  // Reset notifications at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      notifiedEvents.current.clear();
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return { requestPermission };
}
