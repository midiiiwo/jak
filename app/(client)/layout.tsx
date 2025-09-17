import { ContentLayout } from "../content-layout";

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <ContentLayout>{children}</ContentLayout>;
}
