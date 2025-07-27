"use server";

import { FILE_SYSTEM } from "@/config/file-system";
import { ConflictError, InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { S3Service } from "@/services/aws/s3.service";
import { STSService } from "@/services/aws/sts.service";
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

    const stsService = new STSService();

    const credentials = await stsService.assumeRole(
      process.env.AWS_ROLE_ARN || "",
      "create-product-attachment"
    );

    const s3Service = new S3Service(credentials);

    const uploadFileBuffer = Buffer.from(await uploadFile.arrayBuffer());

    const randomAttachmentId = randomUUID();
    const randomFileId = randomUUID();

    const uploadFileExtension = uploadFile.name.split(".").pop()?.toLowerCase();

    if (!uploadFileExtension)
      return failure(new ConflictError("Invalid file: extension not found."));

    const filePath = FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(
      product.id
    ).ATTACHMENTS.ATTACHMENT(
      randomAttachmentId,
      randomFileId,
      uploadFileExtension
    ).PATH;

    await s3Service.putObject(
      process.env.AWS_BUCKET_NAME || "",
      filePath,
      uploadFileBuffer
    );

    const folder = await prisma.folder.upsert({
      where: { key: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(product.id).INDEX.KEY },
      create: {
        name: product.name,
        key: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(product.id).INDEX.KEY,
      },
      update: {},
    });

    const cloudfrontDistributionUrl =
      process.env.AWS_CLOUDFRONT_DISTRIBUTION_URL || "";

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
        url: cloudfrontDistributionUrl + "/" + filePath,
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
