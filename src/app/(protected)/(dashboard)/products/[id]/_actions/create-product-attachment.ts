"use server";

import { FILE_SYSTEM } from "@/config/file-system";
import { ConflictError, InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { R2Service } from "@/services/cloudflare/r2";
import { randomUUID } from "crypto";

type CreateProductAttachmentActionPayload = {
  uploadFile: File;
  productId: string;
};

type CreateProductAttachmentActionResult = {
  attachmentId: string;
  fileUrl: string;
};

export const createProductAttachment: Action<
  CreateProductAttachmentActionPayload,
  CreateProductAttachmentActionResult
> = async ({ uploadFile, productId }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return failure(new NotFoundError("Product not found"));

    const r2Service = new R2Service();

    const uploadFileBuffer = Buffer.from(await uploadFile.arrayBuffer());

    const randomAttachmentId = randomUUID();
    const randomFileId = randomUUID();

    const uploadFileExtension = uploadFile.name.split(".").pop()?.toLowerCase();

    if (!uploadFileExtension)
      return failure(new ConflictError("Invalid file: extension not found."));

    const upload = await r2Service.upload({
      path: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(
        product.id
      ).ATTACHMENTS.ATTACHMENT(
        randomAttachmentId,
        randomFileId,
        uploadFileExtension
      ).PATH,
      body: uploadFileBuffer,
      fileType: uploadFile.type,
    });

    const folder = await prisma.folder.upsert({
      where: { key: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(product.id).INDEX.KEY },
      create: {
        name: product.name,
        key: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(product.id).INDEX.KEY,
      },
      update: {},
    });

    const file = await prisma.file.create({
      data: {
        name: uploadFile.name,
        key: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(
          product.id
        ).ATTACHMENTS.ATTACHMENT(
          randomAttachmentId,
          randomFileId,
          uploadFileExtension
        ).KEY,
        mimeType: uploadFile.type,
        size: uploadFile.size,
        url: upload.url,
        folderId: folder.id,
      },
    });

    const attachment = await prisma.productAttachment.create({
      data: {
        id: randomAttachmentId,
        fileId: file.id,
        productId: product.id,
      },
    });

    return success({ attachmentId: attachment.id, fileUrl: file.url });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError());
  }
};
