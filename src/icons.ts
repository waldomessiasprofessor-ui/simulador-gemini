/**
 * src/icons.ts — mapa Lucide → Phosphor (drop-in replacement)
 *
 * Cada arquivo do projeto troca apenas:
 *   from "lucide-react"  →  from "@/icons"
 *
 * Ícones semânticos/conteúdo usam weight="duotone".
 * Ícones estruturais/UI usam o peso padrão (regular).
 */
import React from "react";
import {
  Warning,
  ArrowRight        as PhArrowRight,
  ArrowLeft         as PhArrowLeft,
  Medal             as PhMedal,
  ChartBar,
  ChartLineDown,
  ChartLineUp,
  Books,
  BookOpen          as PhBookOpen,
  Brain             as PhBrain,
  Check             as PhCheck,
  CheckCircle,
  CheckSquare       as PhCheckSquare,
  CaretDown, CaretLeft, CaretRight, CaretUp,
  ClipboardText     as PhClipboardText,
  Clock             as PhClock,
  Barbell,
  Eye               as PhEye,
  EyeSlash,
  FileCode,
  FileText          as PhFileText,
  Fire,
  Flask             as PhFlask,
  House,
  UploadSimple,
  Image             as PhImage,
  Info              as PhInfo,
  List,
  CircleNotch,
  Pause             as PhPause,
  PencilSimple,
  PlayCircle        as PhPlayCircle,
  Plus              as PhPlus,
  PlusCircle        as PhPlusCircle,
  Minus             as PhMinus,
  MinusCircle       as PhMinusCircle,
  ArrowsClockwise,
  ArrowCounterClockwise,
  FloppyDisk,
  MagnifyingGlass,
  ShieldCheck       as PhShieldCheck,
  Shield            as PhShield,
  Sparkle,
  Star              as PhStar,
  Stack,
  Sword,
  Confetti,
  CalendarDots,
  Calendar          as PhCalendar,
  DownloadSimple,
  ArrowSquareOut,
  Key               as PhKey,
  Lightbulb         as PhLightbulb,
  Tag               as PhTag,
  Target            as PhTarget,
  ThumbsDown        as PhThumbsDown,
  ThumbsUp          as PhThumbsUp,
  Timer             as PhTimer,
  Trash,
  Trophy            as PhTrophy,
  X                 as PhX,
  XCircle           as PhXCircle,
  YoutubeLogo,
  Lightning,
  type Icon,
} from "@phosphor-icons/react";

// Pré-aplica weight="duotone" num componente Phosphor.
// O resultado aceita className/size/style exatamente como Lucide.
function duo(Ic: React.ElementType) {
  return function D(props: React.ComponentPropsWithoutRef<"svg"> & { size?: number | string; weight?: string }) {
    return React.createElement(Ic as any, { weight: "duotone", ...props });
  };
}

// ── Semânticos (duotone) ─────────────────────────────────────────────────────
export const BookOpen       = duo(Books);
export const BookOpenCheck  = duo(PhBookOpen);
export const Brain          = duo(PhBrain);
export const Award          = duo(PhMedal);
export const BarChart2      = duo(ChartBar);
export const Dumbbell       = duo(Barbell);
export const Flame          = duo(Fire);
export const FlaskConical   = duo(PhFlask);
export const Home           = duo(House);
export const Layers         = duo(Stack);
export const Lightbulb      = duo(PhLightbulb);
export const Medal          = duo(PhMedal);
export const PartyPopper    = duo(Confetti);
export const PlayCircle     = duo(PhPlayCircle);
export const Shield         = duo(PhShield);
export const Star           = duo(PhStar);
export const Swords         = duo(Sword);
export const Target         = duo(PhTarget);
export const Timer          = duo(PhTimer);
export const TrendingDown   = duo(ChartLineDown);
export const TrendingUp     = duo(ChartLineUp);
export const Trophy         = duo(PhTrophy);
export const Youtube        = duo(YoutubeLogo);
export const Zap            = duo(Lightning);
export const ShieldCheck    = duo(PhShieldCheck);
export const FileText       = duo(PhFileText);
export const Sparkles       = duo(Sparkle);
export const CalendarDays   = duo(CalendarDots);
export const Calendar       = duo(PhCalendar);

// ── Estruturais / UI (regular) ───────────────────────────────────────────────
export const AlertCircle    = Warning;
export const AlertTriangle  = Warning;
export const ArrowLeft      = PhArrowLeft;
export const ArrowRight     = PhArrowRight;
export const Check          = PhCheck;
export const CheckCircle2   = CheckCircle;
export const CheckSquare    = PhCheckSquare;
export const ChevronDown    = CaretDown;
export const ChevronLeft    = CaretLeft;
export const ChevronRight   = CaretRight;
export const ChevronUp      = CaretUp;
export const ClipboardPaste = PhClipboardText;
export const Clock          = PhClock;
export const Download       = DownloadSimple;
export const ExternalLink   = ArrowSquareOut;
export const Eye            = PhEye;
export const EyeOff         = EyeSlash;
export const FileCode2      = FileCode;
export const ImageUp        = UploadSimple;
export const Image          = PhImage;
export const Info           = PhInfo;
export const KeyRound       = PhKey;
export const LayoutList     = List;
export const Loader2        = CircleNotch;   // use animate-spin in className
export const Minus          = PhMinus;
export const MinusCircle    = PhMinusCircle;
export const Pause          = PhPause;
export const Pencil         = PencilSimple;
export const Plus           = PhPlus;
export const PlusCircle     = PhPlusCircle;
export const RefreshCw      = ArrowsClockwise;
export const RotateCcw      = ArrowCounterClockwise;
export const Save           = FloppyDisk;
export const Search         = MagnifyingGlass;
export const Tag            = PhTag;
export const ThumbsDown     = PhThumbsDown;
export const ThumbsUp       = PhThumbsUp;
export const Trash2         = Trash;
export const X              = PhX;
export const XCircle        = PhXCircle;

// Compatibilidade de tipo com código que usa LucideIcon como anotação
export type LucideIcon = Icon;
