exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, phone, email, message } = JSON.parse(event.body);
  
  const BOT_TOKEN = '8378655892:AAHFlpTOjpIwNXbvYPvrXIoxD_5v3E0uyAc';
  const CHAT_ID = '360688303';
  
  const text = `🔥 НОВАЯ ЗАЯВКА С САЙТА\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n📧 Email: ${email || 'не указан'}\n💬 Сообщение: ${message || 'не указано'}\n\n⏰ ${new Date().toLocaleString('ru-RU')}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });
    
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};
