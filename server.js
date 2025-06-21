const webpush = require('web-push');

// ⚙️ Настройка VAPID
const publicVapidKey = 'BD-OsbXoHHwg7KaxQsy5GsjV4YF0OV9FYl06UFs0cwd77pfvd1AF_dL2ZhnwYWAshHMBST517DAydyPBSr3FnK0';
const privateVapidKey = 'F6ziOjNHikq24j6T6TquTfJMLfX7E6ryhr0F11hMztc';

webpush.setVapidDetails(
  'mailto:your@email.com',
  publicVapidKey,
  privateVapidKey
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { subscription, message } = req.body;

  if (!subscription || !message) {
    return res.status(400).json({ error: 'Отсутствует подписка или сообщение' });
  }

  const payload = JSON.stringify({
    title: 'Новое сообщение',
    body: message,
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Ошибка отправки:', err);

    if (err.body) {
      const errorText = await err.body.text();
      console.error('Тело ошибки:', errorText);
    }

    res.status(500).json({ error: 'Ошибка при отправке уведомления', detail: err.message });
  }
}
