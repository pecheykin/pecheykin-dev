exports.handler = async (event, context) => {
  // Проверяем метод запроса
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Парсим данные из формы
    const { name, telegramContact, phoneContact, message } = JSON.parse(event.body);
    
    // Определяем способ связи
    const contact = telegramContact || phoneContact || 'не указан';
    const contactType = telegramContact ? 'Telegram' : 'Телефон';
    
    // Получаем токен из переменных окружения (безопаснее)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8378655892:AAHFlpTOjpIwNXbvYPvrXIoxD_5v3E0uyAc';
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '360688303';
    
    // Формируем красивое сообщение
    const text = `🔥 НОВАЯ ЗАЯВКА С САЙТА

👤 Имя: ${name}
📱 ${contactType}: ${contact}
💬 Задача: ${message || 'не указана'}

⏰ ${new Date().toLocaleString('ru-RU', { 
  timeZone: 'Asia/Tashkent',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})}`;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text,
        parse_mode: 'HTML' // Поддержка HTML форматирования
      })
    });

    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${telegramResponse.status}`);
    }

    return { 
      statusCode: 200, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Сообщение отправлено!' 
      }) 
    };

  } catch (error) {
    console.error('Telegram bot error:', error);
    
    return { 
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Ошибка отправки сообщения',
        details: error.message 
      }) 
    };
  }
};
