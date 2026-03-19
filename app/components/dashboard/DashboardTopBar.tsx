import Link from "next/link";
import type { DashboardDictionary, LanguageCode } from "../../lib/i18n";
import styles from "./DashboardTopBar.module.css";

type LanguageOption = {
  code: LanguageCode;
  href: string;
  label: string;
  isCurrent: boolean;
};

type DashboardTopBarProps = {
  componentId: string;
  search: DashboardDictionary["search"];
  topBar: DashboardDictionary["topBar"];
  languageAriaLabel: string;
  languageOptions: LanguageOption[];
};

export function DashboardTopBar({
  componentId,
  search,
  topBar,
  languageAriaLabel,
  languageOptions,
}: DashboardTopBarProps) {
  return (
    <header
      id="resumo"
      className={`dashboard-top-slot ${styles["top-bar"]}`}
      data-component={componentId}
      data-slot="dashboard-top-bar"
    >
      <form
        className={styles["search-form"]}
        data-slot="dashboard-search-form"
        role="search"
        aria-label={search.aria}
      >
        <label className="sr-only" htmlFor="dashboard-search">
          {search.label}
        </label>
        <div className={styles["search-input-wrap"]} data-slot="dashboard-search-input-wrap">
          <input
            id="dashboard-search"
            name="q"
            type="search"
            className={styles["search-input"]}
            data-slot="dashboard-search-input"
            placeholder={search.placeholder}
          />
          <span className={styles["search-icon"]} data-slot="dashboard-search-icon" aria-hidden="true" />
        </div>
      </form>

      <div
        className={styles["top-right-tools"]}
        data-slot="dashboard-top-tools"
        role="group"
        aria-label={topBar.aria.tools}
      >
        <div
          className={styles["top-actions"]}
          data-slot="dashboard-top-actions"
          role="group"
          aria-label={topBar.aria.actions}
        >
          <button
            type="button"
            className={styles["top-icon-btn"]}
            data-slot="dashboard-notifications-button"
            aria-label={topBar.aria.notifications}
          >
            <span
              className={`${styles["top-icon"]} ${styles["top-icon-bell"]}`}
              data-slot="dashboard-notifications-icon"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className={styles["top-icon-btn"]}
            data-slot="dashboard-settings-button"
            aria-label={topBar.aria.settings}
          >
            <span
              className={`${styles["top-icon"]} ${styles["top-icon-gear"]}`}
              data-slot="dashboard-settings-icon"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className={styles["top-user-btn"]}
            data-slot="dashboard-profile-button"
            aria-label={topBar.aria.profile}
          >
            <span
              className={`${styles["top-user-avatar"]} upload-area`}
              data-slot="dashboard-profile-avatar"
              aria-hidden="true"
            />
            <span className={styles["top-user-copy"]} data-slot="dashboard-profile-copy">
              <span className={styles["top-user-name"]} data-slot="dashboard-profile-name">
                {topBar.user.name}
              </span>
              <span className={styles["top-user-email"]} data-slot="dashboard-profile-email">
                {topBar.user.email}
              </span>
            </span>
          </button>

          <button
            type="button"
            className={styles["top-widget-btn"]}
            data-slot="dashboard-add-widget-button"
            aria-label={topBar.aria.addWidget}
          >
            <span className={styles["top-widget-icon"]} data-slot="dashboard-add-widget-icon" aria-hidden="true" />
            <span>{topBar.addWidget}</span>
          </button>
        </div>

        <div
          className={styles["language-switcher"]}
          data-slot="dashboard-language-switcher"
          role="group"
          aria-label={languageAriaLabel}
        >
          {languageOptions.map((option) => (
            <Link
              key={option.code}
              href={option.href}
              className={`${styles["lang-btn"]}${option.isCurrent ? ` ${styles["lang-btn-active"]}` : ""}`}
              data-slot="dashboard-language-button"
              aria-current={option.isCurrent ? "page" : undefined}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
