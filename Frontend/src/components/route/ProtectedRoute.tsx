import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Route, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';

interface IProtectedRouteProps {
    element: any;
    path: string;
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({
    element: Component,
    path,
    ...restProps
}) => {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state: RootState) => state.user);

    if (user === null) {
        navigate('/login');
    }

    return <>{!loading && <Route path={path} element={<Component {...restProps} />} />}</>;
};
