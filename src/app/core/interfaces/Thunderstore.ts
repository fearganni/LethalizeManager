export interface ModInfo {
  categories: string[];
  date_created: string;
  date_updated: string;
  donation_link: string;
  full_name: string;
  has_nsfw_content: boolean;
  is_deprecated: boolean;
  is_pinned: boolean;
  name: string;
  owner: string;
  package_url: string;
  rating_score: number;
  uuid4: string;
  versions: VersionInfo[];
}

export interface VersionInfo {
  date_created: string;
  dependencies: string[]; // Assuming dependencies are an array of strings
  description: string;
  download_url: string;
  downloads: number;
  file_size: number;
  full_name: string;
  icon: string;
  is_active: boolean;
  name: string;
  uuid4: string;
  version_number: string;
  website_url: string;
}
