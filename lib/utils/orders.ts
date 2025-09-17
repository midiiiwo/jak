export const updateOrderStatus = async (
    orderId: string,
    status: 'completed' | 'failed' | 'cancelled' | 'pending',
    paymentId?: string,
    failureReason?: string
) => {
    try {
        const endpoint = '/api/admin/orders';
        let orders;

        if (status === 'pending') {
            const ordersResponse = await fetch(endpoint);
            if (ordersResponse.ok) {
                orders = await ordersResponse.json();
                const pendingOrder = orders.find((order: { status: string; orderDate: string }) =>
                    order.status === 'pending' &&
                    Math.abs(new Date(order.orderDate).getTime() - Date.now()) < 5 * 60 * 1000
                );
                if (pendingOrder) {
                    orderId = pendingOrder.id;
                }
            }
        }

        if (orderId) {
            interface OrderUpdateData {
                status: typeof status;
                [key: string]: string | undefined;
                paymentId?: string;
                failureReason?: string;
            }

            const updateData: OrderUpdateData = {
                status,
                [`${status}At`]: new Date().toISOString()
            };

            if (paymentId) {
                updateData.paymentId = paymentId;
            }

            if (failureReason) {
                updateData.failureReason = failureReason;
            }

            await fetch(`${endpoint}/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
        }
    } catch (err) {
        console.error(`Error updating ${status} order status:`, err);
    }
};
