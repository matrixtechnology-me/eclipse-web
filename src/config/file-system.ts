export const FILE_SYSTEM = {
  ROOT: {
    PRODUCTS: {
      PRODUCT: (productId: string) => ({
        INDEX: {
          KEY: `fs.root.products.product-[${productId}]`,
          PATH: `/root/products/${productId}`,
        },
        ATTACHMENTS: {
          ATTACHMENT: (
            attachmentId: string,
            fileId: string,
            fileExtension: string
          ) => ({
            KEY: `fs.root.products.product-[${productId}].attachments.attachment-[${attachmentId}]`,
            PATH: `/root/products/${productId}/attachments/${attachmentId}/${fileId}.${fileExtension}`,
          }),
        },
      }),
    },
  },
};
