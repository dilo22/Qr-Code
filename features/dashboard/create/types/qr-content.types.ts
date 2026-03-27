export type CreateQrContentProps = {
  type: string;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  onLiveChange?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
};

export type LinkItem = {
  label: string;
  url: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imagePath?: string;
  imageFileName?: string;
  imageMimeType?: string;
  imageSize?: number;
  order: number;
};

export type MenuSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  items: MenuItem[];
};

export type MenuRestaurant = {
  name: string;
  bio: string;
  phone: string;
  website: string;
  address: string;
  coverImagePath?: string;
  coverImageFileName?: string;
  coverImageMimeType?: string;
  coverImageSize?: number;
};

export type MenuData = {
  restaurant: MenuRestaurant;
  featuredItems: MenuItem[];
  sections: MenuSection[];
};

export type BaseQrFormProps = {
  type?: string;
  form: Record<string, any>;
  handleChange: (field: string, value: any) => void;
  handleFormUpdate: (updated: Record<string, any>) => void;
  isUploading?: boolean;
  setIsUploading?: (value: boolean) => void;
  uploadError?: string | null;
  setUploadError?: (value: string | null) => void;
};