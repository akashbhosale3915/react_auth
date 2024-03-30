import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    if (error.response.data && typeof error.response.data === 'object') {
      return toast.error((error.response.data as { message: string }).message);
    }
  } else if (error.request) {
    if (error.request.code === 'ERR_NETWORK') {
      toast.error('No internet connection');
    }
  } else {
    console.log(error);
  }
};
