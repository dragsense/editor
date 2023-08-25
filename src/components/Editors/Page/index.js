
import PageProvider from "./PageProvider";
import Editor from './Editor';

export default function PageEditor({ children, _id, pageType, onBack }) {


    return (
        <PageProvider>
            <Editor _id={_id} pageType={pageType} onBack={onBack}>{children}</Editor>
        </PageProvider>
    );
};