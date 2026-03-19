import type { DashboardDictionary } from "../../lib/i18n";
import styles from "./DashboardSidebar.module.css";

type DashboardSidebarProps = {
  copy: DashboardDictionary["sidebar"];
  aria: Pick<DashboardDictionary["aria"], "sidebar" | "mainNav">;
  componentId: string;
};

export function DashboardSidebar({ copy, aria, componentId }: DashboardSidebarProps) {
  return (
    <aside
      className={`dashboard-sidebar-slot ${styles.sidebar}`}
      aria-label={aria.sidebar}
      data-component={componentId}
      data-slot="dashboard-sidebar"
    >
      <nav aria-label={aria.mainNav} className={styles["sidebar-nav"]} data-slot="dashboard-sidebar-nav">
        <ul className={styles["sidebar-menu"]} data-slot="dashboard-sidebar-menu">
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#resumo">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.dashboard}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.accounts}</span>
            </a>
          </li>
          <li>
            <details className={styles["sidebar-accordion"]} data-slot="dashboard-sidebar-accordion" open>
              <summary className={styles["sidebar-summary"]} data-slot="dashboard-sidebar-summary">
                <span className={styles["menu-item-label"]} data-slot="dashboard-sidebar-item-label">
                  <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
                  <span>{copy.transactions.title}</span>
                </span>
              </summary>
              <ul className={styles["sidebar-submenu"]} data-slot="dashboard-sidebar-submenu">
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <span
                      className={`${styles["menu-icon"]} ${styles["menu-icon-sub"]}`}
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                    />
                    <span>{copy.transactions.history}</span>
                  </a>
                </li>
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <span
                      className={`${styles["menu-icon"]} ${styles["menu-icon-sub"]}`}
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                    />
                    <span>{copy.transactions.integration}</span>
                  </a>
                </li>
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <span
                      className={`${styles["menu-icon"]} ${styles["menu-icon-sub"]}`}
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                    />
                    <span>{copy.transactions.reports}</span>
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.cashFlow}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.budget}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.investments}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.learningCenter}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
              <span>{copy.support}</span>
            </a>
          </li>
        </ul>
      </nav>

      <section
        className={styles["upgrade-card"]}
        data-slot="dashboard-sidebar-upgrade-card"
        aria-label={copy.upgrade.title}
      >
        <h3 className={styles["upgrade-title"]} data-slot="dashboard-sidebar-upgrade-title">
          <span className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
          <span>{copy.upgrade.title}</span>
        </h3>
        <p>{copy.upgrade.subtitle}</p>
        <button type="button" className={styles["upgrade-btn"]} data-slot="dashboard-sidebar-upgrade-button">
          {copy.upgrade.cta}
        </button>
      </section>
    </aside>
  );
}
