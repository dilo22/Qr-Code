import HostedFileField from "../HostedFileField";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function FileForm(props: BaseQrFormProps) {
  const {
    type = "file",
    form,
    handleFormUpdate,
    isUploading = false,
    setIsUploading = () => {},
    uploadError = null,
    setUploadError = () => {},
  } = props;

  return (
    <HostedFileField
      type={type}
      form={form}
      onFormUpdate={handleFormUpdate}
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      uploadError={uploadError}
      setUploadError={setUploadError}
    />
  );
}