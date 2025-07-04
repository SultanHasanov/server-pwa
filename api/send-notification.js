import webpush from 'web-push';

const PUBLIC_VAPID = 'BD-OsbXoHHwg7KaxQsy5GsjV4YF0OV9FYl06UFs0cwd77pfvd1AF_dL2ZhnwYWAshHMBST517DAydyPBSr3FnK0';
const PRIVATE_VAPID = 'F6ziOjNHikq24j6T6TquTfJMLfX7E6ryhr0F11hMztc';

webpush.setVapidDetails(
  'mailto:your@email.com',
  PUBLIC_VAPID,
  PRIVATE_VAPID
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // или конкретный домен
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { subscription, message } = req.body;

  if (!subscription || !message) {
    return res.status(400).json({ error: 'Missing subscription or message' });
  }

  try {
    const payload = JSON.stringify({
      title: 'Новое сообщение',
      body: message,
    });

    await webpush.sendNotification(subscription, payload);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Ошибка отправки пуша:', err);

    return res.status(500).json({
      error: 'Notification failed',
      detail: err.message,
    });
  }
}

