import { ReactNode } from "react";

export interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo: string;
}