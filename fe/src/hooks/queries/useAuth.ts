import { useMutation } from "@tanstack/react-query";
import { signup, login } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};

export const useLogin = () => {
  const { login: saveAuth } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveAuth(data.token, data.user);
    },
  });
};
