import { useRouter } from "next/navigation";

export const useNav = () => {
  const router = useRouter();

  const push = (link: string) => router.push(link);

  return { push };
};
