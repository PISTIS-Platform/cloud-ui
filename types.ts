export type NotificationAction = {
    action: 'getAllNotifications' | 'markAsRead' | 'hide' | 'refund';
    notificationId?: string;
    userId: string | number;
};
