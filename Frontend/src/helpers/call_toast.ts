import { toast } from 'react-toastify';

export default function callToast(status: 'warning' | 'error' | 'success', message: string) {
    switch (status) {
        case 'error': {
            toast.error('🦄' + message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            break;
        }
        case 'warning': {
            toast.warn('🦄' + message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            break;
        }
        case 'success': {
            toast.success('🦄' + message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            break;
        }
    }
}
