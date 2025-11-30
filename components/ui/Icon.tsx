import {
  Smartphone,
  RefreshCw,
  Frown,
  Clock,
  Bell,
  Eye,
  TrendingDown,
  Shield,
  Activity,
  BarChart2,
  Lightbulb,
  Target,
  BookOpen,
  ArrowRight,
  Check,
  Menu,
  X,
  Moon,
  Cloud,
  Battery,
  Sunrise,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PenSquare,
  BarChart3,
  Trash2,
  Calendar,
  AlertCircle,
  Info,
  Heart,
  Star,
  Zap,
  Brain,
  MessageCircle,
  CircleDot,
  ArrowUp,
  ArrowDown,
  LucideProps,
} from "lucide-react";

export const Icons = {
  Smartphone,
  RefreshCw,
  Frown,
  Clock,
  Bell,
  Eye,
  TrendingDown,
  Shield,
  Activity,
  BarChart2,
  Lightbulb,
  Target,
  BookOpen,
  ArrowRight,
  Check,
  Menu,
  X,
  Moon,
  Cloud,
  Battery,
  Sunrise,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PenSquare,
  BarChart3,
  Trash2,
  Calendar,
  AlertCircle,
  Info,
  Heart,
  Star,
  Zap,
  Brain,
  MessageCircle,
  CircleDot,
  ArrowUp,
  ArrowDown,
};

export type IconName = keyof typeof Icons;

interface IconProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <LucideIcon {...props} />;
}
