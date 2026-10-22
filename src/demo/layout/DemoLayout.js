import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DemoBanner from '../components/DemoBanner';
import DemoHeader from '../components/DemoHeader';
import DemoFooter from '../components/DemoFooter';
import DemoActionModal from '../components/DemoActionModal';
import styles from './DemoLayout.module.css';
export default function DemoLayout({ children }) {
    return (_jsxs("div", { className: styles.wrapper, children: [_jsx(DemoBanner, {}), _jsx(DemoHeader, {}), _jsx("main", { className: styles.main, children: children }), _jsx(DemoFooter, {}), _jsx(DemoActionModal, {})] }));
}
