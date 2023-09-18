import PageManger, { usePageStates } from "./PageManager";

export default function PageProvider({ children }) {
    return <PageManger>{children}</PageManger>
}

export { usePageStates };