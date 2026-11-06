const usd = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number): string {
  return usd.format(price);
}
