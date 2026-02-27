import { formatVND } from '../../utils/formatVND'
const sendTelegramMessage = async (order: any, options = "sendOrders") => {
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;
    if (!botToken || !chatId) {
        console.error('Bot token or chat ID is not defined in environment variables.');
        return;
    }
    let message = '';
    if (options === "notiOrder") {
        message = `
        🔔 <b>THÔNG BÁO ĐƠN HÀNG</b>
        📌 Trạng thái: ${order.status}
        🆔 Mã đơn: ${order.id}
    `;
    } else {
        message = `
✅ <b>ĐƠN HÀNG MỚI</b>

🆔 Mã đơn: ${order.id}
👤 Khách: ${order.customerName}
💰 Tổng tiền: ${formatVND(order.totalPrice)}
📞 SĐT: ${order.phone}
📍 Địa chỉ: ${order.address}
📦 Phương thức thanh toán: ${order.paymentMethod}
📦 Danh sách sản phẩm: 
${order.items.map((item: any) => `  - Số lượng ${item[0]} -  ${item[2]} (${formatVND(Number(item[1]))})`).join('\n')}
  `;
    }
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
                        callback_data: `confirm_${order.id}`
                    },
                    {
                        text: 'Xem chi tiết',
                        callback_data: `view_${order.id}`

                    },
                    {
                        text: "Hủy đơn hàng",
                        callback_data: `cancel_${order.id}`
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
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }

}

export default sendTelegramMessage;