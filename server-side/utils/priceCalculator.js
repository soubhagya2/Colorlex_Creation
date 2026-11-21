export const calculateProductPrice = ({
  product,
  selectedSize,
  selectedMaterial,
  selectedFinish,
  selectedTurnaround,
  quantity
}) => {
  let basePrice = product.basePrice || 10;
  let sizeModifier = 0;
  let materialModifier = 0;
  let finishModifier = 0;
  let turnaroundFee = 0;

  if (selectedSize && product.variants?.sizes) {
    const sizeOpt = product.variants.sizes.find(
      s => s.name.toLowerCase() === selectedSize.toLowerCase()
    );
    if (sizeOpt) sizeModifier = sizeOpt.priceModifier || 0;
  }

  if (selectedMaterial && product.variants?.materials) {
    const matOpt = product.variants.materials.find(
      m => m.name.toLowerCase() === selectedMaterial.toLowerCase()
    );
    if (matOpt) materialModifier = matOpt.priceModifier || 0;
  }

  if (selectedFinish && product.variants?.finishes) {
    const finOpt = product.variants.finishes.find(
      f => f.name.toLowerCase() === selectedFinish.toLowerCase()
    );
    if (finOpt) finishModifier = finOpt.priceModifier || 0;
  }

  if (selectedTurnaround && product.turnaroundOptions) {
    const turnOpt = product.turnaroundOptions.find(
      t => t.name.toLowerCase() === selectedTurnaround.toLowerCase()
    );
    if (turnOpt) turnaroundFee = turnOpt.extraFee || 0;
  }

  const rawUnitPrice = basePrice + sizeModifier + materialModifier + finishModifier;

  let discountPercentage = 0;
  let customPricePerUnit = null;

  if (product.bulkPricing && product.bulkPricing.length > 0) {
    const sortedTiers = [...product.bulkPricing].sort((a, b) => b.minQty - a.minQty);
    const applicableTier = sortedTiers.find(tier => quantity >= tier.minQty);

    if (applicableTier) {
      if (applicableTier.pricePerUnit && applicableTier.pricePerUnit > 0) {
        customPricePerUnit = applicableTier.pricePerUnit;
      } else if (applicableTier.discountPercentage) {
        discountPercentage = applicableTier.discountPercentage;
      }
    }
  }

  let finalUnitPrice = rawUnitPrice;
  if (customPricePerUnit !== null) {
    finalUnitPrice = customPricePerUnit + sizeModifier + materialModifier + finishModifier;
  } else if (discountPercentage > 0) {
    finalUnitPrice = rawUnitPrice * (1 - discountPercentage / 100);
  }

  const subtotal = Math.max(0.1, finalUnitPrice) * quantity;
  const totalPrice = subtotal + turnaroundFee;

  return {
    basePrice,
    sizeModifier,
    materialModifier,
    finishModifier,
    rawUnitPrice: Number(rawUnitPrice.toFixed(2)),
    finalUnitPrice: Number(finalUnitPrice.toFixed(2)),
    discountPercentage,
    turnaroundFee,
    quantity,
    subtotal: Number(subtotal.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2))
  };
};
