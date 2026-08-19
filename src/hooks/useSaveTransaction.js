import { useMutation } from '@tanstack/react-query';

const mockApi = (payload) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.3) {
                resolve({
                    data: {
                        ...payload,
                    },
                });
            } else {
                reject(
                    new Error(
                        'Server error — transaction rolled back',
                    ),
                );
            }
        }, 1000);
    });

export const useSaveTransaction = () =>
    useMutation({
        mutationFn: (payload) => mockApi(payload),
    });