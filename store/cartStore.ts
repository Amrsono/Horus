import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string | number;
    name: string;
    price: string | number;
    originalPrice?: string | number;
    image: string;
    category?: string;
    variant?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    expiresAt: number | null; // Timestamp for 15-minute stock reservation
    specialInstructions: string;
    discountCode: string;
    discountPercent: number;

    openCart: () => void;
    closeCart: () => void;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    setSpecialInstructions: (instructions: string) => void;
    applyDiscount: (code: string) => { success: boolean; message: string };
    removeDiscount: () => void;
    totalItems: () => number;
    subtotalPrice: () => number;
    totalPrice: () => number;
    discountAmount: () => number;
}

const RESERVATION_MINUTES = 15;

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            expiresAt: null,
            specialInstructions: '',
            discountCode: '',
            discountPercent: 0,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                let updatedItems: CartItem[];
                if (existingItem) {
                    updatedItems = items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    updatedItems = [...items, { ...product, quantity }];
                }

                // Set or keep active 15 minute stock reservation
                const currentExpiresAt = get().expiresAt;
                const newExpiresAt = (!currentExpiresAt || currentExpiresAt < Date.now())
                    ? Date.now() + RESERVATION_MINUTES * 60 * 1000
                    : currentExpiresAt;

                set({
                    items: updatedItems,
                    isOpen: true, // Automatically open drawer like CircleV Store
                    expiresAt: newExpiresAt,
                });
            },

            removeItem: (productId) => {
                const newItems = get().items.filter((item) => item.id !== productId);
                set({
                    items: newItems,
                    expiresAt: newItems.length === 0 ? null : get().expiresAt,
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({
                items: [],
                expiresAt: null,
                specialInstructions: '',
                discountCode: '',
                discountPercent: 0
            }),

            setSpecialInstructions: (instructions) => set({ specialInstructions: instructions }),

            applyDiscount: (code: string) => {
                const cleanCode = code.trim().toUpperCase();
                if (cleanCode === 'CIRCLE10' || cleanCode === 'HORUS10' || cleanCode === 'WELCOME10') {
                    set({ discountCode: cleanCode, discountPercent: 10 });
                    return { success: true, message: '10% discount applied successfully!' };
                } else if (cleanCode === 'VIP20') {
                    set({ discountCode: cleanCode, discountPercent: 20 });
                    return { success: true, message: '20% VIP discount applied!' };
                }
                return { success: false, message: 'Invalid or expired discount code.' };
            },

            removeDiscount: () => set({ discountCode: '', discountPercent: 0 }),

            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

            subtotalPrice: () => {
                return get().items.reduce((total, item) => {
                    const price = typeof item.price === 'string'
                        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
                        : item.price;
                    return total + (isNaN(price) ? 0 : price) * item.quantity;
                }, 0);
            },

            discountAmount: () => {
                const subtotal = get().subtotalPrice();
                return (subtotal * get().discountPercent) / 100;
            },

            totalPrice: () => {
                const subtotal = get().subtotalPrice();
                const discount = get().discountAmount();
                return Math.max(0, subtotal - discount);
            },
        }),
        {
            name: 'clouds-cart-storage',
            partialize: (state) => ({
                items: state.items,
                expiresAt: state.expiresAt,
                specialInstructions: state.specialInstructions,
                discountCode: state.discountCode,
                discountPercent: state.discountPercent,
            }),
        }
    )
);
