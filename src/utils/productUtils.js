export const getProductName = (item) => {
  if (!item) return 'Produkt';
  return item.productName || 
         item.title || 
         item.name || 
         item.product?.name || 
         item.product?.title || 
         item.productTitle || 
         item.product_name || 
         item.variant?.product?.name || 
         item.variant?.product?.title || 
         item.variante?.product?.name || 
         item.variante?.product?.title || 
         'Produkt';
};

export const getProductImage = (item) => {
  if (!item) return '/img/warenkorb_icon.png';
  
  // 1. Try to get image from backend
  const src = item.imageUrl || 
              item.productImage || 
              item.image || 
              item.imageSrc || 
              item.image_url || 
              item.productImageUrl || 
              item.product?.imageUrl || 
              item.product?.image || 
              item.variant?.product?.imageUrl || 
              item.variant?.imageUrl || 
              item.variant?.image ||
              item.variante?.product?.imageUrl || 
              item.variante?.imageUrl || 
              item.variante?.image;
  
  if (src && src !== '' && !src.includes('undefined')) return src;

  // 2. Fallback to local images based on name
  const name = getProductName(item).toLowerCase();
  
  if (name.includes('soft') && name.includes('tampon')) return '/img/softtampon.png';
  if (name.includes('tampon')) return '/img/tampon.png';
  if (name.includes('tasse') || name.includes('cup')) return '/img/cupbunt.png';
  if (name.includes('scheibe') || name.includes('disc')) return '/img/menstruationsscheiben_und_tassen.png';
  if (name.includes('highwaist') || name.includes('high waist')) return '/img/highwwaist.png';
  if (name.includes('panty') || name.includes('unterwäsche') || name.includes('slip') || name.includes('pantie')) return '/img/panty.png';
  if (name.includes('binde') || name.includes('pad')) return '/img/binde.png';
  if (name.includes('schwämm') || name.includes('schwaemm') || name.includes('schwamm') || name.includes('sponge')) return '/img/schwaeme.png';
  if (name.includes('wärme') || name.includes('waerme') || name.includes('heat')) return '/img/waermehelfer.png';

  // 3. Default placeholder
  return '/img/warenkorb_icon.png';
};

export const getVariantDisplay = (item) => {
  if (!item) return 'Standard';
  if (item.variantName || item.variantTitle) return item.variantName || item.variantTitle;
  
  // 1. Suche in direkten Feldern oder variant/variante Objekten
  let color = item.color || item.variantColor || item.variant?.color || item.variante?.color;
  let size = item.size || item.variantSize || item.variant?.size || item.variante?.size;
  
  // 2. Fallback: Suche in product.variants anhand von variantId
  if (!color && !size && item.variantId && item.product?.variants) {
    const vId = Number(item.variantId);
    const found = item.product.variants.find(v => Number(v.id) === vId);
    if (found) {
      color = found.color;
      size = found.size;
    }
  }
  
  if (color && size) return `${color} • ${size}`;
  if (color) return color;
  if (size) return size;
  
  return 'Standard';
};
