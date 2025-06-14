"use server";

import { FILE_SYSTEM } from "@/config/file-system";
import { ConflictError, InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { R2Service } from "@/services/cloudflare/r2";

type DeleteProductAttachmentActionPayload = {
  attachmentId: string;
};

type DeleteProductAttachmentActionResult = {
  success: boolean;
};

export const deleteProductAttachment: Action<
  DeleteProductAttachmentActionPayload,
  DeleteProductAttachmentActionResult
> = async ({ attachmentId }) => {
  try {
    const attachment = await prisma.productAttachment.findUnique({
      where: { id: attachmentId },
      include: { file: true },
    });

    if (!attachment) return failure(new NotFoundError("Attachment not found"));

    const file = attachment.file;

    const uploadFileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!uploadFileExtension)
      return failure(new ConflictError("Invalid file: extension not found."));

    const r2Service = new R2Service();

    await r2Service.delete({
      path: FILE_SYSTEM.ROOT.PRODUCTS.PRODUCT(
        attachment.productId
      ).ATTACHMENTS.ATTACHMENT(attachment.file.id, uploadFileExtension).PATH,
    });

    await prisma.productAttachment.delete({
      where: { id: attachmentId },
    });

    await prisma.file.delete({
      where: { id: file.id },
    });

    return success({ success: true });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError());
  }
};
