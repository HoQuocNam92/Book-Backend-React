import dotenv from 'dotenv';

dotenv.config();

const sendTelegramMessage = async (order: any) => {
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;
    if (!botToken || !chatId) {
        console.error('Bot token or chat ID is not defined in environment variables.');
        return;
    }
    const message = `
✅ <b>ĐƠN HÀNG MỚI</b>

🆔 Mã đơn: ${order.id}
👤 Khách: ${order.customerName}
💰 Tổng tiền: ${order.totalPrice.toLocaleString()} VND
📞 SĐT: ${order.phone}
📍 Địa chỉ: ${order.address}
  `;
    const url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Xác nhận đơn hàng',
                        url: `https://admin.alpha-books.com/orders/${order.id}`
                    },
                    {
                        text: 'Xem chi tiết',
                        url: `https://admin.alpha-books.com/orders/${order.id}`
                    },
                    {
                        text: "Hủy đơn hàng",
                        url: `https://admin.alpha-books.com/orders/${order.id}`
                    }
                ]
            ]
        }
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Error sending message to Telegram:', data);
        }
    }
    catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
};
export default sendTelegramMessage;
