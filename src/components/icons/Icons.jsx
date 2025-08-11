
const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
}

export const MoneyIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const ChartIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M4 19h16M8 17V9m4 8V5m4 12v-6" />
  </svg>
)

export const BagIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
    <path d="M9 8a3 3 0 1 1 6 0" />
  </svg>
)

export const UsersIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M16 14a4 4 0 1 0-8 0" />
    <circle cx="12" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 18 0" />
  </svg>
)

export const PackageIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="M3.3 7L12 12l8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

export const WarningIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.28 3.86a2 2 0 0 0-3 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

export const SettingsIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .65.39 1.24 1 1.51.3.14.64.22 1 .22H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
)

export const ClipboardIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M9 5h6M9 3h6a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2Z" />
    <rect x="7" y="7" width="10" height="14" rx="2" />
  </svg>
)

export const ClockIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)

export const CheckIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="m20 6-11 11L4 12" />
  </svg>
)

export const PlusIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const PencilIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} {...baseProps}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
)

export const TrashIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} {...baseProps}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const DashboardIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M3 13h8V3H3v10Zm10 8h8V3h-8v18Zm-10 0h8v-6H3v6Z" />
  </svg>
)

export const LeafIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} {...baseProps}>
    <path d="M12 3C7 3 4 7 4 11c0 5 4 8 8 8s8-3 8-8c0-4-3-8-8-8Z" />
    <path d="M12 19c0-4-2-8-6-10" />
  </svg>
)

export default {
  MoneyIcon,
  ChartIcon,
  BagIcon,
  UsersIcon,
  PackageIcon,
  WarningIcon,
  SettingsIcon,
  ClipboardIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DashboardIcon,
  LeafIcon,
}

