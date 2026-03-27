import MenuEditor from "../menu/MenuEditor";
import { createEmptyMenuData } from "@/features/dashboard/create/lib/qr-content.helpers";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function MenuForm(props: BaseQrFormProps) {
  const {
    form,
    handleFormUpdate,
    isUploading = false,
    setIsUploading = () => {},
    uploadError = null,
    setUploadError = () => {},
  } = props;

  return (
    <MenuEditor
      value={form.menuData || createEmptyMenuData()}
      onChange={(nextMenuData) =>
        handleFormUpdate({
          ...form,
          menuData: nextMenuData,
        })
      }
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      uploadError={uploadError}
      setUploadError={setUploadError}
    />
  );
}