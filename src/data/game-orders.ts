import { ORDERS, Order } from './vocabulary';

const CUSTOMERS = [
  { name: 'Tiên', sprite: 'tien' },
  { name: 'Ngọc', sprite: 'ngoc' },
  { name: 'Vy', sprite: 'vy' },
  { name: 'Mèo Pixel', sprite: 'cat' },
  { name: 'Gấu trúc', sprite: 'panda' },
  { name: 'Thỏ bông', sprite: 'rabbit' },
  { name: 'Shiba', sprite: 'shiba' },
  { name: 'Gấu nâu', sprite: 'bear' },
  { name: 'Nhựt Khang', sprite: 'khang' },
  { name: 'Cánh cụt', sprite: 'penguin' },
  { name: 'Khủng long con', sprite: 'dino' },
  { name: 'Cáo nhỏ', sprite: 'fox' },
];

// Deterministic assignment avoids server/client hydration mismatches while keeping the cast varied.
export const GAME_ORDERS: Order[] = ORDERS.map((order) => {
  if (order.isLoveOrder) return order;
  const customer = CUSTOMERS[(order.id * 7 + 3) % CUSTOMERS.length];
  return { ...order, customerName: customer.name, customerSprite: customer.sprite };
});

