export const deductInventory = async (items: Array<{ title: string; quantity: number; price: number }>, transactionId: string) => {
    for (const item of items) {
        try {
            const stockResponse = await fetch('/api/admin/stock');
            const stockData = await stockResponse.json();

            const stockItem = stockData.find((stock: { name: string }) =>
                stock.name === item.title ||
                stock.name.toLowerCase() === item.title.toLowerCase()
            );

            if (stockItem) {
                const updateResponse = await fetch(`/api/admin/stock/${stockItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentStock: Math.max(0, stockItem.currentStock - item.quantity),
                        lastUpdated: new Date().toISOString()
                    })
                });

                if (updateResponse.ok) {
                    await fetch('/api/admin/stock/movements', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            itemId: stockItem.id,
                            itemName: stockItem.name,
                            type: 'out',
                            quantity: item.quantity,
                            reason: `Customer purchase - Transaction: ${transactionId}`,
                            user: 'System (Customer Order)'
                        })
                    });
                }
            }
        } catch (error) {
            console.error(`Error updating inventory for ${item.title}:`, error);
        }
    }
};
