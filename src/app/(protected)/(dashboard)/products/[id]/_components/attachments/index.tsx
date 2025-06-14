import { FC } from "react";
import { FileUploader } from "./file-uploader";
import { FileMetadata } from "@/hooks/use-file-upload";

type AttachmentsProps = {
  productId: string;
  attachments: FileMetadata[];
};

export const Attachments: FC<AttachmentsProps> = ({
  productId,
  attachments,
}) => {
  return (
    <div>
      <FileUploader productId={productId} initialFiles={attachments} />
    </div>
  );
};
