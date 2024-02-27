import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  return {
    navigateTo: (link: string) => router.push(link),
    refresh: () => router.refresh(),
  };
};

export const useParameters = () => {
  const params = useParams();

  return { params };
};
