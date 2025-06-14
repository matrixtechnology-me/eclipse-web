export const FILE_SYSTEM = {
  ROOT: {
    PRODUCTS: {
      PRODUCT: (productId: string) => ({
        INDEX: {
          KEY: `fs.root.products.product-[${productId}]`,
          PATH: `/lib/products/${productId}`,
        },
        ATTACHMENTS: {
          ATTACHMENT: (attachmentId: string, fileExtension: string) => ({
            KEY: `fs.root.products.product-[${productId}].attachments.attachment-[${attachmentId}]`,
            PATH: `/lib/products/${productId}/attachments/${attachmentId}.${fileExtension}`,
          }),
        },
      }),
    },
  },
};
