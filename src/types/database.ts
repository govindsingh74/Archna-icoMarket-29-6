export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          location: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      password_reset_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string;
          used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          expires_at: string;
          used?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          expires_at?: string;
          used?: boolean;
          created_at?: string;
        };
      };
      hero_images: {
        Row: {
          id: number;
          image_url: string;
          alt_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          image_url: string;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          image_url?: string;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      token_listings: {
        Row: {
          id: number;
          user_id: string;
          token_name: string;
          token_symbol: string;
          token_description: string;
          token_logo_url: string | null;
          website_url: string | null;
          telegram_url: string | null;
          twitter_url: string | null;
          contract_address: string | null;
          total_supply: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          token_name: string;
          token_symbol: string;
          token_description: string;
          token_logo_url?: string | null;
          website_url?: string | null;
          telegram_url?: string | null;
          twitter_url?: string | null;
          contract_address?: string | null;
          total_supply?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          token_name?: string;
          token_symbol?: string;
          token_description?: string;
          token_logo_url?: string | null;
          website_url?: string | null;
          telegram_url?: string | null;
          twitter_url?: string | null;
          contract_address?: string | null;
          total_supply?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_logos: {
        Row: {
          id: number;
          company_name: string;
          logo_url: string;
          alt_text: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_name: string;
          logo_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          company_name?: string;
          logo_url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ico_listings: {
        Row: {
          id: string;
          user_id: string;
          listing_type: 'free' | 'silver' | 'gold';
          project_name: string;
          project_symbol: string;
          total_supply: string | null;
          contract_address: string;
          relationship_with_project: string;
          project_launch_date: string | null;
          country_of_origin: string;
          project_tags: string | null;
          project_description: string;
          project_keypoints: string | null;
          network: string;
          decimals: number;
          logo_url: string;
          website_url: string;
          block_explorer_link: string;
          whitepaper_link: string;
          twitter_url: string | null;
          telegram_url: string | null;
          facebook_url: string | null;
          linkedin_url: string | null;
          ico_start_date: string;
          ico_end_date: string;
          ico_price: string;
          comments: string | null;
          is_active: boolean;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_type: 'free' | 'silver' | 'gold';
          project_name: string;
          project_symbol: string;
          total_supply?: string | null;
          contract_address: string;
          relationship_with_project: string;
          project_launch_date?: string | null;
          country_of_origin: string;
          project_tags?: string | null;
          project_description: string;
          project_keypoints?: string | null;
          network?: string;
          decimals?: number;
          logo_url: string;
          website_url: string;
          block_explorer_link: string;
          whitepaper_link: string;
          twitter_url?: string | null;
          telegram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          ico_start_date: string;
          ico_end_date: string;
          ico_price: string;
          comments?: string | null;
          is_active?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_type?: 'free' | 'silver' | 'gold';
          project_name?: string;
          project_symbol?: string;
          total_supply?: string | null;
          contract_address?: string;
          relationship_with_project?: string;
          project_launch_date?: string | null;
          country_of_origin?: string;
          project_tags?: string | null;
          project_description?: string;
          project_keypoints?: string | null;
          network?: string;
          decimals?: number;
          logo_url?: string;
          website_url?: string;
          block_explorer_link?: string;
          whitepaper_link?: string;
          twitter_url?: string | null;
          telegram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          ico_start_date?: string;
          ico_end_date?: string;
          ico_price?: string;
          comments?: string | null;
          is_active?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}