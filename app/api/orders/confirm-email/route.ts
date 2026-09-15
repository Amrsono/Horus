import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            orderId,
            orderNumber,
            customerName,
            customerEmail,
            items = [],
            totalAmount,
            shippingAddress = {},
            trackingUrl,
        } = body;

        if (!customerEmail || !orderNumber) {
            return NextResponse.json(
                { error: "Missing required order or customer email fields" },
                { status: 400 }
            );
        }

        // Generate HTML Invoice & Confirmation Email template
        const itemsHtml = items
            .map(
                (item: any) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
                    <strong>${item.name || item.product_name}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; text-align: right; font-family: monospace;">
                    ${Number(item.price || item.price_at_purchase) * item.quantity} EGP
                </td>
            </tr>`
            )
            .join("");

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Order Confirmation #${orderNumber}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <!-- Header -->
                <div style="background-color: #0f172a; padding: 28px 32px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                        CLOUD<span style="color: #c91c1c;">S</span> STORE
                    </h1>
                    <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Leading Online Vape Store in Egypt</p>
                </div>

                <!-- Content -->
                <div style="padding: 32px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="display: inline-block; background-color: #fee2e2; color: #c91c1c; font-size: 12px; font-weight: 700; padding: 4px 12px; rounded: 16px; border-radius: 9999px;">
                            ORDER CONFIRMED
                        </span>
                        <h2 style="font-size: 20px; font-weight: 800; margin: 12px 0 4px 0;">
                            Thank you for your order, ${customerName}!
                        </h2>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">
                            We've received your order and our team is already preparing it for shipment.
                        </p>
                    </div>

                    <!-- Order Details Summary Card -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <span style="color: #64748b;">Order Number:</span>
                            <strong style="color: #0f172a; font-family: monospace;">#${orderNumber}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <span style="color: #64748b;">Delivery Address:</span>
                            <span style="color: #0f172a; text-align: right;">${shippingAddress.address || ""}, ${shippingAddress.city || ""}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px;">
                            <span style="color: #64748b;">Estimated Delivery:</span>
                            <strong style="color: #0f172a;">Within 24 - 48 Hours</strong>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <thead>
                            <tr style="background-color: #f1f5f9; text-align: left;">
                                <th style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Product</th>
                                <th style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; text-align: center;">Qty</th>
                                <th style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <!-- Totals -->
                    <div style="border-top: 2px solid #e2e8f0; padding-top: 16px; margin-bottom: 32px;">
                        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800;">
                            <span>Total Amount:</span>
                            <span style="color: #c91c1c; font-family: monospace;">${Number(totalAmount).toLocaleString()} EGP</span>
                        </div>
                        <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Payment Method: Cash on Delivery (COD)</p>
                    </div>

                    <!-- CTA Button -->
                    ${
                        trackingUrl
                            ? `
                    <div style="text-align: center; margin-bottom: 24px;">
                        <a href="${trackingUrl}" style="display: inline-block; background-color: #c91c1c; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Track Your Order Live
                        </a>
                    </div>`
                            : ""
                    }

                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                        Questions? Reply directly to this email or chat with our support team on WhatsApp.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // If a real email provider like Resend is present, send through it:
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            try {
                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${resendApiKey}`,
                    },
                    body: JSON.stringify({
                        from: "Clouds Store <orders@cloudsstore.com>",
                        to: [customerEmail],
                        subject: `Order Confirmed: #${orderNumber}`,
                        html: emailHtml,
                    }),
                });
            } catch (providerError) {
                console.warn("External email provider failed:", providerError);
            }
        } else {
            console.log(`[Email Confirmation] Invoice queued for ${customerEmail} (Order #${orderNumber})`);
        }

        return NextResponse.json({
            success: true,
            orderNumber,
            message: "Order confirmation email generated successfully.",
        });
    } catch (error: any) {
        console.error("Error sending confirmation email:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send confirmation email" },
            { status: 500 }
        );
    }
}
