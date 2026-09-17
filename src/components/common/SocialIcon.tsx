import React from 'react';
import {
  Instagram,
  Facebook,
  Send,
  MessageSquare,
  Youtube,
  Twitter,
  Music,
  Globe,
  Share2,
} from 'lucide-react';
import { SocialPlatformIcon } from '../../types';

interface SocialIconProps {
  icon?: SocialPlatformIcon | string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ icon, className = 'w-4 h-4' }) => {
  const normalized = (icon || '').toLowerCase();

  switch (normalized) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'tiktok':
      return <Music className={className} />;
    case 'messenger':
      return <MessageSquare className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'x':
    case 'twitter':
      return <Twitter className={className} />;
    case 'custom':
    case 'website':
    case 'globe':
      return <Globe className={className} />;
    default:
      return <Share2 className={className} />;
  }
};
