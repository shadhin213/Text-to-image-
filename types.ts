export type Category = 'General' | 'Photography' | 'Digital Art' | 'Sci-Fi' | 'Fantasy' | 'Abstract';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageRecord {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  category: Category;
  aspectRatio: AspectRatio;
}

export type View = 'home' | 'user' | 'admin';