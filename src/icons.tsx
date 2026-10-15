/* ═══════════════════════════════════════════════════════════════════════
   PANCE — iconography
   A semantic alias layer over Phosphor Icons. Components reference intent
   (IconDanger, IconStream) rather than a vendor name, so the underlying
   library can be swapped or a glyph re-mapped in one place.
   Default weight is `regular` at 20–24px.
   ═══════════════════════════════════════════════════════════════════════ */
import {
  ArrowDown,
  ArrowRight,
  ArrowSquareOut,
  ArrowUp,
  Article,
  At,
  Cards as CardsIcon,
  Columns,
  Bell,
  BellRinging,
  Broadcast,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  Check,
  CheckCircle,
  CircleNotch,
  Question,
  Copy,
  Cube,
  CurrencyDollar,
  Database,
  DotsNine,
  DotsThreeVertical,
  DownloadSimple,
  Envelope,
  Eye,
  EyeSlash,
  FirstAidKit,
  Folder,
  Funnel,
  Gauge,
  GearSix,
  GitBranch,
  Globe,
  Heart,
  House,
  Buildings,
  MapPin,
  Ambulance,
  Tent,
  Info,
  List,
  Lock,
  MagnifyingGlass,
  Moon,
  Palette,
  PencilSimple,
  Percent,
  Phone,
  Plus,
  Pulse,
  Ruler,
  ShieldCheck,
  Sparkle,
  SquaresFour,
  Stack,
  Star,
  TextAa,
  Trash,
  UploadSimple,
  User,
  UsersThree,
  Warning,
  Waveform,
  X,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

export type IconProps = { className?: string; size?: number | string; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }
export type IconType = PhosphorIcon

/* Brand & domain */
export const IconWave = Waveform
export const IconStream = Broadcast
export const IconFlow = GitBranch
export const IconPulse = Pulse
export const IconGauge = Gauge
export const IconDatabase = Database
export const IconGlobe = Globe
export const IconShield = ShieldCheck
export const IconSparkle = Sparkle

/* Navigation & structure */
export const IconGrid = SquaresFour
export const IconColumns = Columns
export const IconCards = CardsIcon
export const IconArticle = Article
export const IconLayers = Stack
export const IconComponents = Cube
export const IconGripSquare = DotsNine
export const IconFolder = Folder
export const IconHome = House
export const IconChart = ChartLineUp
export const IconChevron = CaretRight
export const IconChevronDown = CaretDown
export const IconChevronLeft = CaretLeft
export const IconDots = DotsThreeVertical
export const IconExternal = ArrowSquareOut

/* Foundations */
export const IconTypography = TextAa
export const IconPalette = Palette
export const IconRuler = Ruler

/* Actions */
export const IconEdit = PencilSimple
export const IconTrash = Trash
export const IconCopy = Copy
export const IconPlus = Plus
export const IconDownload = DownloadSimple
export const IconSearch = MagnifyingGlass
export const IconFilter = Funnel
export const IconX = X
export const IconList = List
export const IconCheck = Check
export const IconSpinner = CircleNotch

/* Status & feedback */
export const IconAlert = Warning
export const IconInfo = Info
export const IconQuestion = Question
export const IconCheckCircle = CheckCircle
export const IconBell = Bell
export const IconBellRinging = BellRinging

/* Directional */
export const IconArrowUp = ArrowUp
export const IconArrowDown = ArrowDown
export const IconArrowRight = ArrowRight

/* Misc */
export const IconUsers = UsersThree
export const IconGear = GearSix
export const IconMail = Envelope
export const IconLock = Lock
export const IconStar = Star
export const IconHeart = Heart
export const IconMoon = Moon
export const IconEye = Eye
export const IconEyeOff = EyeSlash
export const IconAt = At
export const IconCalendar = CalendarBlank
export const IconPhone = Phone
export const IconUser = User
export const IconUpload = UploadSimple
export const IconCurrency = CurrencyDollar
export const IconPercent = Percent

/* Emergency / geo */
export const IconMapPin    = MapPin
export const IconFirstAid  = FirstAidKit
export const IconTent      = Tent
export const IconBuildings = Buildings
export const IconAmbulance = Ambulance
