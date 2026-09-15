export interface WhatsAppOrderDetails {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    city: string;
    address: string;
    paymentMethod: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    trackingUrl?: string;
}

// Default store customer support WhatsApp number in Egypt (+20)
export const STORE_WHATSAPP_NUMBER = "201090000000";

export function generateWhatsAppOrderUrl(
    order: WhatsAppOrderDetails,
    storeNumber: string = STORE_WHATSAPP_NUMBER
): string {
    const itemsList = order.items
        .map((item) => `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity} EGP`)
        .join("\n");

    const message = `*✨ New Order Confirmation - Clouds Store ✨*
----------------------------------------
*Order Number:* #${order.orderNumber}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery City:* ${order.city}
*Address:* ${order.address}
*Payment:* ${order.paymentMethod}

*📦 Items Ordered:*
${itemsList}

*💰 Total Amount:* ${order.totalAmount.toLocaleString()} EGP

${order.trackingUrl ? `*🚚 Track Order:* ${order.trackingUrl}` : ""}
----------------------------------------
_Thank you for ordering with Clouds! We are preparing your order now._`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = storeNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
}
