import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUsers = (limit = 100) => {
    return useQuery({
        queryKey: ['users', limit],

        queryFn: async () => {
            const response = await axios.get(
                `https://dummyjson.com/users?limit=${limit}`
            );

            return response.data.users;
        },

        staleTime: 5 * 60 * 1000,

        retry: 2,

        select: (data) =>
            data.map((user) => ({
                ...user,

                fullName: `${user.firstName} ${user.lastName}`,

                fullAddress:
                    `${user.address?.address ?? ''}, ` +
                    `${user.address?.city ?? ''}`,

                bankSummary: user.bank
                    ? `${user.bank.cardType} ••••${user.bank.cardNumber?.slice(-4)}`
                    : 'N/A',
            })),
    });
};