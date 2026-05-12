import { useEffect, useId, useRef, useState } from "react";
import {
  MdDarkMode,
  MdDiamond,
  MdHelpOutline,
  MdKeyboardArrowDown,
  MdLogout,
  MdMailOutline,
  MdNotificationsNone,
  MdOutlinePerson,
  MdSearch,
  MdSettings,
} from "react-icons/md";

/** Desktop search cap; keep in sync with layout breakpoints if you change width. */
const SEARCH_MAX_PX = 1120;

const searchInputClassName =
  "w-full border border-[#ECE4D9] bg-white py-2.5 pl-9 pr-16 text-lg text-[#000000] placeholder:text-[#70563F]/70 outline-none transition-colors focus:border-[#70563F] focus:ring-2 focus:ring-[#70563F]/10";

function UnreadBadge({ count }) {
  if (count <= 0) return null;
  const text = count > 99 ? "99+" : String(count);
  return (
    <span
      className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-[#F9F9F9]"
      aria-hidden
    >
      {text}
    </span>
  );
}

function GlobalSearchField({ inputId }) {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#70563F]">
        <MdSearch className="h-5 w-5" aria-hidden />
      </span>
      <input
        id={inputId}
        type="search"
        name="q"
        placeholder="Search..."
        autoComplete="off"
        aria-label="Search"
        className={searchInputClassName}
      />
      <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center border border-[#ECE4D9] bg-[#F9F9F9] px-2 py-1 text-[11px] font-medium text-[#70563F]">
        <MdDiamond className="h-5 w-5 text-[#D4AF37]" aria-hidden />
      </span>
    </div>
  );
}

function Header({
  name = "Adina",
  subtitle = "Let's check your store today",
  role = "Admin",
  unreadMessageCount = 2,
  unreadNotificationCount = 5,
  onMessages,
  onProfile,
  onSettings,
  onNotifications,
  onHelp,
  onLogout = () => {},
}) {
  const searchFieldId = useId();
  const mobileSearchId = useId();
  const menuId = useId();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const profileMenuRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } catch {
      /* private mode / blocked */
    }
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    function onDocPointerDown(e) {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(e.target)) return;
      setIsProfileMenuOpen(false);
    }

    function onDocKeyDown(e) {
      if (e.key === "Escape") setIsProfileMenuOpen(false);
    }

    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [isProfileMenuOpen]);

  const searchMaxStyle = { maxWidth: `min(${SEARCH_MAX_PX}px, 100%)` };

  const messagesUnread = Math.max(0, Math.floor(Number(unreadMessageCount) || 0));
  const notificationsUnread = Math.max(0, Math.floor(Number(unreadNotificationCount) || 0));
  const messagesAria =
    messagesUnread > 0 ? `Messages, ${messagesUnread} unread` : "Messages";
  const notificationsAria =
    notificationsUnread > 0
      ? `Notifications, ${notificationsUnread} unread`
      : "Notifications";

  return (
    <header
      className="fixed left-[250px] right-0 top-0 z-40 bg-[#ECE4D9]/25"
      aria-label="Application header"
    >
      <div className="w-full border-b border-[#ECE4D9] bg-[#F9F9F9] px-4 py-3 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] sm:px-6 lg:px-20">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 shrink-0 sm:max-w-[min(420px,48%)]">
              <p
                className="truncate text-base font-semibold leading-tight text-[#000000] sm:text-lg"
                title={`Hi, ${name}`}
              >
                Hi, {name}
              </p>
              <p
                className="mt-0.5 truncate text-sm leading-tight text-[#70563F] sm:text-base"
                title={subtitle}
              >
                {subtitle}
              </p>
            </div>

            <div className="hidden min-w-0 flex-1 sm:flex sm:justify-center sm:px-2">
              <div className="w-full" style={searchMaxStyle}>
                <GlobalSearchField inputId={searchFieldId} />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-3">
              <button
                type="button"
                onClick={() => onMessages?.()}
                className="relative grid h-10 w-10 place-items-center border border-transparent text-[#000000] hover:bg-[#ECE4D9]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/40 active:scale-[0.98]"
                aria-label={messagesAria}
              >
                <MdMailOutline className="h-6 w-6" aria-hidden />
                <UnreadBadge count={messagesUnread} />
              </button>

              <button
                type="button"
                onClick={() => onNotifications?.()}
                className="relative grid h-10 w-10 place-items-center border border-transparent text-[#000000] hover:bg-[#ECE4D9]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/40 active:scale-[0.98]"
                aria-label={notificationsAria}
              >
                <MdNotificationsNone className="h-6 w-6" aria-hidden />
                <UnreadBadge count={notificationsUnread} />
              </button>

              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  id={`profile-trigger-${menuId}`}
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  className={[
                    "flex min-w-0 max-w-full items-center gap-3 border border-transparent px-2 py-1",
                    "hover:bg-[#ECE4D9]/45 active:bg-[#ECE4D9]/60",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/40",
                    isProfileMenuOpen ? "bg-[#ECE4D9]/40" : "",
                  ].join(" ")}
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-controls={isProfileMenuOpen ? `profile-menu-${menuId}` : undefined}
                  aria-label={`Account menu, ${name}`}
                >
                  <div className="grid h-10 w-10 place-items-center overflow-hidden bg-[#ECE4D9] text-sm font-semibold text-[#70563F]">
                    {name?.slice(0, 1)?.toUpperCase() ?? "A"}
                  </div>
                  <div className="hidden min-w-0 text-left sm:block sm:max-w-[min(11rem,calc(100vw-22rem))]">
                    <div
                      className="truncate text-sm font-semibold leading-tight text-[#000000] sm:text-base"
                      title={name}
                    >
                      {name}
                    </div>
                    <div className="truncate text-xs leading-tight text-[#70563F] sm:text-sm" title={role}>
                      {role}
                    </div>
                  </div>
                  <span
                    className={[
                      "hidden h-8 w-8 place-items-center text-[#70563F] transition-transform sm:grid",
                      isProfileMenuOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <MdKeyboardArrowDown className="h-6 w-6" />
                  </span>
                </button>

                {isProfileMenuOpen ? (
                  <div
                    id={`profile-menu-${menuId}`}
                    role="menu"
                    aria-labelledby={`profile-trigger-${menuId}`}
                    className="absolute right-0 top-[calc(100%+10px)] z-[60] w-64 overflow-hidden border border-[#ECE4D9] bg-white shadow-lg"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onProfile?.();
                      }}
                      className="group relative flex w-full items-center gap-3 px-4 py-3 text-left text-base font-medium text-[#000000] hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <MdOutlinePerson className="h-6 w-6 text-[#70563F]" aria-hidden />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSettings?.();
                      }}
                      className="group relative flex w-full items-center gap-3 px-4 py-3 text-left text-base font-medium text-[#000000] hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <MdSettings className="h-6 w-6 text-[#70563F]" aria-hidden />
                      <span>Settings</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNotifications?.();
                      }}
                      className="group relative flex w-full items-center gap-3 px-4 py-3 text-left text-base font-medium text-[#000000] hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <MdNotificationsNone className="h-6 w-6 text-[#70563F]" aria-hidden />
                      <span>Notifications</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setIsDarkMode((v) => !v)}
                      className={[
                        "group relative flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-medium text-[#000000]",
                        "hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35",
                        isDarkMode ? "bg-[#ECE4D9]/30" : "",
                      ].join(" ")}
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <span className="flex items-center gap-3">
                        <MdDarkMode className="h-6 w-6 text-[#70563F]" aria-hidden />
                        <span>Dark Mode</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={[
                          "relative inline-flex h-6 w-11 items-center rounded-full border border-[#ECE4D9] p-0.5 transition-colors",
                          isDarkMode ? "bg-[#70563F]" : "bg-[#F9F9F9]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                            isDarkMode ? "translate-x-5" : "translate-x-0",
                          ].join(" ")}
                        />
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onHelp?.();
                      }}
                      className="group relative flex w-full items-center gap-3 px-4 py-3 text-left text-base font-medium text-[#000000] hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <MdHelpOutline className="h-6 w-6 text-[#70563F]" aria-hidden />
                      <span>Help</span>
                    </button>

                    <div className="h-px w-full bg-[#ECE4D9]" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="group relative w-full px-4 py-3 text-left text-base font-semibold text-[#000000] hover:bg-[#F9F9F9] active:bg-[#ECE4D9]/35"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#70563F] group-focus-visible:bg-[#70563F]" />
                      <span className="flex items-center gap-3">
                        <MdLogout className="h-6 w-6 text-[#70563F]" aria-hidden />
                        <span>Logout</span>
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#ECE4D9] bg-[#F9F9F9] px-4 py-3 sm:hidden">
        <div className="w-full" style={searchMaxStyle}>
          <GlobalSearchField inputId={mobileSearchId} />
        </div>
      </div>
    </header>
  );
}

export default Header;
