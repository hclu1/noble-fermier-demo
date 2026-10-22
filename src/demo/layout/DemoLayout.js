import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import DemoBanner from '../components/DemoBanner';
import DemoHeader from '../components/DemoHeader';
import DemoFooter from '../components/DemoFooter';
import DemoActionModal from '../components/DemoActionModal';
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoLayout.module.css';
export default function DemoLayout({ children }) {
    const { deviceMode } = useDemoContext();
    return (_jsxs("div", { className: styles.wrapper, children: [_jsx(DemoBanner, {}), deviceMode === 'mobile' ? (
            /* ─── Mode Simulateur Smartphone ─── */
            _jsxs("div", { className: styles.mobileStage, children: [_jsxs("div", { className: styles.stageHeader, children: [_jsx("span", { className: styles.stageBadge, children: "Simulateur iOS / Android" }), _jsx("span", { children: "\uD83D\uDCF1 Format smartphone 390 \u00D7 844 \u00B7 D\u00E9filement tactile actif" })] }), _jsxs("div", { className: styles.phoneCase, children: [_jsx("div", { className: styles.islandPill, children: _jsx("div", { className: styles.cameraLens }) }), _jsxs("div", { className: styles.phoneScreen, children: [_jsx(DemoHeader, {}), _jsx("main", { className: styles.main, children: children }), _jsx(DemoFooter, {})] }), _jsx("div", { className: styles.homeIndicator })] })] })) : (
            /* ─── Mode Normal Plein Écran (PC) ─── */
            _jsxs(_Fragment, { children: [_jsx(DemoHeader, {}), _jsx("main", { className: styles.main, children: children }), _jsx(DemoFooter, {})] })), _jsx(DemoActionModal, {})] }));
}
