import type {
  DashboardSidebarAriaViewModel,
  DashboardSidebarViewModel,
} from "../../modules/dashboard/domain/dashboard.types";
import { SidebarIconFrame } from "./sidebar-icons";
import styles from "./DashboardSidebar.module.css";

type DashboardSidebarProps = {
  copy: DashboardSidebarViewModel;
  aria: DashboardSidebarAriaViewModel;
  componentId: string;
};

const sidebarIcons = {
  dashboard: "/icons/sidebar/dashboard.svg",
  accounts: "/icons/sidebar/accounts.svg",
  transactions: "/icons/sidebar/transactions.svg",
  cashFlow: "/icons/sidebar/cash-flow.svg",
  budget: "/icons/sidebar/budget.png",
  investments: "/icons/sidebar/investments.svg",
  learningCenter: "/icons/sidebar/learning-center.svg",
  support: "/icons/sidebar/support.svg",
} as const;

export function DashboardSidebar({ copy, aria, componentId }: DashboardSidebarProps) {
  return (
    <aside
      className={`dashboard-sidebar-slot motion-enter-left ${styles.sidebar}`}
      aria-label={aria.sidebar}
      data-component={componentId}
      data-slot="dashboard-sidebar"
    >
      <nav aria-label={aria.mainNav} className={styles["sidebar-nav"]} data-slot="dashboard-sidebar-nav">
        <ul className={styles["sidebar-menu"]} data-slot="dashboard-sidebar-menu">
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#resumo">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.dashboard}
              />
              <span>{copy.dashboard}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.accounts}
              />
              <span>{copy.accounts}</span>
            </a>
          </li>
          <li>
            <details className={styles["sidebar-accordion"]} data-slot="dashboard-sidebar-accordion" open>
              <summary className={styles["sidebar-summary"]} data-slot="dashboard-sidebar-summary">
                <span className={styles["menu-item-label"]} data-slot="dashboard-sidebar-item-label">
                  <SidebarIconFrame
                    className={styles["menu-icon"]}
                    data-slot="dashboard-sidebar-icon"
                    aria-hidden="true"
                    src={sidebarIcons.transactions}
                  />
                  <span>{copy.transactions.title}</span>
                </span>
              </summary>
              <ul className={styles["sidebar-submenu"]} data-slot="dashboard-sidebar-submenu">
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <SidebarIconFrame
                      className={styles["menu-icon"]}
                      size="sub"
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                      src={sidebarIcons.transactions}
                    />
                    <span>{copy.transactions.history}</span>
                  </a>
                </li>
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <SidebarIconFrame
                      className={styles["menu-icon"]}
                      size="sub"
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                      src={sidebarIcons.transactions}
                    />
                    <span>{copy.transactions.integration}</span>
                  </a>
                </li>
                <li>
                  <a className={styles["sidebar-subitem"]} data-slot="dashboard-sidebar-subitem" href="#">
                    <SidebarIconFrame
                      className={styles["menu-icon"]}
                      size="sub"
                      data-slot="dashboard-sidebar-subicon"
                      aria-hidden="true"
                      src={sidebarIcons.transactions}
                    />
                    <span>{copy.transactions.reports}</span>
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.cashFlow}
              />
              <span>{copy.cashFlow}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.budget}
              />
              <span>{copy.budget}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.investments}
              />
              <span>{copy.investments}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.learningCenter}
              />
              <span>{copy.learningCenter}</span>
            </a>
          </li>
          <li>
            <a className={styles["sidebar-item"]} data-slot="dashboard-sidebar-item" href="#">
              <SidebarIconFrame
                className={styles["menu-icon"]}
                data-slot="dashboard-sidebar-icon"
                aria-hidden="true"
                src={sidebarIcons.support}
              />
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
          <SidebarIconFrame className={styles["menu-icon"]} data-slot="dashboard-sidebar-icon" aria-hidden="true" />
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
