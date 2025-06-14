"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import {
  FileMetadata,
  FileWithPreview,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { createProductAttachment } from "../../_actions/create-product-attachment";
import { deleteProductAttachment } from "../../_actions/delete-product-attachment";

const MAX_SIZEMB = 5;
const MAX_SIZE = MAX_SIZEMB * 1024 * 1024;
const MAX_FILES = 6;

type FileUploaderProps = {
  productId: string;
  initialFiles?: FileMetadata[];
};

export const FileUploader: FC<FileUploaderProps> = ({
  productId,
  initialFiles = [],
}) => {
  const handleOnFilesAdded = async (addedFiles: FileWithPreview[]) => {
    const addedFile = addedFiles[0];

    await createProductAttachment({
      productId,
      uploadFile: addedFile.file as File,
    });
  };

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize: MAX_SIZE,
    multiple: true,
    maxFiles: MAX_FILES,
    initialFiles,
    onFilesAdded: handleOnFilesAdded,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Enviar arquivo de imagem"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Imagens enviadas ({files.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={files.length >= MAX_FILES}
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Adicionar mais
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-12">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={async () => {
                      removeFile(file.id);
                      deleteProductAttachment({
                        attachmentId: file.id,
                      });
                    }}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remover imagem"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Arraste suas imagens aqui
            </p>
            <p className="text-muted-foreground text-xs">
              SVG, PNG, JPG ou GIF (máx. {MAX_SIZEMB}MB)
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Selecionar imagens
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};
